import paramiko

HOST = "143.198.172.79"
USER = "master_mike"
PASSWORD = "Cc!!!02272000"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=22, username=USER, password=PASSWORD, timeout=30)

def run(cmd):
    _, o, _ = ssh.exec_command(cmd, get_pty=True)
    return o.read().decode("utf-8", errors="replace").strip()

# Find SFTP root by trying various paths
sftp = ssh.open_sftp()
for path in ["/", ".", "/home/master", "/home", "/var", "/tmp", "applications"]:
    try:
        items = sftp.listdir(path)
        print(f"SFTP '{path}': {items[:5]}")
    except Exception as e:
        print(f"SFTP '{path}' FAIL: {e}")
sftp.close()

# Check if we can write to app dir directly
print()
APP_DIR = "/home/master/applications/fhxqmtwrrw"
print("App dir contents:")
print(run(f"ls {APP_DIR}"))
print()
print("Can write to app dir?")
print(run(f"touch {APP_DIR}/test_write && echo YES && rm {APP_DIR}/test_write || echo NO"))

# Test pipe-based upload
print()
print("Pipe-based upload test...")
transport = ssh.get_transport()
channel = transport.open_session()
channel.exec_command(f"cat > /home/master/test_upload.txt")
channel.sendall(b"Hello from pipe upload!")
channel.shutdown_write()
channel.recv_exit_status()
channel.close()
print(run("cat /home/master/test_upload.txt && rm /home/master/test_upload.txt"))

# npm prefix
print()
print("npm prefix:", run("npm config get prefix"))
print("npm global bin:", run("npm bin -g 2>/dev/null || npm root -g"))

ssh.close()
