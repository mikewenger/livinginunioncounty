import paramiko

HOST = "143.198.172.79"

# Test SSH as the app sys_user
APP_USER = "fhxqmtwrrw"
APP_PASS = "ZA2UzxB97w"

print(f"Testing SSH as {APP_USER}...")
try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=22, username=APP_USER, password=APP_PASS, timeout=15)
    print("SSH connected as app user!")

    def run(cmd):
        _, o, e = ssh.exec_command(cmd, get_pty=True)
        out = o.read().decode("utf-8", errors="replace").strip()
        err = e.read().decode("utf-8", errors="replace").strip()
        return out + ("\n[STDERR: " + err + "]" if err else "")

    print("whoami:", run("whoami"))
    print("pwd:", run("pwd"))
    print("home:", run("echo $HOME"))
    print("ls ~:", run("ls ~"))
    print("ls ~/applications/fhxqmtwrrw:", run("ls ~/applications/fhxqmtwrrw 2>&1 || echo NO_ACCESS"))
    print("Can write?", run("touch ~/applications/fhxqmtwrrw/test_write && echo YES && rm ~/applications/fhxqmtwrrw/test_write || echo NO"))
    ssh.close()
except Exception as e:
    print(f"SSH as app user failed: {e}")
    print("Trying SFTP as app user...")
    try:
        ssh2 = paramiko.SSHClient()
        ssh2.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh2.connect(HOST, port=22, username=APP_USER, password=APP_PASS, timeout=15)
        sftp = ssh2.open_sftp()
        items = sftp.listdir(".")
        print(f"SFTP root '.': {items}")
        try:
            items2 = sftp.listdir("applications/fhxqmtwrrw")
            print(f"SFTP 'applications/fhxqmtwrrw': {items2}")
        except Exception as e2:
            print(f"SFTP app dir: {e2}")
        sftp.close()
        ssh2.close()
    except Exception as e3:
        print(f"SFTP as app user also failed: {e3}")
