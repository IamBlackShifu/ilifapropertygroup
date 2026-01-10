# ZimBuildHub

**Construction & Property Verification Platform for Zimbabwe**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)

---

## 🎯 Overview

ZimBuildHub is a comprehensive, production-ready platform that connects property owners, contractors, suppliers, and buyers in Zimbabwe's construction industry. Every listing is verified, every contractor is vetted, and every project is tracked.

### Key Features

✅ **Verified Listings** - Rigorous document verification for properties and contractors  
✅ **Role-Based Access** - Unified registration with dynamic dashboards  
✅ **Project Tracking** - Complete construction workflow from foundation to completion  
✅ **Secure Payments** - Stripe and Paynow integration with milestone-based payments  
✅ **Admin Controls** - Comprehensive admin panel for verification and management  
✅ **Modern Architecture** - Clean, scalable, and maintainable codebase  

---

## 🏗️ Architecture

```
┌─────────────┐
│  Next.js    │  ← Frontend (SSR + Client Components)
│  Frontend   │
└──────┬──────┘
       │ HTTPS
┌──────┴──────┐
│    Nginx    │  ← Reverse Proxy + SSL
└──────┬──────┘
       │
┌──────┴──────┐
│   NestJS    │  ← Backend API (REST)
│   Backend   │
└──────┬──────┘
       │
┌──────┴──────┐
│ PostgreSQL  │  ← Database
└─────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Axios

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Passport.js

**Infrastructure:**
- Docker & Docker Compose
- Nginx
- VPS-ready deployment

**Payments:**
- Stripe
- Paynow (Zimbabwe)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ZimBuildHub.git
cd ZimBuildHub

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start with Docker Compose
docker compose up -d

# Or run manually:

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

---

## 📖 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](http://localhost:4000/api/docs) (when running)

---

## 👥 User Roles

The platform supports **unified registration** with the following roles:

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Buyer/Client** | End users looking for properties or construction services | Browse verified properties, initiate projects, track construction |
| **Property Owner** | Individuals/companies listing properties | Submit listings, upload documents, manage properties |
| **Contractor** | Construction companies | Create profile, submit compliance docs, accept projects |
| **Supplier** | Material/equipment suppliers | Similar to contractors, focused on supply |
| **Agent** | Real estate agents | List and manage properties on behalf of owners |
| **Admin** | Platform administrators | Full system access, verification, user management |

---

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Bcrypt password hashing
- HTTP-only cookies for refresh tokens
- SQL injection prevention (Prisma)
- XSS protection
- Input validation (class-validator)
- Rate limiting
- File upload security

---

## 📊 Core Modules

### 1. Authentication & Authorization
- User registration and login
- JWT access and refresh tokens
- Role-based permissions
- Session management

### 2. Verification System
- Document upload
- Admin review workflow
- Green badge issuance
- Expiry tracking

### 3. Property Management
- Property listings
- Image uploads
- Status tracking
- Search and filtering

### 4. Contractor Management
- Company profiles
- Service categorization
- Compliance documents
- Rating system

### 5. Project Workflow Engine
- Configurable construction stages
- Contractor assignments
- Inspection scheduling
- Milestone tracking

### 6. Payment Processing
- Payment abstraction layer
- Stripe integration
- Paynow integration
- Milestone payments
- Transaction history

### 7. Admin Dashboard
- User management
- Document verification
- System analytics
- Audit logs

---

## 🛠️ Development

### Project Structure

```
ZimBuildHub/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and API client
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── properties/     # Properties module
│   │   ├── contractors/    # Contractors module
│   │   ├── verifications/  # Verification module
│   │   ├── projects/       # Projects module
│   │   ├── payments/       # Payments module
│   │   ├── prisma/         # Prisma service
│   │   └── common/         # Shared utilities
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── nginx/
│   └── nginx.conf          # Nginx configuration
├── docker-compose.yml      # Docker orchestration
├── .env.example            # Environment template
└── README.md
```

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Properties:**
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `PATCH /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

**Contractors:**
- `GET /api/contractors` - List verified contractors
- `POST /api/contractors/profile` - Create contractor profile
- `GET /api/contractors/:id` - Get contractor details

**Verifications:**
- `POST /api/verifications/submit` - Submit for verification
- `GET /api/verifications/status` - Check status
- `PATCH /api/verifications/:id/approve` - Approve (admin)
- `PATCH /api/verifications/:id/reject` - Reject (admin)

Full API documentation available at `/api/docs` when running.

---

## 🚢 Deployment

### VPS Deployment (Recommended)

```bash
# On your VPS
git clone https://github.com/yourusername/ZimBuildHub.git
cd ZimBuildHub

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Deploy
docker compose up -d --build

# Run migrations
docker compose exec backend npx prisma migrate deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Environment Variables

Key environment variables to configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zimbuild

# JWT (generate secure secrets!)
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Paynow
PAYNOW_INTEGRATION_ID=your-id
PAYNOW_INTEGRATION_KEY=your-key
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e
npm run test:cov

# Frontend tests
cd frontend
npm run test
```

---

## 📈 Roadmap

- [x] Core authentication system
- [x] User registration and roles
- [x] Database schema design
- [x] Docker deployment setup
- [ ] Property listing module
- [ ] Contractor management module
- [ ] Verification workflow
- [ ] Payment integration (Stripe)
- [ ] Payment integration (Paynow)
- [ ] Project workflow engine
- [ ] Admin dashboard
- [ ] Notification system
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

```bash
# Fork and clone
git clone https://github.com/yourusername/ZimBuildHub.git

# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [NestJS](https://nestjs.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [PostgreSQL](https://www.postgresql.org/)
- ORM by [Prisma](https://www.prisma.io/)

---

## 📞 Support

Need help? 

- 📖 [Documentation](./ARCHITECTURE.md)
- 🐛 [Report Issues](https://github.com/yourusername/ZimBuildHub/issues)
- 💬 [Discussions](https://github.com/yourusername/ZimBuildHub/discussions)
- 📧 Email: support@zimbuild.com

---

**Made with ❤️ for Zimbabwe's Construction Industry**
