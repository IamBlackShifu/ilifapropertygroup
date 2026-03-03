# Property Owner/Seller Complete Flow Documentation

## Overview
This document describes the complete end-to-end flow for Property Owners/Sellers in the ILifa Property Group platform, from adding a property to managing it through verification, listing, and eventual sale.

## Table of Contents
1. [Property Creation](#property-creation)
2. [Property Status Workflow](#property-status-workflow)
3. [File and Image Upload](#file-and-image-upload)
4. [Property Management](#property-management)
5. [Owner Dashboard](#owner-dashboard)
6. [Property Analytics](#property-analytics)
7. [Admin Verification Process](#admin-verification-process)

---

## Property Creation

### Creating a New Property

**Route:** `/my-properties/new`

**Access:** Property Owners, Agents, and Admins only

**Process:**
1. Navigate to "My Properties" page
2. Click "+ Add New Property" button
3. Fill in the property form with required information:

#### Required Fields:
- **Title**: Property title (e.g., "Beautiful 3 Bedroom House in Borrowdale")
- **Description**: Detailed description (minimum 50 characters)
- **Property Type**: LAND, HOUSE, APARTMENT, or COMMERCIAL
- **Price**: Numeric value with currency (USD or ZWL)
- **Location City**: City name (e.g., "Harare")

#### Optional Fields:
- Location Area/Suburb
- Full Address
- Coordinates (Latitude & Longitude)
- Size in square meters
- Number of Bedrooms
- Number of Bathrooms

#### Images:
- Upload up to 10 images
- First image becomes the primary/featured image
- Supported formats: JPEG, JPG, PNG, WEBP
- Maximum file size: 5MB per image
- Images are required before submission for verification

### Backend API Endpoint:
```
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "propertyType": "HOUSE" | "LAND" | "APARTMENT" | "COMMERCIAL",
  "price": number,
  "currency": "USD" | "ZWL",
  "locationCity": "string",
  "locationArea": "string" (optional),
  "locationAddress": "string" (optional),
  "coordinatesLat": number (optional),
  "coordinatesLng": number (optional),
  "sizeSqm": number (optional),
  "bedrooms": number (optional),
  "bathrooms": number (optional),
  "images": ["url1", "url2", ...] (optional)
}
```

### Important Notes:
- **All new properties start in DRAFT status**
- Properties in DRAFT status are NOT visible to public/buyers
- Properties must be submitted for verification to become active
- Owners can edit draft properties before submission

---

## Property Status Workflow

### Status Flow:
```
DRAFT → PENDING_VERIFICATION → VERIFIED → [RESERVED → SOLD]
         ↓ (if rejected)
       DRAFT
```

### Status Descriptions:

#### 1. **DRAFT**
- Initial status when property is created
- Property is NOT visible to buyers
- Owner can freely edit the property
- Owner can submit for verification when ready
- Requirements for submission:
  - At least 1 image uploaded
  - Description must be at least 50 characters

#### 2. **PENDING_VERIFICATION**
- Property has been submitted and awaiting admin review
- Property is NOT visible to buyers
- Owner cannot edit the property
- Admin will either approve (→ VERIFIED) or reject (→ DRAFT)

#### 3. **VERIFIED**
- Property has been approved by admin
- **Property is now LIVE and visible to all buyers**
- Property appears in public property listings
- Buyers can view, save, and make reservations
- Property can be marked as RESERVED or SOLD

#### 4. **RESERVED**
- Property has an active reservation from a buyer
- Still visible to buyers but marked as "Reserved"
- Can be converted to SOLD

#### 5. **SOLD**
- Property has been sold
- Visible in listings but marked as "Sold"
- No new reservations can be made

---

## File and Image Upload

### Image Upload Process

#### Single Image Upload:
```
POST /api/files/upload/property-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary data]
```

#### Multiple Images Upload:
```
POST /api/files/upload/property-images
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: [binary data array, max 10 files]
```

### Upload Specifications:
- **Max Files:** 10 images per property
- **Allowed Types:** image/jpeg, image/jpg, image/png, image/webp
- **Max Size:** 5MB per image
- **Storage Location:** `/uploads/properties/`
- **URL Format:** `/uploads/properties/{random-hash}.{ext}`

### Image Management:
- Images are uploaded before property creation
- URLs are stored in property data
- First image is automatically set as primary
- Images can be removed/reordered during property creation
- Delete image endpoint available for cleanup

---

## Property Management

### My Properties Page
**Route:** `/my-properties`

**Features:**
- View all your properties
- Filter by status
- See property statistics:
  - Status badge (Draft, Pending, Verified, etc.)
  - View count
  - Price
  - Location
- Quick actions:
  - View property details
  - View analytics
  - Edit (for DRAFT properties only)
  - Delete property
  - Submit for verification (for DRAFT properties)

### Submit for Verification

**Action:** Click "Submit for Verification" button on a DRAFT property

**Backend Endpoint:**
```
PATCH /api/properties/{id}/submit-verification
Authorization: Bearer {token}
```

**Validation:**
- Property must be in DRAFT status
- Must have at least 1 image
- Description must be at least 50 characters
- User must be the property owner

**Result:**
- Property status changes to PENDING_VERIFICATION
- Admin is notified (future: notification system)
- Property awaits admin review

### Edit Property

**Route:** `/my-properties/edit/{id}`

**Access:** Only DRAFT properties can be edited

**Process:**
- Same form as property creation
- Pre-filled with existing data
- Can update all fields
- Can add/remove images
- Submit to save changes

**Backend Endpoint:**
```
PATCH /api/properties/{id}
Authorization: Bearer {token}
```

### Delete Property

**Action:** Click "Delete" button and confirm

**Backend Endpoint:**
```
DELETE /api/properties/{id}
Authorization: Bearer {token}
```

**Notes:**
- Only property owner can delete
- Confirmation modal prevents accidental deletion
- Permanently removes property and associated images
- Cannot be undone

---

## Owner Dashboard

### Dashboard Overview
**Route:** `/dashboard`

**Components:**

#### 1. **Statistics Cards**
- **My Properties:** Total number of properties
- **Total Value:** Sum of all property prices
- **Total Views:** Combined views across all properties
- **Live Properties:** Number of VERIFIED properties

#### 2. **Property Status Breakdown**
Visual breakdown showing count by status:
- Draft (gray)
- Pending (yellow)
- Verified (green)
- Reserved (blue)
- Sold (red)

#### 3. **Quick Actions**
- List a Property
- Manage Properties
- Verify Property

#### 4. **Recent Properties**
Displays the 5 most recently created properties

### Backend Endpoints:

#### Get User Properties:
```
GET /api/properties/my-properties
Authorization: Bearer {token}
```

#### Get Property Statistics:
```
GET /api/properties/user/stats
Authorization: Bearer {token}

Response:
{
  "total": number,
  "byStatus": {
    "draft": number,
    "pending": number,
    "verified": number,
    "reserved": number,
    "sold": number
  }
}
```

---

## Property Analytics

### Analytics Page
**Route:** `/my-properties/{id}/analytics`

**Access:** Property owner only

**Metrics Displayed:**

#### 1. **Engagement Stats**
- Total Views
- Total Reservations
- Active Reservations
- Total Reviews
- Average Rating

#### 2. **Recent Reservations**
- User information
- Reservation status
- Creation date
- Expiration date

#### 3. **Property Reviews**
- Reviewer name
- Star rating (1-5)
- Review comment
- Review date

#### 4. **Associated Projects**
- Project type
- Project status
- Related construction/renovation projects

### Backend Endpoint:
```
GET /api/properties/{id}/analytics
Authorization: Bearer {token}

Response:
{
  "property": {
    "id": "string",
    "title": "string",
    "status": "string",
    "viewCount": number,
    "createdAt": "date"
  },
  "engagement": {
    "totalViews": number,
    "totalReservations": number,
    "activeReservations": number,
    "totalReviews": number,
    "averageRating": number
  },
  "reservations": [...],
  "reviews": [...],
  "projects": [...]
}
```

---

## Admin Verification Process

### Admin Actions

#### Verify Property:
```
PATCH /api/properties/{id}/verify
Authorization: Bearer {token} (Admin only)
```

**Effect:**
- Status changes from PENDING_VERIFICATION to VERIFIED
- `isVerified` set to `true`
- `verifiedAt` timestamp recorded
- Property becomes visible to public
- Owner notified (future: notification system)

#### Reject Property:
```
PATCH /api/properties/{id}/reject
Authorization: Bearer {token} (Admin only)

Body:
{
  "reason": "string (optional)"
}
```

**Effect:**
- Status changes from PENDING_VERIFICATION back to DRAFT
- `isVerified` set to `false`
- Owner can make changes and resubmit
- Owner notified with rejection reason (future: notification system)

### Admin Validation Rules
- Only properties in PENDING_VERIFICATION can be verified or rejected
- Admin user role required
- Action is logged (future: audit trail)

---

## Property Owner Roles & Permissions

### What Property Owners Can Do:

✅ **Create Properties**
- Add new property listings
- Upload images and documents
- Set pricing and details

✅ **Manage Their Properties**
- View all their properties
- Edit DRAFT properties
- Delete any of their properties
- Submit for verification

✅ **View Analytics**
- See property performance metrics
- Track views and engagement
- Monitor reservations
- Read reviews

✅ **Dashboard Access**
- View statistics
- See recent activity
- Quick actions

### What Property Owners Cannot Do:

❌ **Approve/Verify Properties**
- Only admins can verify properties
- Cannot self-verify

❌ **Edit Published Properties**
- Cannot edit properties that are VERIFIED, RESERVED, or SOLD
- Must create new listing for changes

❌ **View Other Owners' Properties**
- Can only manage their own properties
- Cannot access other owner dashboards

❌ **Access Admin Functions**
- Cannot verify other properties
- Cannot access admin panel

---

## Frontend Components

### Key Components:

1. **PropertyForm** (`/components/properties/PropertyForm.tsx`)
   - Reusable form for create/edit
   - Handles image upload
   - Form validation

2. **My Properties Page** (`/app/my-properties/page.tsx`)
   - Property grid display
   - Status badges
   - Action buttons
   - Submit for verification

3. **Owner Dashboard** (`/app/dashboard/page.tsx`)
   - Statistics display
   - Status breakdown
   - Recent activity

4. **Property Analytics** (`/app/my-properties/[id]/analytics/page.tsx`)
   - Detailed metrics
   - Reservations list
   - Reviews display

---

## Security & Authorization

### Route Protection:
- All property owner routes use `ProtectedRoute` component
- Requires authentication (`JwtAuthGuard`)
- Role-based access control (RBAC)
- Allowed roles: OWNER, AGENT, ADMIN

### Backend Security:
- JWT token validation on all endpoints
- User ID extracted from token
- Ownership verification on all property actions
- Cannot modify other users' properties

### Data Validation:
- DTOs with class-validator decorators
- Required fields enforced
- Type checking
- Minimum/maximum constraints

---

## Testing the Complete Flow

### End-to-End Test Scenario:

1. **Register/Login as Property Owner**
   - Navigate to `/auth/register`
   - Select "OWNER" role
   - Complete registration

2. **Create First Property**
   - Go to Dashboard → "List a Property"
   - Fill in required fields
   - Upload at least 1 image
   - Submit (saves as DRAFT)

3. **View in My Properties**
   - Navigate to "My Properties"
   - See property with DRAFT badge
   - Note: property NOT visible in public listings yet

4. **Submit for Verification**
   - Click "Submit for Verification" button
   - Confirm submission
   - Status changes to PENDING_VERIFICATION

5. **Admin Approves** (Login as Admin)
   - Admin reviews property
   - Clicks "Verify" button
   - Property status → VERIFIED

6. **Property Goes Live**
   - Property now appears in public `/properties` listings
   - Buyers can view and interact
   - Owner can view analytics

7. **Monitor Analytics**
   - Owner visits analytics page
   - Tracks views, reservations, reviews
   - Monitors engagement

---

## Future Enhancements

### Planned Features:

1. **Notifications**
   - Email notifications for verification status
   - Push notifications for new reservations
   - Review alerts

2. **Advanced Analytics**
   - View trends over time
   - Comparison with similar properties
   - Price recommendations

3. **Bulk Operations**
   - Upload multiple properties at once
   - Bulk edit/delete
   - Export property data

4. **Property Variants**
   - Multiple units/floors for same property
   - Pricing tiers
   - Availability calendar

5. **Enhanced Verification**
   - Document upload for ownership proof
   - Automated checks
   - Verification levels (basic, premium)

---

## API Reference Summary

### Property Endpoints:

| Method | Endpoint | Purpose | Auth | Roles |
|--------|----------|---------|------|-------|
| POST | `/api/properties` | Create property | ✅ | OWNER, AGENT, ADMIN |
| GET | `/api/properties` | List public properties | ❌ | All |
| GET | `/api/properties/my-properties` | Get user properties | ✅ | OWNER, AGENT, ADMIN |
| GET | `/api/properties/user/stats` | Get property statistics | ✅ | OWNER, AGENT, ADMIN |
| GET | `/api/properties/:id` | Get single property | ❌ | All |
| GET | `/api/properties/:id/analytics` | Get property analytics | ✅ | OWNER (own), ADMIN |
| PATCH | `/api/properties/:id` | Update property | ✅ | OWNER (own), ADMIN |
| DELETE | `/api/properties/:id` | Delete property | ✅ | OWNER (own), ADMIN |
| PATCH | `/api/properties/:id/submit-verification` | Submit for verification | ✅ | OWNER (own), ADMIN |
| PATCH | `/api/properties/:id/verify` | Verify property | ✅ | ADMIN |
| PATCH | `/api/properties/:id/reject` | Reject verification | ✅ | ADMIN |
| PATCH | `/api/properties/:id/reserve` | Mark as reserved | ✅ | ADMIN |
| PATCH | `/api/properties/:id/sold` | Mark as sold | ✅ | ADMIN |

### File Upload Endpoints:

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/files/upload/property-image` | Upload single image | ✅ |
| POST | `/api/files/upload/property-images` | Upload multiple images | ✅ |
| DELETE | `/api/files/delete` | Delete image | ✅ |

---

## Troubleshooting

### Common Issues:

**Issue:** Cannot submit property for verification
- **Solution:** Ensure property has at least 1 image and description is 50+ characters

**Issue:** Property not showing in public listings
- **Solution:** Property must be VERIFIED status. Check My Properties page for current status.

**Issue:** Cannot edit property
- **Solution:** Only DRAFT properties can be edited. Create a new listing if property is VERIFIED.

**Issue:** Image upload fails
- **Solution:** Check file size (<5MB) and format (JPEG, PNG, WEBP only)

**Issue:** Delete button not working
- **Solution:** Confirm you're the property owner and check authentication token

---

## Contact & Support

For issues or questions about the Property Owner flow:
- Check API documentation: `/docs/API_REFERENCE.md`
- Review RBAC configuration: `/docs/RBAC_CONFIGURATION.md`
- Refer to testing guide: `/docs/PROPERTY_OWNER_TEST_GUIDE.md`

---

*Last Updated: January 19, 2026*
