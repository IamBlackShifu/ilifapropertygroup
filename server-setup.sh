#!/bin/bash

###############################################################################
# ILifa Property Group - Server Initial Setup Script
# Run this script on your Ubuntu server for first-time setup
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release; then
    error "This script is designed for Ubuntu. Please install manually."
    exit 1
fi

log "🚀 Starting ILifa Property Group Server Setup"

# Update system
log "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log "📦 Installing essential packages..."
sudo apt install -y git curl wget vim ufw

# Install Docker
log "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    log "✅ Docker installed successfully"
else
    log "✅ Docker already installed"
fi

# Install Docker Compose
log "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo apt install -y docker-compose-plugin
    log "✅ Docker Compose installed successfully"
else
    log "✅ Docker Compose already installed"
fi

# Configure firewall
log "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 4000/tcp  # Backend
log "✅ Firewall configured"

# Create deployment directory
log "📁 Creating deployment directory..."
sudo mkdir -p /var/www/ilifa-property-group
sudo chown -R $USER:$USER /var/www
sudo mkdir -p /var/backups/ilifa-property-group
sudo chown -R $USER:$USER /var/backups

# Create log directory
sudo mkdir -p /var/log
sudo touch /var/log/ilifa-deploy.log
sudo chown $USER:$USER /var/log/ilifa-deploy.log

log "📋 Setup Instructions:"
echo ""
echo "1. Clone your repository:"
echo "   cd /var/www"
echo "   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ilifa-property-group"
echo ""
echo "2. Create .env file:"
echo "   cd /var/www/ilifa-property-group"
echo "   cp .env.example .env"
echo "   nano .env  # Edit with your configuration"
echo ""
echo "3. Add GitHub Actions SSH key:"
echo "   mkdir -p ~/.ssh"
echo "   nano ~/.ssh/authorized_keys  # Paste your GitHub Actions public key"
echo "   chmod 700 ~/.ssh"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "4. Run initial deployment:"
echo "   cd /var/www/ilifa-property-group"
echo "   chmod +x deploy.sh"
echo "   ./deploy.sh"
echo ""

log "✅ Server setup complete!"
log "⚠️  Please logout and login again for Docker group changes to take effect"
log "⚠️  Don't forget to configure your .env file before deploying!"

# Optional: Set up automatic security updates
read -p "Do you want to enable automatic security updates? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo apt install -y unattended-upgrades
    sudo dpkg-reconfigure -plow unattended-upgrades
    log "✅ Automatic security updates enabled"
fi

log "🎉 Setup complete! Follow the instructions above to deploy your application."
