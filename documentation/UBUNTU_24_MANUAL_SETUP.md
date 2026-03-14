# Ubuntu 24.04 Manual Setup (No Docker / No YAML)

Use this guide if `docker-compose.yml` setup is failing and you want to run the stack directly on Ubuntu.

## 1) Install system dependencies

```bash
sudo apt update
sudo apt install -y curl git build-essential postgresql postgresql-contrib
```

## 2) Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v
```

Expected: Node `v20.x` (or newer), npm `10.x` (or newer).

## 3) Clone repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd ZimBuildHub
```

## 4) Start PostgreSQL and create database

```bash
sudo systemctl enable --now postgresql

sudo -u postgres psql
```

In the PostgreSQL prompt, run:

```sql
CREATE USER zimuser WITH ENCRYPTED PASSWORD 'ChangeThisStrongPassword123';
CREATE DATABASE zimbuild OWNER zimuser;
GRANT ALL PRIVILEGES ON DATABASE zimbuild TO zimuser;
\q
```

## 5) Configure backend environment

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Set these minimum values:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://zimuser:ChangeThisStrongPassword123@localhost:5432/zimbuild?schema=public"

JWT_SECRET=<generate_random_secret>
JWT_REFRESH_SECRET=<generate_random_secret>

CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
```

Generate secrets quickly:

```bash
openssl rand -hex 64
```

You can keep Stripe/Paynow values from the example file during initial local setup.

## 6) Install backend dependencies and run Prisma

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

If you want to run development migrations later:

```bash
npx prisma migrate dev
```

## 7) Configure frontend environment

Open a second terminal in project root:

```bash
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local
```

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 8) Install frontend dependencies

```bash
cd frontend
npm install
```

## 9) Run backend and frontend

Terminal 1 (backend):

```bash
cd backend
npm run start:dev
```

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

## 10) Verify application

- Frontend: `http://localhost:3000`
- Backend docs: `http://localhost:4000/api/docs`

## 11) Useful troubleshooting

### A) Backend cannot connect to database

```bash
sudo systemctl status postgresql
```

Check `DATABASE_URL` in `backend/.env`.

### B) Port already in use

Find process:

```bash
sudo lsof -i :3000
sudo lsof -i :4000
```

Kill process or change `PORT`/`NEXT_PUBLIC_API_URL`.

### C) Prisma migration errors on an old local DB

Development only (will erase data):

```bash
cd backend
npx prisma migrate reset
```

### D) Permission errors in repository folder

```bash
sudo chown -R $USER:$USER .
```

## 12) Notes

- For manual (non-Docker) runs, use `backend/.env` and `frontend/.env.local`.
- Root `.env` is mainly used for Docker Compose workflows.

## 13) Production reverse proxy with your domain (recommended)

Yes, this manual setup works well with reverse proxy. Use this section for:

- Domain: `www.ilifapropertygroup.com`
- Server IP: `104.207.67.240`

### 13.1 Point your DNS to the server

In your DNS provider:

- Create `A` record for `@` → `104.207.67.240`
- Create `A` record for `www` → `104.207.67.240`

Check propagation:

```bash
dig +short ilifapropertygroup.com
dig +short www.ilifapropertygroup.com
```

### 13.2 Set production backend environment

```bash
nano /root/ilifapropertygroup/backend/.env
```

Use/confirm these values:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL="postgresql://zimuser:ChangeThisStrongPassword123@localhost:5432/zimbuild?schema=public"

JWT_SECRET=<PASTE_OPENSSL_OUTPUT_NO_SPACES>
JWT_REFRESH_SECRET=<PASTE_OPENSSL_OUTPUT_NO_SPACES>

CORS_ORIGIN=https://www.ilifapropertygroup.com
FRONTEND_URL=https://www.ilifapropertygroup.com
BACKEND_URL=https://www.ilifapropertygroup.com
```

### 13.3 Set production frontend environment

```bash
nano /root/ilifapropertygroup/frontend/.env.local
```

Set:

```env
NEXT_PUBLIC_API_URL=https://www.ilifapropertygroup.com
NEXT_PUBLIC_APP_URL=https://www.ilifapropertygroup.com
```

### 13.4 Build backend and frontend for production

```bash
unset NODE_ENV

cd /root/ilifapropertygroup/backend
npm install --include=dev
npm run build
npx prisma migrate deploy

cd /root/ilifapropertygroup/frontend
npm install --include=dev
npm run build
```

Notes:

- Use `NODE_ENV=production` only in the systemd service runtime.
- If `NODE_ENV=production` is exported in your shell while building, `npm` can skip dev dependencies and the build may not produce `dist/main.js` or the required Next.js runtime files.

### 13.5 Run apps as systemd services

The ready-to-use unit files are in `server-configs/systemd/` in this repo.
Copy them to the server and install:

```bash
sudo cp /root/ilifapropertygroup/server-configs/systemd/zimbuild-backend.service /etc/systemd/system/
sudo cp /root/ilifapropertygroup/server-configs/systemd/zimbuild-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now zimbuild-backend
sudo systemctl enable --now zimbuild-frontend

sudo systemctl status zimbuild-backend --no-pager
sudo systemctl status zimbuild-frontend --no-pager
```

Or paste them manually:

**Backend** — `sudo nano /etc/systemd/system/zimbuild-backend.service`

```ini
[Unit]
Description=ILifa Property Group Backend (NestJS)
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/ilifapropertygroup/backend
Environment=NODE_ENV=production
Environment=PATH=/usr/bin:/usr/local/bin
EnvironmentFile=/root/ilifapropertygroup/backend/.env
ExecStart=/usr/bin/npm run start:prod
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

**Frontend** — `sudo nano /etc/systemd/system/zimbuild-frontend.service`

```ini
[Unit]
Description=ILifa Property Group Frontend (Next.js)
After=network.target zimbuild-backend.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/ilifapropertygroup/frontend
Environment=NODE_ENV=production
Environment=PATH=/usr/bin:/usr/local/bin
EnvironmentFile=/root/ilifapropertygroup/frontend/.env.local
ExecStart=/usr/bin/npm run start -- -H 127.0.0.1 -p 3000
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable services:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now zimbuild-backend
sudo systemctl enable --now zimbuild-frontend

sudo systemctl status zimbuild-backend --no-pager
sudo systemctl status zimbuild-frontend --no-pager
```

If you see `status=203/EXEC`, run:

```bash
sudo dos2unix /etc/systemd/system/zimbuild-backend.service /etc/systemd/system/zimbuild-frontend.service
sudo systemctl daemon-reload

ls -l /root/ilifapropertygroup/frontend/node_modules/next/dist/bin/next
ls -l /root/ilifapropertygroup/backend/dist/main.js

sudo systemctl restart zimbuild-backend zimbuild-frontend
sudo journalctl -u zimbuild-frontend -n 80 --no-pager
sudo journalctl -u zimbuild-backend -n 80 --no-pager
```

If backend fails with `Cannot find module '/root/ilifapropertygroup/backend/dist/main'`, update to the latest code and rebuild. This project's Nest build outputs to `dist/src/main.js`, and the `start:prod` script has been set accordingly.

### 13.6 Configure Nginx reverse proxy

The ready-to-use Nginx config is also in `server-configs/nginx/ilifapropertygroup`.

```bash
sudo apt install -y nginx
sudo cp /root/ilifapropertygroup/server-configs/nginx/ilifapropertygroup /etc/nginx/sites-available/ilifapropertygroup
```

Or paste it manually: `sudo nano /etc/nginx/sites-available/ilifapropertygroup`

```nginx
server {
    listen 80;
    server_name ilifapropertygroup.com www.ilifapropertygroup.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/ilifapropertygroup /etc/nginx/sites-enabled/ilifapropertygroup
sudo nginx -t
sudo systemctl reload nginx
```

### 13.7 Enable HTTPS (Let’s Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ilifapropertygroup.com -d www.ilifapropertygroup.com
```

Certbot will add SSL config and can auto-redirect HTTP to HTTPS.

### 13.8 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 13.9 Verify

```bash
curl -I http://www.ilifapropertygroup.com
curl -I https://www.ilifapropertygroup.com
curl -I https://www.ilifapropertygroup.com/api/docs
```

If you change `NEXT_PUBLIC_*` variables, rebuild frontend:

```bash
cd /root/ilifapropertygroup/frontend
npm run build
sudo systemctl restart zimbuild-frontend
```
