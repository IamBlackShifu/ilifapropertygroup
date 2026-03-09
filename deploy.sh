#!/bin/bash

###############################################################################
# ILifa Property Group - Production Deployment Script
# This script handles the deployment process on the server
###############################################################################

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_PATH="/var/www/ilifa-property-group"
BACKUP_PATH="/var/backups/ilifa-property-group"
LOG_FILE="/var/log/ilifa-deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Main deployment process
main() {
    log "🚀 Starting ILifa Property Group Deployment"
    
    # Check if running as root or with sudo
    if [ "$EUID" -ne 0 ] && ! groups | grep -q docker; then 
        warning "Consider running with sudo or ensure your user is in the docker group"
    fi
    
    # Navigate to project directory
    if [ ! -d "$DEPLOY_PATH" ]; then
        error "Deploy path $DEPLOY_PATH does not exist!"
        exit 1
    fi
    
    cd "$DEPLOY_PATH"
    log "📁 Changed to directory: $DEPLOY_PATH"
    
    # Create backup directory if it doesn't exist
    mkdir -p "$BACKUP_PATH"
    
    # Determine which docker-compose file to use
    COMPOSE_FILE="docker-compose.yml"
    if [ -f "docker-compose.prod.yml" ]; then
        COMPOSE_FILE="docker-compose.prod.yml"
    fi
    
    # Backup database before deployment
    log "💾 Creating database backup..."
    BACKUP_FILE="$BACKUP_PATH/db_backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose -f $COMPOSE_FILE exec -T postgres pg_dump -U postgres zimbuild > "$BACKUP_FILE" 2>/dev/null || warning "Database backup failed (this is ok for first deployment)"
    
    # Pull latest code
    log "📥 Pulling latest code from repository..."
    git fetch origin
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    git reset --hard origin/$CURRENT_BRANCH
    log "✅ Code updated to latest version on branch: $CURRENT_BRANCH"
    
    # Load environment variables
    if [ -f .env ]; then
        set -a
        source .env
        set +a
        info "Environment variables loaded"
    else
        warning ".env file not found! Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            warning "Please update .env file with your configuration"
        fi
    fi
    
    # Determine which docker-compose file to use
    COMPOSE_FILE="docker-compose.yml"
    if [ -f "docker-compose.prod.yml" ]; then
        COMPOSE_FILE="docker-compose.prod.yml"
        log "Using production configuration"
    fi
    
    # Stop existing containers
    log "🛑 Stopping existing containers..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans
    
    # Build new images
    log "🔨 Building Docker images..."
    docker-compose -f $COMPOSE_FILE build --no-cache --parallel
    
    # Start containers
    log "🚀 Starting containers..."
    docker-compose -f $COMPOSE_FILE up -d
    
    # Wait for services to be ready
    log "⏳ Waiting for services to start..."
    sleep 15
    
    # Check if backend is healthy
    info "Checking backend health..."
    for i in {1..30}; do
        if docker-compose -f $COMPOSE_FILE exec -T backend wget -q --spider http://localhost:4000/api/health 2>/dev/null; then
            log "✅ Backend is healthy!"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Backend failed to start properly"
            docker-compose -f $COMPOSE_FILE logs backend --tail=50
            exit 1
        fi
        sleep 2
    done
    
    # Run database migrations
    log "🗄️ Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec -T backend npx prisma migrate deploy || warning "Migration warning (may already be applied)"
    
    # Generate Prisma Client
    log "🔧 Generating Prisma Client..."
    docker-compose -f $COMPOSE_FILE exec -T backend npx prisma generate || warning "Prisma generate warning"
    
    # Restart backend after migrations
    log "🔄 Restarting backend service..."
    docker-compose -f $COMPOSE_FILE restart backend
    sleep 5
    
    # Clean up old images and containers
    log "🧹 Cleaning up old Docker resources..."
    docker image prune -af --filter "until=48h" || true
    docker volume prune -f || true
    
    # Show running containers
    log "📊 Running containers:"
    docker-compose -f $COMPOSE_FILE ps
    
    # System status
    log "📈 System Status:"
    info "CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}')"
    info "Memory Usage: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
    info "Disk Usage: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
    
    # Keep last 10 backups only
    log "🧹 Cleaning old backups (keeping last 10)..."
    ls -t "$BACKUP_PATH"/db_backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm || true
    
    log "✅ Deployment completed successfully! 🎉"
    log "Frontend: http://104.207.67.240:3000"
    log "Backend API: http://104.207.67.240:4000"
    log "API Documentation: http://104.207.67.240:4000/api"
}

# Run main function
main "$@"
