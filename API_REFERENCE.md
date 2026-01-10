# API Endpoints Reference

## Base URL
- Development: `http://localhost:4000/api`
- Production: `https://yourdomain.com/api`

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+263771234567",
  "role": "BUYER"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc..."
  },
  "message": "Registration successful"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc..."
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response: 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER",
    ...
  }
}
```

## Users

### Get Profile
```http
GET /users/profile
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

### Update Profile
```http
PATCH /users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+263771234567"
}

Response: 200 OK
{
  "success": true,
  "data": { ... },
  "message": "Profile updated successfully"
}
```

## Properties

### List Properties (Public)
```http
GET /properties
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20)
  - city: string
  - type: LAND | HOUSE | APARTMENT | COMMERCIAL
  - minPrice: number
  - maxPrice: number
  - verified: boolean

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Get Property Details
```http
GET /properties/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Beautiful House in Harare",
    "price": 150000,
    "images": [...],
    "owner": {...},
    ...
  }
}
```

### Create Property (Owner)
```http
POST /properties
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Beautiful House in Harare",
  "description": "3 bedroom house...",
  "propertyType": "HOUSE",
  "price": 150000,
  "currency": "USD",
  "locationCity": "Harare",
  "locationArea": "Borrowdale",
  "bedrooms": 3,
  "bathrooms": 2,
  "sizeSqm": 250
}

Response: 201 Created
{
  "success": true,
  "data": { ... },
  "message": "Property created successfully"
}
```

### Update Property
```http
PATCH /properties/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "price": 160000,
  "description": "Updated description"
}

Response: 200 OK
```

### Delete Property
```http
DELETE /properties/:id
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "message": "Property deleted successfully"
}
```

## Contractors

### List Contractors (Verified)
```http
GET /contractors
Query Parameters:
  - page: number
  - limit: number
  - city: string
  - service: string

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### Get Contractor Details
```http
GET /contractors/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "ABC Construction",
    "isVerified": true,
    "ratingAverage": 4.5,
    ...
  }
}
```

### Create Contractor Profile
```http
POST /contractors/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "companyName": "ABC Construction",
  "registrationNumber": "REG123",
  "description": "Professional construction services",
  "servicesOffered": ["Construction", "Renovation"],
  "yearsExperience": 10,
  "locationCity": "Harare"
}

Response: 201 Created
```

## Verifications

### Submit for Verification
```http
POST /verifications/submit
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "entityType": "CONTRACTOR",
  "entityId": "uuid",
  "submissionNotes": "Submitted all required documents"
}

Response: 201 Created
```

### Check Verification Status
```http
GET /verifications/status
Authorization: Bearer {accessToken}
Query Parameters:
  - entityType: string
  - entityId: string

Response: 200 OK
{
  "success": true,
  "data": {
    "status": "PENDING",
    "submittedAt": "2026-01-10T10:00:00Z",
    ...
  }
}
```

### Approve Verification (Admin)
```http
PATCH /verifications/:id/approve
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reviewNotes": "All documents verified"
}

Response: 200 OK
```

### Reject Verification (Admin)
```http
PATCH /verifications/:id/reject
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reviewNotes": "Missing tax clearance certificate"
}

Response: 200 OK
```

## Projects

### Create Project
```http
POST /projects
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "projectName": "New House Construction",
  "projectType": "NEW_CONSTRUCTION",
  "description": "Building a 3-bedroom house",
  "budget": 50000,
  "startDate": "2026-02-01"
}

Response: 201 Created
```

### Get Project Details
```http
GET /projects/:id
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectName": "New House Construction",
    "status": "IN_PROGRESS",
    "stages": [...],
    ...
  }
}
```

## Payments

### Create Payment Intent
```http
POST /payments/create-intent
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "amount": 5000,
  "currency": "USD",
  "paymentMethod": "STRIPE",
  "relatedEntityType": "PROJECT",
  "relatedEntityId": "uuid",
  "description": "Milestone 1 payment"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentId": "uuid"
  }
}
```

### Confirm Payment
```http
POST /payments/confirm
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "paymentId": "uuid",
  "providerPaymentId": "pi_xxx"
}

Response: 200 OK
```

### Get Payment History
```http
GET /payments/history
Authorization: Bearer {accessToken}
Query Parameters:
  - page: number
  - limit: number

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden resource",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

## Pagination

All list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
