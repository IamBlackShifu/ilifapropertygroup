# ILifa Property Group - Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Development)](#quick-start-development)
3. [VPS Deployment (Production)](#vps-deployment-production)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [SSL/HTTPS Setup](#ssl-https-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** (v20 or higher)
- **Docker** (v24 or higher)
- **Docker Compose** (v2.20 or higher)
- **Git**
- **PostgreSQL** (v16 or higher) - if not using Docker

### VPS Requirements (Production)

- **CPU**: Minimum 2 cores (4 cores recommended)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 20GB SSD
- **OS**: Ubuntu 22.04 LTS or later
- **Network**: Public IP address and domain name (optional but recommended)

---

## Quick Start (Development)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ilifa-property-group.git
cd ilifa-property-group
```

### 2. Setup Environment Variables

```bash
# Copy environment example
cp .env.example .env

# Edit .env with your configuration
notepad .env  # Windows
nano .env     # Linux/Mac
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Setup Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npm run prisma:seed
```

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Documentation: http://localhost:4000/api/docs

---

## VPS Deployment (Production)

### Step 1: Prepare Your VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Verify installations
docker --version
docker compose version
```

### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/yourusername/ilifa-property-group.git
cd ilifa-property-group

# Setup environment
cp .env.example .env
nano .env  # Configure production values
```

### Step 3: Configure Production Environment

Edit `.env` file with production values:

```env
NODE_ENV=production

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
POSTGRES_DB=zimbuild

# JWT (Generate secure secrets!)
JWT_SECRET=GENERATE_A_SECURE_RANDOM_STRING_HERE
JWT_REFRESH_SECRET=GENERATE_ANOTHER_SECURE_STRING_HERE

# URLs (Replace with your domain)
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Stripe (Production keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Paynow (Production credentials)
PAYNOW_INTEGRATION_ID=your_production_integration_id
PAYNOW_INTEGRATION_KEY=your_production_integration_key
```

**Generate secure secrets:**
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Build and Deploy

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Step 5: Run Database Migrations

```bash
# Run migrations
docker compose exec backend npx prisma migrate deploy

# Verify database
docker compose exec backend npx prisma studio
```

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | development |
| `PORT` | Backend port | Yes | 4000 |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | JWT access token secret | Yes | - |
| `JWT_EXPIRES_IN` | Access token expiry | No | 15m |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes | - |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | No | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | Yes | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | - |
| `PAYNOW_INTEGRATION_ID` | Paynow integration ID | Yes | - |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | - |
| `NEXT_PUBLIC_APP_NAME` | Application name | No | ILifa Property Group |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes | - |

---

## Database Setup

### Manual PostgreSQL Setup (Without Docker)

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE zimbuild;
CREATE USER zimuser WITH ENCRYPTED PASSWORD 'securepassword';
GRANT ALL PRIVILEGES ON DATABASE zimbuild TO zimuser;
\q

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://zimuser:securepassword@localhost:5432/zimbuild?schema=public"
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

---

## Running the Application

### Docker Compose Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart services
docker compose restart

# View logs
docker compose logs -f [service_name]

# Rebuild and restart
docker compose up -d --build

# Remove volumes (WARNING: deletes data!)
docker compose down -v
```

### Individual Service Management

```bash
# Backend only
docker compose up -d backend

# Frontend only
docker compose up -d frontend

# Database only
docker compose up -d postgres
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Stop Nginx container
docker compose stop nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx.conf with SSL configuration
# Copy certificates to nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Restart Nginx
docker compose restart nginx
```

### SSL Configuration in nginx.conf

Uncomment the SSL server block in `nginx/nginx.conf` and configure your domain.

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check all services
docker compose ps

# Check backend health
curl http://localhost:4000/api/health

# Check frontend health
curl http://localhost:3000
```

### Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Save logs to file
docker compose logs > logs.txt
```

### Backups

**Database Backup:**
```bash
# Backup
docker compose exec postgres pg_dump -U postgres zimbuild > backup.sql

# Restore
docker compose exec -T postgres psql -U postgres zimbuild < backup.sql
```

**File Uploads Backup:**
```bash
# Backup uploads
docker cp zimbuild-backend:/app/uploads ./uploads-backup

# Restore uploads
docker cp ./uploads-backup zimbuild-backend:/app/uploads
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Run new migrations
docker compose exec backend npx prisma migrate deploy
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec postgres psql -U postgres -d zimbuild
```

### Backend Not Starting

```bash
# Check backend logs
docker compose logs backend

# Common issues:
# 1. Database not ready - wait for postgres healthcheck
# 2. Missing environment variables - check .env
# 3. Port already in use - change BACKEND_PORT
```

### Frontend Not Loading

```bash
# Check frontend logs
docker compose logs frontend

# Check if backend is accessible
curl http://backend:4000/api/health

# Verify NEXT_PUBLIC_API_URL is correct
```

### Permission Issues

```bash
# Fix uploads directory permissions
sudo chown -R 1001:1001 uploads/

# Fix Docker permissions
sudo chmod 666 /var/run/docker.sock
```

### Port Conflicts

```bash
# Check what's using the port
sudo lsof -i :4000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in .env
```

---

## Performance Optimization

### Production Checklist

- [ ] Use production database credentials
- [ ] Enable SSL/HTTPS
- [ ] Set strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup automated backups
- [ ] Configure monitoring
- [ ] Setup error tracking
- [ ] Enable CDN for static assets
- [ ] Optimize database indexes

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/ilifa-property-group/issues
- Documentation: https://docs.ilifapropertygroup.com
- Email: support@ilifapropertygroup.com

---

## License

This project is licensed under the MIT License.
