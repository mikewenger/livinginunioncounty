import paramiko

HOST = "143.198.172.79"
USER = "master_mike"
PASS = "Cc!!!02272000"
APP_USER = "fhxqmtwrrw"
APP_DIR = f"/home/master/applications/{APP_USER}"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=22, username=USER, password=PASS, timeout=30)

def run(cmd):
    _, o, _ = ssh.exec_command(cmd, get_pty=True)
    return o.read().decode("utf-8", errors="replace").strip()

# Check permissions in detail
print("=== App dir permissions ===")
print(run(f"ls -la {APP_DIR}"))

print("\n=== public_html permissions ===")
print(run(f"ls -la {APP_DIR}/public_html/"))

print("\n=== Who am I / groups ===")
print(run("id"))
print(run("groups"))

print("\n=== Can su to app user? ===")
print(run(f"su -s /bin/bash {APP_USER} -c 'echo SUCCESS_SU' 2>&1 || echo FAIL_SU"))

print("\n=== Is su allowed without password? ===")
print(run(f"echo '' | su -s /bin/bash {APP_USER} -c 'whoami' 2>&1"))

print("\n=== Try writing to public_html ===")
print(run(f"touch {APP_DIR}/public_html/test_write && echo YES_PUBLIC_HTML && rm {APP_DIR}/public_html/test_write || echo NO_PUBLIC_HTML"))

print("\n=== Try writing to tmp ===")
print(run(f"touch {APP_DIR}/tmp/test_write && echo YES_TMP && rm {APP_DIR}/tmp/test_write || echo NO_TMP"))

print("\n=== Try writing to private_html ===")
print(run(f"touch {APP_DIR}/private_html/test_write && echo YES_PRIVATE && rm {APP_DIR}/private_html/test_write || echo NO_PRIVATE"))

print("\n=== nginx vhost location ===")
print(run(f"cat /etc/nginx/sites-enabled/fhxqmtwrrw.conf 2>/dev/null | head -30 || echo NOT_FOUND"))
print(run(f"ls /etc/nginx/conf.d/ 2>/dev/null | grep {APP_USER} || echo NO_CONF_D"))

print("\n=== Current nginx config for app ===")
print(run(f"find /etc/nginx -name '*{APP_USER}*' 2>/dev/null"))

ssh.close()
