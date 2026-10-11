# Brew EdgeTech production deployment on Oracle Cloud

This runbook documents the live Brew EdgeTech deployment and the steps used
to reproduce it. The production host described here is **Oracle Linux Server
9 (aarch64/ARM)**, not Ubuntu. Use `dnf`, Oracle Linux firewall tooling, and
Nginx configuration under `/etc/nginx/conf.d/`; do not run Ubuntu `apt` or
`sites-available` commands on this host.

The VM is shared with other services. Preserve their Nginx configuration,
ports, certificates, and system services. In particular, do not remove other
files from `/etc/nginx/conf.d/`, replace another service's certificate, or
open the Next.js port to the internet.

## Live deployment layout

| Setting | Production value |
| --- | --- |
| Domain | `brewedgetech.com` and `www.brewedgetech.com` |
| GitHub repository | `https://github.com/adeotale27/BrewEdgeTech.git` |
| VM login account | `opc` |
| App service account | `brewedgetech` |
| App directory | `/var/www/brewedgetech/app` |
| Environment file | `/etc/brewedgetech.env` |
| systemd unit | `/etc/systemd/system/brewedgetech.service` |
| Node listener | `127.0.0.1:3002` |
| Nginx site | `/etc/nginx/conf.d/brewedgetech.conf` |
| ACME webroot | `/var/www/acme-challenge` |
| Nginx certificate paths | `/etc/nginx/ssl/brewedgetech.com/` |
| MongoDB database | `brew_edgetech` |

The existing app health endpoint is `/api/health`; a healthy response reports
`"status":"ok"` and `"database":"connected"`. Example VM IP addresses and
certificate dates in earlier notes are intentionally not treated as fixed:
verify current DNS and certificate state before making changes.

## Where to run each command

- **Windows PowerShell:** connect to the VM and check the public site.
- **Oracle Linux VM (SSH):** run the Linux commands after connecting. They
  are Bash commands, not PowerShell commands.
- **Oracle Cloud, GoDaddy, and Atlas consoles:** configure network access,
  DNS, and MongoDB.

Do not paste private keys, passwords, complete MongoDB URIs, or the contents
of `/etc/brewedgetech.env` into GitHub, chat, or logs.

## 1. Prepare Oracle Cloud, Atlas, and DNS

### Oracle Cloud network rules

1. Use a public subnet with a route to an Internet Gateway and a stable
   reserved public IPv4 address for the VM.
2. In the instance's Network Security Group or subnet Security List, allow
   inbound TCP 22 only from your trusted public IP (CIDR `/32`).
3. Allow inbound TCP 80 and 443 from the internet for HTTP, HTTPS, and
   certificate validation.
4. Do **not** allow public inbound TCP 3002 or 27017. Nginx proxies to the
   app on localhost; MongoDB is hosted by Atlas.
5. Do not add an AAAA record unless IPv6 is configured and tested from
   Oracle Cloud through the host firewall and Nginx.

### MongoDB Atlas

1. Use a dedicated Atlas database user for the application, not an Atlas
   account login.
2. In **Security → Network Access / IP Access List**, allow the VM's current
   public IPv4 as a single `/32` entry. Do not use `0.0.0.0/0`.
3. Copy the Atlas `mongodb+srv://` URI. URL-encode reserved characters in
   the database username/password. Keep the URI private.
4. Use a cluster region close to the VM. Confirm both the Atlas database
   user and network access list before troubleshooting application code.

### GoDaddy DNS

In **Domain Portfolio → brewedgetech.com → DNS**, configure the intended
records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | The VM's current reserved public IPv4 |
| CNAME | `www` | `brewedgetech.com` |

Remove only obsolete/conflicting website A/CNAME records. Preserve GoDaddy
nameserver, SOA, `_domainconnect`, `_dmarc`, MX, and TXT records unless you
know a specific record is obsolete. An old AAAA record should be removed if
the VM has no working IPv6. DNS propagation can take time; verify the
authoritative and public answers before certificate issuance.

## 2. Connect to the VM from Windows PowerShell

Open **Windows PowerShell** on your computer. Replace the key path and IP
with your actual values:

```powershell
$VmIp = "YOUR_VM_PUBLIC_IP"
$KeyPath = "$HOME\.ssh\oracle_vm_brewedgetech"
Test-Path $KeyPath
ssh -i $KeyPath opc@$VmIp
```

`Test-Path` must return `True`. The login for this Oracle Linux VM is `opc`;
it is not the `ubuntu` account. If you need a new SSH key, follow
[ORACLE_VM_SSH_KEY.md](./ORACLE_VM_SSH_KEY.md). Keep the current SSH session
open while testing any replacement key.

## 3. Inspect the shared VM before changing it

Run these checks in the **Oracle Linux VM SSH session** before installing
packages or editing service configuration:

```bash
cat /etc/os-release
uname -m
node -v
npm -v
git --version
sudo ss -ltnp
df -h /
free -h
sudo nginx -t
sudo ls -la /etc/nginx/conf.d/
sudo systemctl status nginx --no-pager
sudo firewall-cmd --state
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --list-all
```

Confirm the host is Oracle Linux 9 and `uname -m` is `aarch64`. Check current
disk/memory capacity, active listeners, and existing Nginx site files. The VM
also runs other applications; don't stop, upgrade, or overwrite their
services as part of this site's deployment.

If `firewalld` is active, verify SSH is already allowed before reloading any
firewall rules. Add only HTTP and HTTPS if they are missing:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

These commands preserve existing services and ports. Do not start, stop, or
reset the firewall on a shared VM without confirming the active SSH rule and
Oracle Cloud ingress rules first.

## 4. Install prerequisites if this is a fresh VM

The live VM uses Node.js 22. Next.js 16 needs Node.js 20.9 or newer. A system
Node.js upgrade affects every Node app on a shared host, so check compatibility
before changing an already-provisioned server.

**Oracle Linux VM (SSH session):**

```bash
sudo dnf install -y git gcc-c++ make curl
curl -fsSL https://rpm.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo dnf install -y nodejs
rm -f /tmp/nodesource_setup.sh
node -v
npm -v
```

Create the dedicated app account only if it does not already exist:

```bash
if ! id brewedgetech >/dev/null 2>&1; then
  sudo useradd --system --create-home \
    --home-dir /var/www/brewedgetech \
    --shell /sbin/nologin brewedgetech
fi
sudo install -d -o brewedgetech -g brewedgetech /var/www/brewedgetech/app
id brewedgetech
```

Do not recursively change ownership of `/var/www` or the entire VM. Only
manage the Brew EdgeTech app directory and files.

## 5. Clone and build the application

The GitHub URL in this guide is the repository URL for this project. Clone it
only into a new, empty app directory. **Do not clone over the live app or
delete its directory.**

```bash
sudo -u brewedgetech -H git clone \
  --branch main \
  --depth 1 \
  https://github.com/adeotale27/BrewEdgeTech.git \
  /var/www/brewedgetech/app
```

Build on the VM so native dependencies match Oracle Linux ARM:

```bash
sudo -u brewedgetech -H bash -c '
  set -e
  cd /var/www/brewedgetech/app
  npm ci
  NEXT_PUBLIC_BASE_URL=https://brewedgetech.com npm run build
'
```

The build runs the repository's postbuild asset-copy step. Verify the files
needed by the standalone server exist:

```bash
sudo -u brewedgetech test -f /var/www/brewedgetech/app/.next/standalone/server.js \
  && echo "Standalone server: OK"
sudo -u brewedgetech test -d /var/www/brewedgetech/app/.next/static \
  && echo "Static assets: OK"
```

Do not proceed unless the build succeeds and both checks print `OK`.

## 6. Configure production environment variables

Create the environment file outside the Git checkout:

```bash
sudo install -o root -g brewedgetech -m 0640 /dev/null /etc/brewedgetech.env
sudo nano /etc/brewedgetech.env
```

Set these values, replacing all placeholders. Keep the MongoDB URI on one
line and URL-encode reserved URI characters:

```dotenv
NODE_ENV=production
HOSTNAME=127.0.0.1
PORT=3002
MONGO_URL=mongodb+srv://DB_USER:URL_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
DB_NAME=brew_edgetech
ADMIN_USERNAME=choose-a-private-admin-name
ADMIN_PASSWORD=use-a-unique-long-random-password
ADMIN_SESSION_SECRET=replace-with-generated-secret
NEXT_PUBLIC_BASE_URL=https://brewedgetech.com
CORS_ORIGINS=https://brewedgetech.com,https://www.brewedgetech.com
```

Generate a distinct session secret:

```bash
openssl rand -hex 32
```

Paste the generated value as `ADMIN_SESSION_SECRET`; do not use it as the
admin password. Avoid shell syntax or quotes in the password if possible.
Never copy the `.env.example` placeholder values into production. In nano,
save with `Ctrl+O`, press `Enter`, and exit with `Ctrl+X`.

Set and verify permissions without printing secret values:

```bash
sudo chown root:brewedgetech /etc/brewedgetech.env
sudo chmod 0640 /etc/brewedgetech.env
sudo stat -c '%a %U %G %n' /etc/brewedgetech.env
sudo grep -E '^[A-Za-z_][A-Za-z0-9_]*=' /etc/brewedgetech.env \
  | sed 's/=.*/=<configured>/'
```

Expected permissions are `640 root brewedgetech`. Keep optional
`MONGO_SEED_HOSTS` and `MONGO_REPLICA_SET` unset unless Atlas SRV discovery
fails and you have validated the fallback seed hosts and replica set.

## 7. Configure the app as a systemd service

Create `/etc/systemd/system/brewedgetech.service`:

```bash
sudo nano /etc/systemd/system/brewedgetech.service
```

Use:

```ini
[Unit]
Description=Brew EdgeTech Next.js Application
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=brewedgetech
Group=brewedgetech
WorkingDirectory=/var/www/brewedgetech/app
EnvironmentFile=/etc/brewedgetech.env
Environment=NODE_ENV=production
Environment=HOSTNAME=127.0.0.1
Environment=PORT=3002
ExecStart=/usr/bin/node /var/www/brewedgetech/app/.next/standalone/server.js
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Save/exit nano, load the unit, and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now brewedgetech
sudo systemctl status brewedgetech --no-pager -l
sudo ss -ltnp | grep ':3002'
curl -fsS http://127.0.0.1:3002/api/health
```

The listener must be `127.0.0.1:3002`; the health JSON must say the database
is connected. If it fails, stop here and inspect:

```bash
sudo journalctl -u brewedgetech -n 100 --no-pager
```

Check Atlas access, URI credentials, and URL encoding before changing app
code. Do not expose port 3002 in Oracle Cloud networking.

## 8. Configure Nginx without disturbing other sites

Before editing Nginx, inspect its configuration and look for existing
`server_name` declarations. Back up only this site's config if it already
exists. Do not remove or replace unrelated files such as
`oi-pulse.conf` or `admin.striklenz.conf`.

Create the ACME webroot and a harmless HTTP challenge test file:

```bash
sudo mkdir -p /var/www/acme-challenge/.well-known/acme-challenge
sudo chown -R opc:opc /var/www/acme-challenge
sudo chmod 755 /var/www/acme-challenge
echo "brewedgetech-acme-test" > /var/www/acme-challenge/.well-known/acme-challenge/test
```

Create `/etc/nginx/conf.d/brewedgetech.conf` (back it up first if it exists):

```bash
sudo nano /etc/nginx/conf.d/brewedgetech.conf
```

For initial HTTP setup and ACME validation, use:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name brewedgetech.com www.brewedgetech.com;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/acme-challenge;
        default_type text/plain;
        try_files $uri =404;
    }

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Validate and reload only if the config test succeeds:

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -fsS http://127.0.0.1/.well-known/acme-challenge/test
```

From Windows PowerShell or another external network, verify the same URL
returns `brewedgetech-acme-test` before issuing a certificate:

```powershell
Invoke-WebRequest http://brewedgetech.com/.well-known/acme-challenge/test
Invoke-WebRequest http://www.brewedgetech.com/.well-known/acme-challenge/test
```

If DNS is still propagating, don't request the certificate yet. Check the
Oracle network rules, host firewall, DNS records, and the HTTP challenge path.

## 9. Issue and install HTTPS certificates

The live deployment used **acme.sh** and Nginx. Certbot was found broken on
that host, so do not run Certbot and acme.sh against the same Nginx site
without first deciding which tool owns certificate renewal.

First check whether acme.sh and a valid certificate already exist:

```bash
sudo -u opc -H test -x /home/opc/.acme.sh/acme.sh \
  && echo "acme.sh: OK"
sudo ls -l /home/opc/.acme.sh/brewedgetech.com_ecc/
sudo openssl x509 \
  -in /home/opc/.acme.sh/brewedgetech.com_ecc/fullchain.cer \
  -noout -subject -issuer -dates -ext subjectAltName
```

If the existing certificate is valid, do not issue a replacement just to
follow this section. If this is a new VM and acme.sh is not installed, install
it from its official project instructions as the `opc` user. After setting
up the HTTP challenge webroot above, issue a certificate for both names:

```bash
sudo -u opc -H /home/opc/.acme.sh/acme.sh --issue \
  --server letsencrypt \
  -d brewedgetech.com \
  -d www.brewedgetech.com \
  -w /var/www/acme-challenge
```

The live certificate directory is `/home/opc/.acme.sh/brewedgetech.com_ecc/`.
Create a protected Nginx certificate directory:

```bash
sudo install -d -o root -g root -m 0700 /etc/nginx/ssl/brewedgetech.com
```

For initial manual installation, install the full chain and private key
without making the key world-readable:

```bash
sudo install -o root -g root -m 0644 \
  /home/opc/.acme.sh/brewedgetech.com_ecc/fullchain.cer \
  /etc/nginx/ssl/brewedgetech.com/fullchain.pem
sudo install -o root -g root -m 0600 \
  /home/opc/.acme.sh/brewedgetech.com_ecc/brewedgetech.com.key \
  /etc/nginx/ssl/brewedgetech.com/privkey.pem
```

Replace the HTTP server config with the HTTP redirect plus HTTPS server
below. Keep the ACME challenge location on port 80 so renewals can validate:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name brewedgetech.com www.brewedgetech.com;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/acme-challenge;
        default_type text/plain;
        try_files $uri =404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name brewedgetech.com www.brewedgetech.com;

    ssl_certificate /etc/nginx/ssl/brewedgetech.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/brewedgetech.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Validate and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Keep Oracle ingress and the VM firewall open on ports 80 and 443. Check
certificate subject, issuer, dates, and SANs before calling HTTPS deployed.

### Configure automatic certificate installation on renewal

acme.sh can renew a certificate but a manually copied certificate does not
automatically update Nginx's files. Configure an install/deploy hook so each
renewal copies the new files into the Nginx paths and reloads Nginx.

Create private staging paths writable by `opc` and a root-owned helper that
copies only those fixed certificate files:

```bash
sudo -u opc -H mkdir -p /home/opc/cert-deploy/brewedgetech.com
sudo -u opc -H chmod 0700 /home/opc/cert-deploy /home/opc/cert-deploy/brewedgetech.com
sudo tee /usr/local/sbin/deploy-brewedgetech-certificate >/dev/null <<'EOF'
#!/usr/bin/bash
set -euo pipefail
install -o root -g root -m 0644 \
  /home/opc/cert-deploy/brewedgetech.com/fullchain.pem \
  /etc/nginx/ssl/brewedgetech.com/fullchain.pem
install -o root -g root -m 0600 \
  /home/opc/cert-deploy/brewedgetech.com/privkey.pem \
  /etc/nginx/ssl/brewedgetech.com/privkey.pem
nginx -t
systemctl reload nginx
EOF
sudo chown root:root /usr/local/sbin/deploy-brewedgetech-certificate
sudo chmod 0750 /usr/local/sbin/deploy-brewedgetech-certificate
```

Allow `opc` to run only that root-owned helper without an interactive
password prompt. Open the sudoers drop-in with the validator:

```bash
sudo visudo -f /etc/sudoers.d/brewedgetech-cert
```

Add this single line, save, and exit:

```text
opc ALL=(root) NOPASSWD: /usr/local/sbin/deploy-brewedgetech-certificate
```

Register the installed files and renewal hook with acme.sh (run as `opc`):

```bash
sudo -u opc -H /home/opc/.acme.sh/acme.sh --install-cert \
  -d brewedgetech.com \
  --ecc \
  --key-file /home/opc/cert-deploy/brewedgetech.com/privkey.pem \
  --fullchain-file /home/opc/cert-deploy/brewedgetech.com/fullchain.pem \
  --reloadcmd "sudo /usr/local/sbin/deploy-brewedgetech-certificate"
sudo /usr/local/sbin/deploy-brewedgetech-certificate
sudo -u opc -H crontab -l
```

The deploy helper must complete `nginx -t` and reload successfully. Verify
the acme.sh renewal job is present and periodically test the public certificate
expiry. Do not assume auto-renewal is working until the install hook and
scheduled renewal have both been confirmed.

## 10. Verify the running site

**Oracle Linux VM (SSH session):**

```bash
sudo systemctl status brewedgetech --no-pager -l
sudo systemctl status nginx --no-pager
curl -fsS http://127.0.0.1:3002/api/health
curl -sS -I https://brewedgetech.com
curl -sS -I https://www.brewedgetech.com
```

Inspect the certificate served for `www`:

```bash
openssl s_client -connect 127.0.0.1:443 \
  -servername www.brewedgetech.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

**Windows PowerShell (your computer):**

```powershell
Resolve-DnsName brewedgetech.com -Type A
Resolve-DnsName www.brewedgetech.com
Invoke-WebRequest https://brewedgetech.com/api/health
Invoke-WebRequest https://www.brewedgetech.com
```

The root A record should point to the current VM IP, `www` should resolve to
the root domain, and both certificate names should be valid. Check that the
API health response says `"status":"ok"` and `"database":"connected"`.
Sign in at `https://brewedgetech.com/admin`, run **Import built-in data** if
the database has not yet been initialized, and test the CMS and public pages.

## 11. Deploy an application update safely

The current systemd unit uses `/var/www/brewedgetech/app`. To avoid building
over the live `.next` directory, build a separate candidate directory first.
This update method causes a short restart interruption when switching
directories but preserves the previous app for rollback.

Set a release name and clone/build the candidate as the service account:

```bash
release="$(date -u +%Y%m%d%H%M%S)"
candidate="/var/www/brewedgetech/app-$release"
previous="/var/www/brewedgetech/app.previous-$release"
sudo -u brewedgetech -H git clone \
  --branch main \
  --depth 1 \
  https://github.com/adeotale27/BrewEdgeTech.git \
  "$candidate"
sudo -u brewedgetech -H bash -c "
  set -e
  cd '$candidate'
  npm ci
  NEXT_PUBLIC_BASE_URL=https://brewedgetech.com npm run build
"
sudo -u brewedgetech test -f "$candidate/.next/standalone/server.js"
sudo -u brewedgetech test -d "$candidate/.next/static"
```

Do not continue if any clone, install, build, or file check fails. Once the
candidate is built, stop the service and switch the app directory:

```bash
sudo systemctl stop brewedgetech
sudo mv /var/www/brewedgetech/app "$previous"
sudo mv "$candidate" /var/www/brewedgetech/app
sudo systemctl start brewedgetech
sudo systemctl status brewedgetech --no-pager -l
curl -fsS http://127.0.0.1:3002/api/health
printf 'Previous app for rollback: %s\n' "$previous"
```

Test the public site after the health check succeeds. If the new release does
not start or health fails, roll back immediately:

```bash
sudo systemctl stop brewedgetech
sudo mv /var/www/brewedgetech/app "/var/www/brewedgetech/app.failed-$release"
sudo mv "$previous" /var/www/brewedgetech/app
sudo systemctl start brewedgetech
curl -fsS http://127.0.0.1:3002/api/health
```

Run the rollback in the same SSH shell so `$previous` and `$release` still
contain their values. If you reconnect, set them to the exact paths printed
by the deploy command before running the rollback. Keep the previous app
until the new one has been verified. Do not delete older app directories
until you have a separate backup and a confirmed rollback point. This
rollback does not revert MongoDB data.

## Troubleshooting and maintenance

- App service and logs:
  `sudo systemctl status brewedgetech --no-pager -l` and
  `sudo journalctl -u brewedgetech -n 100 --no-pager`.
- Nginx configuration and logs:
  `sudo nginx -t`, `/var/log/nginx/error.log`, and
  `/var/log/nginx/access.log`.
- Check listeners with `sudo ss -ltnp`; app port 3002 must remain bound to
  localhost and not exposed at the VM's public interface.
- A 502 from Nginx usually means the app service is stopped or listening on
  the wrong address/port.
- A database-down health response usually means the Atlas URI/credentials or
  Atlas IP access list is wrong. Inspect service logs but do not dump the
  environment file.
- If ACME validation fails, check public DNS, Oracle ingress, the VM firewall,
  and the test URL under `/.well-known/acme-challenge/`.
- Back up Atlas data and test restoring a backup. Keep the OS, Node.js, and
  application patched; monitor disk, memory, service health, and TLS expiry.
