# ZimBuildHub - System Architecture

## Overview
A scalable construction and property verification platform with role-based access control, document verification workflows, and integrated payment processing.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Server Components
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Native Fetch API

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Class Validator
- **File Upload**: Multer

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **File Storage**: Local (VPS) with S3 abstraction layer
- **Payment**: Stripe + Paynow (abstracted)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Next.js Frontend (SSR + Client)              │  │
│  │  - Public Pages  - Dashboards  - Admin Panel        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                     │
│              SSL/TLS Termination + Load Balancing            │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NestJS Backend API                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Controllers (API Endpoints)                   │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Services (Business Logic)                     │ │  │
│  │  │  - Auth  - Users  - Properties                │ │  │
│  │  │  - Verification  - Workflow  - Payments       │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Repositories (Data Access)                    │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   PostgreSQL     │  │  File Storage    │                │
│  │   - Relational   │  │  - Documents     │                │
│  │   - Transactions │  │  - Images        │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Stripe     │  │   Paynow     │  │  Email (TBD) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Authentication & Authorization Module
- JWT-based authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Permission guards
- Session management

### 2. User Management Module
- Unified registration system
- Role assignment (Buyer, Owner, Contractor, Supplier, Agent)
- Profile management
- Account verification status

### 3. Verification Module
- Document upload and storage
- Admin review workflow
- Approval/rejection system
- Green badge issuance
- Verification expiry tracking

### 4. Property Module
- Property listing creation
- Ownership verification
- Status management (Available, Reserved, Sold)
- Search and filtering
- Public display for verified properties

### 5. Contractor Module
- Company profile management
- Service category selection
- Compliance document upload
- Project assignment tracking
- Rating and reviews

### 6. Workflow Engine Module
- Configurable construction stages
- Stage assignment and tracking
- Progress monitoring
- Inspection scheduling
- Milestone completion approval

### 7. Payment Module
- Payment abstraction layer
- Stripe integration
- Paynow integration
- Webhook handling
- Transaction history
- Milestone payment tracking

### 8. Admin Module
- User management
- Document verification
- Workflow configuration
- System monitoring
- Audit logs

### 9. Notification Module
- Email notifications
- In-app notifications
- Status change alerts
- Payment confirmations

## Security Features

### Authentication
- Bcrypt password hashing
- JWT access tokens (15min expiry)
- Refresh tokens (7 days expiry)
- Token rotation on refresh
- Secure HTTP-only cookies

### Authorization
- Role-based access control
- Resource-level permissions
- Route guards
- API endpoint protection

### Data Protection
- SQL injection prevention (Prisma)
- XSS protection
- CSRF tokens
- Rate limiting
- Input validation and sanitization

### File Security
- File type validation
- Size limits
- Secure storage paths
- Access control

## API Structure

### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
```

### User Endpoints
```
GET    /api/users/profile
PATCH  /api/users/profile
GET    /api/users/:id (admin)
```

### Property Endpoints
```
GET    /api/properties (public)
GET    /api/properties/:id
POST   /api/properties (owner)
PATCH  /api/properties/:id (owner)
DELETE /api/properties/:id (owner/admin)
```

### Verification Endpoints
```
POST   /api/verifications/submit
GET    /api/verifications/status
GET    /api/verifications/pending (admin)
PATCH  /api/verifications/:id/approve (admin)
PATCH  /api/verifications/:id/reject (admin)
```

### Contractor Endpoints
```
GET    /api/contractors (public - verified only)
GET    /api/contractors/:id
POST   /api/contractors/profile
PATCH  /api/contractors/profile
```

### Project/Workflow Endpoints
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id/stages/:stageId
POST   /api/projects/:id/assign-contractor
```

### Payment Endpoints
```
POST   /api/payments/create-intent
POST   /api/payments/confirm
POST   /api/payments/webhooks/stripe
POST   /api/payments/webhooks/paynow
GET    /api/payments/history
```

### Admin Endpoints
```
GET    /api/admin/users
PATCH  /api/admin/users/:id
GET    /api/admin/analytics
GET    /api/admin/audit-logs
POST   /api/admin/workflow-stages
```

## Data Flow Examples

### User Registration Flow
1. User fills unified registration form
2. User selects role from dropdown
3. Frontend validates input
4. Backend creates user account
5. Email verification sent
6. Account created with limited access
7. User redirected to dashboard

### Property Verification Flow
1. Property owner submits listing
2. Owner uploads ownership documents
3. System creates verification record (status: PENDING)
4. Admin receives notification
5. Admin reviews documents
6. Admin approves/rejects
7. If approved, property gets green badge
8. Property becomes publicly visible
9. Owner receives notification

### Construction Project Flow
1. Client initiates project
2. Admin/System creates workflow stages
3. Contractors assigned to stages
4. Each stage requires:
   - Work completion
   - Inspection approval
   - Milestone payment
5. Stage completion unlocks next stage
6. Final inspection and handover
7. Project marked as complete

### Payment Flow
1. Payment initiated (property purchase/milestone)
2. System calculates amount
3. Payment intent created (Stripe/Paynow)
4. User completes payment
5. Webhook confirms payment
6. Transaction recorded
7. Related entity status updated
8. Notifications sent

## Deployment Architecture

### Production Setup (VPS)
```
VPS Server
├── Docker Containers
│   ├── Nginx (Port 80, 443)
│   ├── Next.js Frontend (Port 3000)
│   ├── NestJS Backend (Port 4000)
│   └── PostgreSQL (Port 5432)
├── Volumes
│   ├── postgres-data
│   ├── uploads
│   └── logs
└── Networks
    └── zimbuild-network
```

### Environment Configuration
- Development (.env.development)
- Staging (.env.staging)
- Production (.env.production)

### Scaling Strategy
- Horizontal scaling via Docker replicas
- Database read replicas
- CDN for static assets
- Redis for caching (future)

## Performance Considerations

### Frontend
- Server-side rendering for SEO
- Static generation for public pages
- Client components only when needed
- Image optimization
- Lazy loading
- Code splitting

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Response caching
- Pagination

### Database
- Proper indexes on foreign keys
- Composite indexes for common queries
- Partitioning for large tables (future)

## Monitoring & Logging

### Application Logging
- Request/response logging
- Error tracking
- Audit trail for sensitive actions

### System Monitoring
- Health check endpoints
- Resource usage monitoring
- Database connection status

## Future Enhancements
- [ ] Multi-city expansion
- [ ] Mobile apps (React Native)
- [ ] Real-time chat
- [ ] Video calls for inspections
- [ ] AI-powered fraud detection
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] S3/Cloud storage migration
