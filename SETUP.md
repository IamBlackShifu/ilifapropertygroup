# 🚀 Quick Setup Guide

This guide will get you up and running in 5 minutes.

## Option 1: Docker (Recommended)

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

```bash
# 1. Clone and navigate
git clone <your-repo-url>
cd ZimBuildHub

# 2. Setup environment
cp .env.example .env
# Edit .env with your settings (at minimum, set secure passwords)

# 3. Start everything
docker compose up -d --build

# 4. Run database migrations
docker compose exec backend npx prisma migrate deploy

# 5. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# API Docs: http://localhost:4000/api/docs
```

That's it! 🎉

---

## Option 2: Manual Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+

### Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd ZimBuildHub

# 2. Setup PostgreSQL database
sudo -u postgres psql
CREATE DATABASE zimbuild;
CREATE USER zimuser WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE zimbuild TO zimuser;
\q

# 3. Configure environment
cp .env.example .env
# Edit DATABASE_URL and other settings

# 4. Setup Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# 5. Setup Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## First Steps

### 1. Create Admin User

Register through the UI with role "ADMIN" or use Prisma Studio:

```bash
cd backend
npx prisma studio
```

Navigate to Users and create an admin user.

### 2. Test the API

Visit http://localhost:4000/api/docs to see the interactive API documentation.

### 3. Start Building!

The core authentication system is ready. Now you can:
- Create properties
- Register contractors
- Setup verification workflows
- Add payment integration

---

## Need Help?

- Read [README.md](./README.md) for overview
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- View [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for data structure

---

## Common Issues

**Port already in use:**
```bash
# Change ports in .env
FRONTEND_PORT=3001
BACKEND_PORT=4001
```

**Database connection failed:**
```bash
# Check PostgreSQL is running
docker compose ps postgres
# Or for manual setup
sudo systemctl status postgresql
```

**Migrations failed:**
```bash
# Reset database (development only!)
cd backend
npx prisma migrate reset
```

---

Happy building! 🏗️
