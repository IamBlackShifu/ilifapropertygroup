# 🧪 API TESTING GUIDE - ZimBuildHub

## Quick Start

### 1. Start the Backend
```powershell
cd backend
npm install
npm run start:dev
```

### 2. Access Swagger Documentation
Open: `http://localhost:3000/api`

---

## 🏠 PROPERTY MANAGEMENT API

### Create Property
```http
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Beautiful 3 Bedroom House",
  "description": "Modern family home with garden",
  "propertyType": "HOUSE",
  "price": 250000,
  "currency": "USD",
  "locationCity": "Harare",
  "locationArea": "Borrowdale",
  "locationAddress": "123 Main Street",
  "bedrooms": 3,
  "bathrooms": 2,
  "parkingSpaces": 2,
  "sizeSqm": 250,
  "features": ["Garden", "Security", "Swimming Pool"],
  "images": ["/uploads/properties/image1.jpg"]
}
```

### Get All Properties (with filters)
```http
GET /properties?search=house&propertyType=HOUSE&locationCity=Harare&minPrice=100000&maxPrice=300000&page=1&limit=10
```

### Get Single Property
```http
GET /properties/:id
```

### Update Property
```http
PATCH /properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 275000
}
```

### Submit for Verification
```http
PATCH /properties/:id/submit-verification
Authorization: Bearer <token>
```

### Verify Property (Admin)
```http
PATCH /properties/:id/verify
Authorization: Bearer <token>
```

### Get My Properties
```http
GET /properties/my-properties
Authorization: Bearer <token>
```

### Get Property Stats
```http
GET /properties/user/stats
Authorization: Bearer <token>
```

---

## 📁 FILE UPLOAD API

### Upload Single Image
```http
POST /files/upload/property-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [Select file]
```

### Upload Multiple Images
```http
POST /files/upload/property-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [Select multiple files]
```

### Upload Profile Image
```http
POST /files/upload/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [Select file]
```

### Delete File
```http
DELETE /files/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "/uploads/properties/image1.jpg"
}
```

---

## 👷 CONTRACTOR MANAGEMENT API

### Create Contractor Profile
```http
POST /contractors
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "BuildPro Construction Ltd",
  "registrationNumber": "REG123456",
  "description": "Professional construction services",
  "servicesOffered": ["Plumbing", "Electrical", "Roofing"],
  "yearsExperience": 10,
  "employeesCount": 25,
  "locationCity": "Harare",
  "locationAddress": "123 Industrial Road"
}
```

### Get All Contractors (with filters)
```http
GET /contractors?search=plumbing&service=Plumbing&locationCity=Harare&minRating=4&page=1&limit=10
```

### Get Single Contractor
```http
GET /contractors/:id
```

### Get My Contractor Profile
```http
GET /contractors/my-profile
Authorization: Bearer <token>
```

### Search by Service
```http
GET /contractors/service/Plumbing
```

### Get Contractor Reviews
```http
GET /contractors/:id/reviews?page=1&limit=10
```

### Get Contractor Stats
```http
GET /contractors/:id/stats
```

### Update Contractor Profile
```http
PATCH /contractors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Updated Company Name",
  "servicesOffered": ["Plumbing", "Electrical", "HVAC"]
}
```

### Verify Contractor (Admin)
```http
PATCH /contractors/:id/verify
Authorization: Bearer <token>
```

### Suspend Contractor (Admin)
```http
PATCH /contractors/:id/suspend
Authorization: Bearer <token>
```

### Rate Contractor
```http
POST /contractors/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent service!",
  "projectId": "optional-project-id"
}
```

---

## 🔐 AUTHENTICATION (Already Implemented)

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+263771234567",
  "role": "OWNER"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

## 📋 TESTING CHECKLIST

### Property Management
- [ ] Create property as OWNER
- [ ] List all properties (public)
- [ ] Filter properties by price range
- [ ] Filter properties by location
- [ ] View property details
- [ ] Update own property
- [ ] Delete own property
- [ ] Submit property for verification
- [ ] Verify property as ADMIN
- [ ] Mark property as reserved
- [ ] Mark property as sold
- [ ] Get property statistics

### File Upload
- [ ] Upload single property image
- [ ] Upload multiple property images (max 10)
- [ ] Upload profile image
- [ ] Upload document
- [ ] Delete uploaded file
- [ ] Verify file size limit (5MB)
- [ ] Verify file type restriction (images only)

### Contractor Management
- [ ] Create contractor profile as CONTRACTOR
- [ ] List all contractors (public)
- [ ] Filter contractors by service
- [ ] Filter contractors by location
- [ ] Filter contractors by rating
- [ ] View contractor details
- [ ] Update own contractor profile
- [ ] Delete own contractor profile
- [ ] Get contractor reviews
- [ ] Get contractor statistics
- [ ] Rate a contractor
- [ ] Verify contractor as ADMIN
- [ ] Suspend contractor as ADMIN

---

## 🐛 COMMON ERRORS & SOLUTIONS

### Error: "Contractor profile already exists"
**Solution**: User can only have one contractor profile. Delete existing profile first.

### Error: "User must have CONTRACTOR role"
**Solution**: Register with role "CONTRACTOR" or update user role.

### Error: "You do not have permission to update this property"
**Solution**: Ensure you're logged in as the property owner or admin.

### Error: "File too large"
**Solution**: Images must be under 5MB.

### Error: "Invalid file type"
**Solution**: Only JPG, PNG, WebP images allowed.

### Error: "Only draft properties can be submitted for verification"
**Solution**: Property must be in DRAFT status to submit.

### Error: "You have already reviewed this contractor"
**Solution**: Users can only submit one review per contractor.

---

## 🎯 USER ROLES & PERMISSIONS

### BUYER
- ✅ View properties
- ✅ View contractors
- ✅ Rate contractors
- ✅ Contact owners
- ❌ Create properties
- ❌ Create contractor profile

### OWNER
- ✅ View properties
- ✅ Create properties
- ✅ Edit own properties
- ✅ Delete own properties
- ✅ Submit properties for verification
- ✅ View contractors
- ❌ Verify properties
- ❌ Create contractor profile

### CONTRACTOR
- ✅ View properties
- ✅ Create contractor profile
- ✅ Edit own contractor profile
- ✅ View other contractors
- ✅ Accept projects
- ❌ Create properties
- ❌ Verify contractors

### ADMIN
- ✅ All BUYER permissions
- ✅ All OWNER permissions
- ✅ Verify properties
- ✅ Verify contractors
- ✅ Suspend contractors
- ✅ Mark properties as reserved/sold
- ✅ Access all data

---

## 📊 SAMPLE DATA

### Property Types
- `LAND`
- `HOUSE`
- `APARTMENT`
- `COMMERCIAL`

### Property Status
- `DRAFT` - Initial state
- `PENDING_VERIFICATION` - Submitted by owner
- `VERIFIED` - Approved by admin
- `RESERVED` - Reserved by buyer
- `SOLD` - Transaction complete

### Contractor Status
- `PENDING` - Initial state
- `VERIFIED` - Approved by admin
- `SUSPENDED` - Blocked by admin

### Common Services Offered
- Plumbing
- Electrical
- Roofing
- Painting
- Carpentry
- Masonry
- HVAC
- Landscaping
- Security Systems
- Interior Design

---

## 🔗 POSTMAN COLLECTION

Import this collection into Postman for quick testing:

```json
{
  "info": {
    "name": "ZimBuildHub API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "token",
      "value": "your-jwt-token-here"
    }
  ]
}
```

---

## 📝 NOTES

1. **Authentication Required**: Most endpoints require JWT token in Authorization header
2. **Role Verification**: Backend verifies user role for protected actions
3. **Ownership Checks**: Users can only modify their own resources
4. **Pagination**: Use `page` and `limit` query parameters
5. **Filtering**: Combine multiple filters for precise searches
6. **Image URLs**: Use full path including `/uploads/` prefix
7. **Decimal Values**: Price and size values are stored as Decimal in database
8. **Timestamps**: All timestamps are in ISO 8601 format

---

**Testing Status**: ✅ Backend Ready | ⏳ Frontend Integration Pending
