import paramiko

HOST = "143.198.172.79"
USER = "master_mike"
PASSWORD = "Cc!!!02272000"
SYS_USER = "fhxqmtwrrw"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=30)

def run(cmd):
    _, o, e = ssh.exec_command(cmd, get_pty=True)
    return o.read().decode("utf-8", errors="replace").strip()

print("whoami:", run("whoami"))
print("home:", run("echo $HOME"))
print("id:", run("id"))
print("pwd:", run("pwd"))
print("ls ~:", run("ls ~"))
print()
print("Can write to ~?", run("touch ~/test_write && echo YES || echo NO"))
print("rm ~/test_write:", run("rm ~/test_write 2>/dev/null; echo ok"))
print()
# Check if sftp to home works
sftp = ssh.open_sftp()
try:
    home = run("echo $HOME")
    sftp.listdir(home)
    print(f"SFTP listdir {home}: OK")
except Exception as e:
    print(f"SFTP listdir home failed: {e}")

# Try /tmp
try:
    sftp.listdir("/tmp")
    print("SFTP /tmp: OK")
    # Try writing to tmp
    with sftp.open("/tmp/test123.txt", "w") as f:
        f.write("test")
    print("SFTP write /tmp: OK")
    sftp.remove("/tmp/test123.txt")
except Exception as e:
    print(f"SFTP /tmp failed: {e}")

sftp.close()

# Check app dir
print()
print("App dir exists?", run(f"ls {'/home/' + SYS_USER + '/applications/' + SYS_USER} 2>&1 | head -5"))
print()
# Check node/npm/pm2
print("node:", run("node --version 2>/dev/null || echo missing"))
print("npm:", run("npm --version 2>/dev/null || echo missing"))
print("pm2:", run("pm2 --version 2>/dev/null || which pm2 2>/dev/null || echo missing"))
print("pm2 path:", run("which pm2 2>/dev/null || ls /usr/local/bin/pm2 2>/dev/null || echo missing"))

ssh.close()
