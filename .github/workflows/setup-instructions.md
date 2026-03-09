# GitHub Actions Deployment Setup Instructions

## 📋 Overview

This setup enables automatic deployment to your server (104.207.67.240) whenever you push to the main/master branch.

## 🔐 Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SERVER_USER` | SSH username for your server | `root` or `ubuntu` |
| `SSH_PRIVATE_KEY` | SSH private key for authentication | (see below) |
| `SSH_PORT` | SSH port (optional, defaults to 22) | `22` |

---

## 🔑 Generating SSH Key Pair

### 1. Generate SSH Key on Your Local Machine

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key

# This creates two files:
# - github_deploy_key (private key - add to GitHub Secrets)
# - github_deploy_key.pub (public key - add to server)
```

### 2. Add Public Key to Your Server

```bash
# Copy the public key
cat ~/.ssh/github_deploy_key.pub

# SSH into your server
ssh user@104.207.67.240

# Add the public key to authorized_keys
mkdir -p ~/.ssh
echo "your-public-key-content-here" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
exit
```

### 3. Add Private Key to GitHub Secrets

```bash
# Display the private key
cat ~/.ssh/github_deploy_key

# Copy the ENTIRE output (including BEGIN and END lines)
# Add it to GitHub as SSH_PRIVATE_KEY secret
```

---

## 🖥️ Server Setup

### 1. Initial Server Setup

SSH into your server and run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Install Git
sudo apt install git -y

# Create deployment directory
sudo mkdir -p /var/www/ilifa-property-group
sudo chown -R $USER:$USER /var/www/ilifa-property-group

# Clone your repository (first time only)
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ilifa-property-group
cd ilifa-property-group

# Create .env file
cp .env.example .env
nano .env  # Edit with your configuration
```

### 2. Configure Environment Variables

Edit `/var/www/ilifa-property-group/.env`:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=zimbuild
POSTGRES_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://104.207.67.240:3000

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# PayNow (optional)
PAYNOW_INTEGRATION_ID=your_paynow_id
PAYNOW_INTEGRATION_KEY=your_paynow_key

# Ports
BACKEND_PORT=4000
FRONTEND_PORT=3000

# API URL
NEXT_PUBLIC_API_URL=http://104.207.67.240:4000
```

### 3. Make Deploy Script Executable

```bash
chmod +x deploy.sh
```

### 4. Initial Deployment

```bash
# Run the deployment script manually for first time
./deploy.sh
```

---

## 🚀 How It Works

### Automatic Deployment Flow:

1. **You push code** to main/master branch
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **GitHub Actions triggers** automatically

3. **Deployment process**:
   - Connects to your server via SSH
   - Pulls latest code from Git
   - Stops existing containers
   - Builds new Docker images
   - Starts containers
   - Runs database migrations
   - Cleans up old images
   - Performs health checks

4. **Deployment complete** - Your changes are live!

---

## 🔧 Manual Deployment

If you need to deploy manually:

```bash
# SSH into your server
ssh user@104.207.67.240

# Navigate to project directory
cd /var/www/ilifa-property-group

# Run deployment script
./deploy.sh
```

---

## 📊 Monitoring Deployment

### View Workflow Status:
- Go to your GitHub repository
- Click **Actions** tab
- See deployment status and logs

### Check Server Status:

```bash
# SSH into server
ssh user@104.207.67.240

# Check running containers
cd /var/www/ilifa-property-group
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check deployment logs
tail -f /var/log/ilifa-deploy.log
```

---

## 🌐 Access Your Application

After successful deployment:

- **Frontend**: http://104.207.67.240:3000
- **Backend API**: http://104.207.67.240:4000
- **API Documentation**: http://104.207.67.240:4000/api

---

## 🔒 SSL/Domain Setup (Optional but Recommended)

### 1. Point Your Domain to Server

Add DNS A record:
```
Type: A
Name: @ (or subdomain)
Value: 104.207.67.240
TTL: 3600
```

### 2. Install SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Update nginx configuration for your domain
# Then get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Update CORS Settings

Update `.env` on server:
```env
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## 🛠️ Troubleshooting

### Deployment Failed?

1. **Check GitHub Actions logs**:
   - Go to Actions tab in GitHub
   - Click on failed workflow
   - Review error messages

2. **Check server logs**:
   ```bash
   ssh user@104.207.67.240
   cd /var/www/ilifa-property-group
   docker-compose logs
   tail -f /var/log/ilifa-deploy.log
   ```

3. **Common Issues**:

   - **Permission denied**: Ensure SSH key is correctly added
   - **Port in use**: Check if ports 3000/4000 are available
   - **Out of disk space**: Clean Docker resources
     ```bash
     docker system prune -a
     ```

### Rollback Deployment

```bash
# SSH into server
cd /var/www/ilifa-property-group

# Restore database from backup
docker-compose exec -T postgres psql -U postgres zimbuild < /var/backups/ilifa-property-group/db_backup_YYYYMMDD_HHMMSS.sql

# Checkout previous commit
git log  # Find commit hash
git reset --hard COMMIT_HASH

# Redeploy
./deploy.sh
```

---

## 📧 Support

If you encounter issues:
1. Check deployment logs
2. Review Docker container status
3. Verify environment variables
4. Ensure server has sufficient resources

---

## ✅ Checklist

- [ ] GitHub secrets configured (SERVER_USER, SSH_PRIVATE_KEY)
- [ ] SSH key pair generated and added
- [ ] Server has Docker and Docker Compose installed
- [ ] Repository cloned to `/var/www/ilifa-property-group`
- [ ] `.env` file configured on server
- [ ] Initial deployment successful
- [ ] Firewall allows ports 22, 80, 443, 3000, 4000
- [ ] Domain DNS configured (if using)

---

**🎉 You're all set! Push to main/master branch and watch the magic happen!**
