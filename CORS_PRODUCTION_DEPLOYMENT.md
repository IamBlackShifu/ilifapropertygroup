# CORS Production Deployment Guide

## Issue Identified
Frontend at `https://www.ilifapropertygroup.com` received CORS errors when trying to access the backend API. The backend was returning `Access-Control-Allow-Origin: http://localhost:3000` instead of allowing the production domain.

### Root Causes
1. **docker-compose.prod.yml** was setting `CORS_ORIGIN` (singular) instead of `CORS_ORIGINS` (plural) that the backend code expects
2. **nginx configuration** was not properly forwarding the actual request origin to the backend for CORS validation
3. **Missing HTTPS server block** in nginx for production deployment

## Changes Made

### 1. docker-compose.prod.yml (FIXED)
**Problem**: Used wrong environment variable name and wildcard default
```yaml
# BEFORE
CORS_ORIGIN: ${CORS_ORIGIN:-*}

# AFTER
CORS_ORIGINS: ${CORS_ORIGINS:-http://localhost:3000,https://ilifapropertygroup.com,https://www.ilifapropertygroup.com}
```

**Why**: 
- Backend `main.ts` reads `CORS_ORIGINS` (plural), not `CORS_ORIGIN`
- Explicit domains are more secure than wildcard (`*`)
- Ensures production domains are always whitelisted

### 2. nginx/nginx.conf (ENHANCED)
**Changes**:
- Added HTTPS server block (port 443) for production
- Added HTTP to HTTPS redirect (port 80)
- Added critical header: `proxy_set_header Origin $scheme://$server_name` to `/api` location
- This forwards the actual request origin to the backend for proper CORS validation

**Key Addition**:
```nginx
# CRITICAL: Forward the original request origin for CORS validation
proxy_set_header Origin $scheme://$server_name;
```

This ensures the backend receives the correct origin (`https://www.ilifapropertygroup.com`) for CORS header validation.

## Deployment Instructions

### Step 1: Update Environment Variables
Create/update your production `.env` file with:
```bash
# CORS Configuration (comma-separated list)
CORS_ORIGINS=http://localhost:3000,https://ilifapropertygroup.com,https://www.ilifapropertygroup.com

# SSL Certificates (paths on your server)
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem

# Other required variables...
JWT_SECRET=your-production-jwt-secret
POSTGRES_PASSWORD=your-database-password
```

### Step 2: Prepare SSL Certificates
Ensure your production server has SSL certificates at the paths specified in nginx.conf:
```bash
/etc/nginx/ssl/cert.pem          # Your SSL certificate
/etc/nginx/ssl/key.pem           # Your SSL private key
```

**Options for obtaining certificates:**
- **Let's Encrypt (Recommended)**: Free and automated with certbot
  ```bash
  sudo apt-get install certbot python3-certbot-nginx
  sudo certbot certonly --manual --preferred-challenges dns \
    -d ilifapropertygroup.com -d www.ilifapropertygroup.com
  ```
- **Paid SSL providers**: GoDaddy, Comodo, etc.

### Step 3: Rebuild and Redeploy Containers
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Verify services are running
docker-compose -f docker-compose.prod.yml ps
```

### Step 4: Verify CORS is Working
Test from your browser console or using curl:

**Browser Test**:
```javascript
fetch('https://ilifapropertygroup.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User'
  })
})
.then(r => r.json())
.then(d => console.log('✅ CORS Success:', d))
.catch(e => console.error('❌ CORS Failed:', e))
```

**Curl Test** (should work without CORS restrictions):
```bash
curl -X OPTIONS https://www.ilifapropertygroup.com/api/auth/register \
  -H "Origin: https://www.ilifapropertygroup.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected response headers:
```
Access-Control-Allow-Origin: https://www.ilifapropertygroup.com
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization,Accept,Origin,X-Requested-With
Access-Control-Allow-Credentials: true
```

## CORS Origin Variants (Automatic)

The backend automatically handles www/non-www variants. You can configure any of these:

**Set in CORS_ORIGINS**:
- `https://ilifapropertygroup.com` → automatically adds `https://www.ilifapropertygroup.com`
- `https://www.ilifapropertygroup.com` → automatically adds `https://ilifapropertygroup.com`
- `http://localhost:3000` → no variant (localhost excluded)

**Examples**:
```bash
# Single domain (automatic www variant)
CORS_ORIGINS=https://ilifapropertygroup.com

# Both explicitly (safe but redundant)
CORS_ORIGINS=https://ilifapropertygroup.com,https://www.ilifapropertygroup.com

# Multiple domains
CORS_ORIGINS=https://ilifapropertygroup.com,https://api.ilifapropertygroup.com,http://localhost:3000
```

## Troubleshooting

### Problem: Still Getting CORS Errors
1. **Check environment variables are set**:
   ```bash
   docker-compose exec backend env | grep CORS
   ```
   
2. **Check backend logs**:
   ```bash
   docker-compose logs backend | tail -50
   ```

3. **Verify nginx is forwarding headers correctly**:
   ```bash
   docker-compose exec nginx curl -v http://backend:4000/health
   ```

### Problem: SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout

# Verify private key matches certificate
openssl x509 -noout -modulus -in /etc/nginx/ssl/cert.pem | openssl md5
openssl rsa -noout -modulus -in /etc/nginx/ssl/key.pem | openssl md5
# Both md5 values should match
```

### Problem: nginx Configuration Errors
```bash
# Test nginx config syntax
docker-compose exec nginx nginx -t

# Reload nginx without restarting
docker-compose exec nginx nginx -s reload
```

## Local Development (No Changes Needed)
The changes are backward compatible. Local development with `http://localhost:3000` continues to work:
- docker-compose.yml (development) uses original configuration
- Backend defaults to localhost:3000 if CORS_ORIGINS not set
- No local changes required

## Key Files Modified
- ✅ `docker-compose.prod.yml` - CORS environment variable fix
- ✅ `nginx/nginx.conf` - HTTPS support and Origin header forwarding
- ℹ️ `backend/.env.example` - Already documents CORS_ORIGINS (no change needed)
- ℹ️ `backend/src/main.ts` - Already implements CORS correctly (no change needed)

## Next Steps
1. Update your production `docker-compose.prod.yml` with these fixes
2. Obtain/update SSL certificates
3. Set CORS_ORIGINS environment variable to your production domains
4. Rebuild and redeploy containers
5. Test CORS with curl command above
6. Monitor backend logs for any CORS rejection errors

## Questions?
If you encounter issues:
1. Check the backend logs: `docker-compose logs backend`
2. Verify nginx config: `docker-compose logs nginx`
3. Test directly against backend: `curl http://localhost:4000/api/health`
4. Review the CORS callback in `backend/src/main.ts` for allowed origins
