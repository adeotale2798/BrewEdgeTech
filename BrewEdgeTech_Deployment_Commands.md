BREWEDGETECH — PRODUCTION DEPLOYMENT COMMANDS
Oracle Cloud VM | App directory: /var/www/brewedgetech/app

1. CONNECT TO THE VM (run in Windows PowerShell)
Replace the SSH key path below with the actual path to your private key.

ssh -i "C:\Users\USER\Downloads\ssh-key.key" opc@140.238.245.217


2. CHECK GIT STATUS

sudo -u brewedgetech -H git -C /var/www/brewedgetech/app status

IMPORTANT: If Git reports local changes, inspect them before updating. Do not overwrite changes blindly.


3. FETCH AND UPDATE THE MAIN BRANCH

sudo -u brewedgetech -H git -C /var/www/brewedgetech/app fetch origin main
sudo -u brewedgetech -H git -C /var/www/brewedgetech/app merge --ff-only origin/main

If the merge fails, stop and inspect the Git status/log rather than forcing the update.


4. INSTALL DEPENDENCIES AND BUILD

sudo -u brewedgetech -H bash -c '
cd /var/www/brewedgetech/app &&
npm ci &&
NEXT_PUBLIC_BASE_URL=https://brewedgetech.com npm run build
'

IMPORTANT: If the build fails, do not restart the service. Fix the build error first.


5. RESTART THE APP AND CHECK ITS STATUS

sudo systemctl restart brewedgetech.service
sudo systemctl status brewedgetech.service --no-pager


6. VIEW RECENT APPLICATION LOGS

sudo journalctl -u brewedgetech -n 100 --no-pager

To follow logs live:
sudo journalctl -u brewedgetech -f


7. VERIFY THE APP AND DATABASE HEALTH

curl -I http://127.0.0.1:3002/
curl -sS http://127.0.0.1:3002/api/health

The health endpoint should report a healthy status and a connected database.


8. NGINX CHECKS

sudo nginx -t

Only if you changed the Nginx configuration, reload it after the test succeeds:
sudo systemctl reload nginx


9. CHECK THE PUBLIC WEBSITES

curl -I https://brewedgetech.com
curl -I https://www.brewedgetech.com

If public checks fail while local checks succeed, investigate DNS, Nginx, and TLS before changing the application.


NOTES
- The app runs as the 'brewedgetech' service user on 127.0.0.1:3002.
- The systemd service is brewedgetech.service.
- Do not print or share secrets from /etc/brewedgetech.env.
- This deployment procedure is for BrewEdgeTech only; do not stop or restart oi-pulse-backend.service.
