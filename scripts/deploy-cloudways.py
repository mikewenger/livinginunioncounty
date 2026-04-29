"""
Deploy Next.js standalone build to Cloudways server via SSH/SFTP.
"""
import paramiko
import tarfile
from pathlib import Path

HOST = "143.198.172.79"
USER = "master_mike"
PASSWORD = "Cc!!!02272000"
SYS_USER = "fhxqmtwrrw"
APP_DIR = f"/home/{SYS_USER}/applications/{SYS_USER}"
APP_PORT = 3010
STANDALONE = Path(__file__).parent.parent / ".next" / "standalone"


def run(ssh, cmd, desc=""):
    if desc:
        print(f"  => {desc}")
    _, stdout, stderr = ssh.exec_command(cmd, get_pty=True)
    out = stdout.read().decode("utf-8", errors="replace")
    for line in out.strip().splitlines()[-4:]:
        if line.strip():
            print(f"     {line.strip()}")
    return out


def make_tarball():
    tarball = Path(__file__).parent.parent / "deploy.tar.gz"
    print(f"Packaging standalone build ...")
    with tarfile.open(tarball, "w:gz") as tar:
        tar.add(STANDALONE, arcname="ucapp")
    mb = tarball.stat().st_size / 1024 / 1024
    print(f"  {tarball.name} — {mb:.1f} MB")
    return tarball


def upload(ssh, tarball):
    print("Uploading ...")
    sftp = ssh.open_sftp()
    remote = f"/home/{USER}/deploy.tar.gz"
    sftp.put(str(tarball), remote,
             callback=lambda d, t: print(f"\r  {d/t*100:.0f}%  ", end="", flush=True))
    print()
    sftp.close()
    return remote


def deploy():
    print(f"\nConnecting to {HOST} ...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=30)
    print("Connected.\n")

    # Install PM2 globally with sudo
    run(ssh, f"echo '{PASSWORD}' | sudo -S npm install -g pm2 --quiet 2>&1 | tail -2",
        "Install PM2 globally")

    # Stop existing app
    run(ssh, "pm2 stop livinginunioncounty 2>/dev/null; pm2 delete livinginunioncounty 2>/dev/null; echo ok",
        "Stop existing process")

    # Upload tarball
    tarball = make_tarball()
    remote_tar = upload(ssh, tarball)

    # Extract
    run(ssh, f"""
echo '{PASSWORD}' | sudo -S bash -c '
rm -rf {APP_DIR}/ucapp
mkdir -p {APP_DIR}/ucapp
tar -xzf {remote_tar} -C {APP_DIR}
chown -R {SYS_USER}:{SYS_USER} {APP_DIR}/ucapp
echo extracted
'
""", "Extract to server")

    # Create logs dir
    run(ssh, f"echo '{PASSWORD}' | sudo -S mkdir -p /home/{SYS_USER}/logs && "
             f"echo '{PASSWORD}' | sudo -S chown {SYS_USER}:{SYS_USER} /home/{SYS_USER}/logs",
        "Create logs directory")

    # Start with PM2 as the app sys_user
    run(ssh, f"""echo '{PASSWORD}' | sudo -S -u {SYS_USER} bash -c '
PORT={APP_PORT} NODE_ENV=production pm2 start {APP_DIR}/ucapp/server.js \\
  --name livinginunioncounty \\
  -e /home/{SYS_USER}/logs/err.log \\
  -o /home/{SYS_USER}/logs/out.log
pm2 save
echo started
'""", "Start Next.js with PM2")

    # Find nginx vhost config for this app
    out = run(ssh, f"find /etc/nginx/ -name '*.conf' | xargs grep -l '{SYS_USER}' 2>/dev/null | head -1",
              "Find nginx vhost")
    vhost = out.strip().splitlines()[-1] if out.strip() else ""
    print(f"     vhost: {vhost}")

    if vhost:
        # Write new nginx config via heredoc
        nginx = f"""server {{
    listen 80;
    server_name phpstack-680275-6385181.cloudwaysapps.com livinginunioncounty.com www.livinginunioncounty.com;

    location /_next/static/ {{
        alias {APP_DIR}/ucapp/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}

    location / {{
        proxy_pass http://127.0.0.1:{APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }}
}}"""
        # Write config using tee
        sftp = ssh.open_sftp()
        with sftp.open("/tmp/uc_nginx.conf", "w") as f:
            f.write(nginx)
        sftp.close()
        run(ssh, f"echo '{PASSWORD}' | sudo -S cp /tmp/uc_nginx.conf {vhost} && "
                 f"echo '{PASSWORD}' | sudo -S nginx -t && "
                 f"echo '{PASSWORD}' | sudo -S service nginx reload && echo reloaded",
            "Update and reload nginx")
    else:
        print("     WARNING: Could not find nginx vhost — configure manually")

    # Verify
    run(ssh, "pm2 list", "PM2 process list")
    run(ssh, f"curl -s -o /dev/null -w '%{{http_code}}' http://127.0.0.1:{APP_PORT}/",
        "Test local HTTP")

    # Clean up
    run(ssh, f"rm -f {remote_tar}", "Clean up tarball")
    ssh.close()

    print(f"\nDeployment complete!")
    print(f"URL: http://phpstack-680275-6385181.cloudwaysapps.com")


if __name__ == "__main__":
    deploy()
