# Add a new SSH key for Oracle VM access

This guide creates a new SSH key pair on Windows and adds its public key to
the Oracle Linux VM account. An Ed25519 key pair is **not** a CA-signed SSH
certificate. CA-signed SSH certificates require a separate certificate
authority and server-side SSH configuration.

The live Brew EdgeTech VM login user is `opc`. Replace `YOUR_VM_PUBLIC_IP` if
you connect by address. This is an SSH **login key**, not the GitHub deploy
key used to clone a private repository.

## Safety first

- Never share, upload, or paste the private key (the file without `.pub`).
- Copy only the public key (the file ending in `.pub`) to the VM.
- Keep your existing SSH session and key until the new key has been tested
  from a separate PowerShell window.
- Do not remove existing entries from `authorized_keys` or change sshd
  settings as part of adding a key.

## 1. Generate a key pair in Windows PowerShell

Open **Windows PowerShell on your computer**, not the remote SSH shell:

```powershell
New-Item -ItemType Directory -Force -Path "$HOME\.ssh" | Out-Null
$KeyPath = "$HOME\.ssh\oracle_vm_brewedgetech"
ssh-keygen -t ed25519 -a 64 -C "oracle-vm-brewedgetech" -f $KeyPath
```

Enter a strong passphrase when prompted. The files created are:

- Private key: `$HOME\.ssh\oracle_vm_brewedgetech`
- Public key: `$HOME\.ssh\oracle_vm_brewedgetech.pub`

Copy/display only the public key:

```powershell
Get-Content "$KeyPath.pub"
```

Copy the entire single line beginning with `ssh-ed25519`. Do not display or
copy the file without `.pub`.

If OpenSSH rejects the private key because its Windows permissions are too
open, restrict it to your Windows user:

```powershell
icacls $KeyPath /inheritance:r
icacls $KeyPath /grant:r "$($env:USERNAME):(R)"
```

## 2. Add the public key to the VM

Use your **current working key** to connect to the VM:

```powershell
$VmIp = "YOUR_VM_PUBLIC_IP"
ssh opc@$VmIp
```

If needed, specify your existing working key using `ssh -i`.

In the Oracle Linux VM session, back up `authorized_keys` and set secure
permissions. This preserves every existing key:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cp -p ~/.ssh/authorized_keys \
  ~/.ssh/authorized_keys.backup.$(date +%Y%m%d%H%M%S)
```

Read one line from the terminal and append it as a public key:

```bash
read -r -p "Paste the one-line ssh-ed25519 PUBLIC key: " NEW_SSH_KEY
case "$NEW_SSH_KEY" in
  ssh-ed25519\ *) printf '%s\n' "$NEW_SSH_KEY" >> ~/.ssh/authorized_keys ;;
  *) echo "That does not look like an Ed25519 public key."; unset NEW_SSH_KEY; exit 1 ;;
esac
unset NEW_SSH_KEY
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
ssh-keygen -lf ~/.ssh/authorized_keys
```

Confirm the new key's fingerprint appears in the output. Never paste the
private key here.

## 3. Test the new key from a second PowerShell window

Leave the original SSH session open. Open a **second** Windows PowerShell
window and run:

```powershell
$VmIp = "YOUR_VM_PUBLIC_IP"
$KeyPath = "$HOME\.ssh\oracle_vm_brewedgetech"
ssh -o IdentitiesOnly=yes -i $KeyPath opc@$VmIp
```

Enter the key passphrase if prompted. Only after this new session successfully
logs in should you consider retiring an old key. Keep at least one tested
recovery key.

## 4. Optional SSH client alias

In Windows PowerShell, open your SSH client configuration:

```powershell
notepad "$HOME\.ssh\config"
```

Add this block, replacing the VM address:

```text
Host oracle-brewedgetech
    HostName YOUR_VM_PUBLIC_IP
    User opc
    IdentityFile ~/.ssh/oracle_vm_brewedgetech
    IdentitiesOnly yes
```

Save the file and connect with:

```powershell
ssh oracle-brewedgetech
```

## 5. Troubleshoot without locking yourself out

Use the existing working SSH session to inspect permissions and sshd status:

```bash
sudo sshd -t
sudo sshd -T | grep -Ei 'pubkeyauthentication|authorizedkeysfile|passwordauthentication'
ls -ld ~/.ssh
ls -l ~/.ssh/authorized_keys
sudo journalctl -u sshd -n 100 --no-pager
```

The `.ssh` directory should be owned by the login user and mode `700`;
`authorized_keys` should be owned by the login user and mode `600`. Also
check that Oracle Cloud ingress and the host firewall allow TCP port 22.
Do not disable password authentication or change sshd configuration until
the new key is tested and another recovery path is available.

## SSH CA certificate note

`ssh-keygen -t ed25519` creates an ordinary SSH key pair. It does **not**
create a signed SSH certificate. A CA-signed SSH certificate requires an SSH
certificate-authority private key, server trust configuration, principals,
and a validity policy. Do not create a CA or change the VM's sshd settings
unless certificate-based SSH authentication is specifically required.
