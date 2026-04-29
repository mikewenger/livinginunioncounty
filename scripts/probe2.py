import paramiko

HOST = "143.198.172.79"
USER = "master_mike"
PASSWORD = "Cc!!!02272000"
SYS_USER = "fhxqmtwrrw"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=30)

def run(cmd):
    _, o, _ = ssh.exec_command(cmd, get_pty=True)
    return o.read().decode("utf-8", errors="replace").strip()

# Check app dirs
print("=== /home/master/applications ===")
print(run("ls /home/master/applications/ 2>&1 | head -20"))
print()
print("=== find our app ===")
print(run(f"find /home/master/applications -name '*{SYS_USER}*' -maxdepth 3 2>&1 | head -10"))
print()
print(run(f"ls /home/master/applications/ | grep -i {SYS_USER[:6]}"))
print()
# Look for our app by checking recent dirs
print("=== most recently created app dirs ===")
print(run("ls -lt /home/master/applications/ | head -5"))
print()
print("=== app dir contents ===")
# Try to find the new app
dirs = run("ls /home/master/applications/").split()
print("All app dirs:", dirs[:10])

# SFTP with explicit path
sftp = ssh.open_sftp()
try:
    items = sftp.listdir("/home/master")
    print("\nSFTP /home/master:", items)
    with sftp.open("/home/master/test.txt", "w") as f:
        f.write("test")
    print("SFTP write to /home/master: OK")
    sftp.remove("/home/master/test.txt")
except Exception as e:
    print(f"SFTP /home/master failed: {e}")

# Try the app's public_html path
print()
print("=== check new app public_html ===")
new_app = run(f"ls -lt /home/master/applications/ | head -3")
print(new_app)

ssh.close()
