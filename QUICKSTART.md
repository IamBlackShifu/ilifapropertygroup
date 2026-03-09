# Quick Start Guide - ILifa Property Group Deployment

## 🚀 Quick Setup (5 Minutes)

### On Your Local Machine

1. **Generate SSH Key**
   ```bash
   ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/ilifa_deploy
   ```

2. **Add to GitHub Secrets**
   - Go to: Settings → Secrets → Actions → New secret
   - Add `SERVER_USER`: `root` or your username
   - Add `SSH_PRIVATE_KEY`: Content of `~/.ssh/ilifa_deploy`
   - Add `SSH_PORT`: `22` (if different)

### On Your Server (104.207.67.240)

1. **SSH into server**
   ```bash
   ssh root@104.207.67.240
   ```

2. **Run setup script**
   ```bash
   # Download and run server setup
   curl -O https://raw.githubusercontent.com/YOUR_REPO/main/server-setup.sh
   chmod +x server-setup.sh
   ./server-setup.sh
   ```

3. **Add SSH public key**
   ```bash
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_FROM_STEP_1" >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **Clone repository**
   ```bash
   cd /var/www
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ilifa-property-group
   cd ilifa-property-group
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Minimum required settings:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CORS_ORIGIN=http://104.207.67.240:3000
   NEXT_PUBLIC_API_URL=http://104.207.67.240:4000
   ```

6. **Make deploy script executable**
   ```bash
   chmod +x deploy.sh
   ```

7. **Initial deployment**
   ```bash
   ./deploy.sh
   ```

### Test Deployment

Access your application:
- Frontend: http://104.207.67.240:3000
- Backend: http://104.207.67.240:4000
- API Docs: http://104.207.67.240:4000/api

---

## 🎯 How to Deploy Changes

Simply push to main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically:
1. Connect to your server
2. Pull latest code
3. Rebuild containers
4. Run migrations
5. Restart services

---

## 📊 Monitor Deployment

- **GitHub**: Check Actions tab for deployment status
- **Server**: `ssh root@104.207.67.240 && cd /var/www/ilifa-property-group && docker-compose logs -f`

---

## 🆘 Troubleshooting

**Deployment failed?**
```bash
# SSH into server
ssh root@104.207.67.240

# Check logs
cd /var/www/ilifa-property-group
docker-compose logs

# Check deployment log
tail -f /var/log/ilifa-deploy.log

# Restart services manually
./deploy.sh
```

**Can't access application?**
```bash
# Check if containers are running
docker-compose ps

# Check firewall
sudo ufw status

# Restart containers
docker-compose restart
```

---

## ✅ Production Checklist

Before going live:

- [ ] SSL certificate installed (use Certbot)
- [ ] Domain pointed to server IP
- [ ] Strong passwords in .env
- [ ] Firewall configured
- [ ] Backups enabled
- [ ] Monitoring set up
- [ ] GitHub secrets configured
- [ ] Test deployment successful

---

## 🔒 Security Notes

1. **Change default passwords** in .env
2. **Use SSL** in production (Certbot)
3. **Restrict SSH** to key-only authentication
4. **Enable firewall** (ufw)
5. **Regular updates** enabled

---

**Need help?** Check the detailed setup-instructions.md file.
