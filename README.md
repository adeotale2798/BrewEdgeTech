# Brew EdgeTech

The Brew EdgeTech marketing site and admin CMS, built with Next.js and MongoDB.

## Run the app

From the repository folder in PowerShell, prepare the environment and install
the dependencies:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
notepad .env.local
npm ci
npm run dev
```

Set `MONGO_URL`, `DB_NAME`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and
`ADMIN_SESSION_SECRET` in `.env.local` before starting the app. Generate a
unique session secret with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Open <http://localhost:3001> for the website and
<http://localhost:3001/admin> for the admin CMS. The development server uses
port `3001`; MongoDB must be available locally or through Atlas.

For more detail, including production build/start commands and MongoDB Atlas
configuration, see [LOCAL_RUN.md](./LOCAL_RUN.md).

## Hosting

Use GitHub to store the code, a Node.js host (such as Vercel) to run the app,
and MongoDB Atlas for the database. GitHub Pages is not suitable because the
admin and API require a running server.

For the Oracle Linux VM deployment with GoDaddy DNS, Nginx, MongoDB Atlas,
and HTTPS setup, follow [ORACLE_VM_DEPLOYMENT.md](./ORACLE_VM_DEPLOYMENT.md).
To add a Windows SSH login key to the VM, follow
[ORACLE_VM_SSH_KEY.md](./ORACLE_VM_SSH_KEY.md).

## Initialize MongoDB

After configuring MongoDB, sign in to `/admin` and choose **Import built-in
data** on the overview page. It adds the built-in service, pricing, FAQ, demo,
homepage copy and visibility, mobile preview, SEO and footer defaults, and
version history only when those records are missing; existing MongoDB records
are never overwritten. The technology-stack defaults are included; admins can
edit and publish the displayed list in **Website settings**. Published
portfolio records also appear in the public Selected Work section. The same
safe, repeatable import is available from a terminal with `npm run seed`.
