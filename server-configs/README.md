# server-configs

Ready-to-use configuration files for deploying ILifa Property Group on Ubuntu 24.04.

## Files

```
server-configs/
├── systemd/
│   ├── zimbuild-backend.service   # NestJS backend service
│   └── zimbuild-frontend.service  # Next.js frontend service
└── nginx/
    └── ilifapropertygroup         # Nginx reverse proxy config
```

## One-time install on the server

```bash
# 1. Copy systemd unit files
sudo cp /root/ilifapropertygroup/server-configs/systemd/zimbuild-backend.service  /etc/systemd/system/
sudo cp /root/ilifapropertygroup/server-configs/systemd/zimbuild-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now zimbuild-backend zimbuild-frontend

# 2. Copy Nginx config
sudo cp /root/ilifapropertygroup/server-configs/nginx/ilifapropertygroup /etc/nginx/sites-available/ilifapropertygroup
sudo ln -s /etc/nginx/sites-available/ilifapropertygroup /etc/nginx/sites-enabled/ilifapropertygroup
sudo nginx -t && sudo systemctl reload nginx

# 3. Add HTTPS
sudo certbot --nginx -d ilifapropertygroup.com -d www.ilifapropertygroup.com
```

See `documentation/UBUNTU_24_MANUAL_SETUP.md` for the full step-by-step guide.
