# Submission & Update Functionalities by Role

## Overview
This document outlines all submission and update capabilities for each user role in ILifa Property Group.

---

## ✅ PROPERTY OWNERS (OWNER Role)

### Property Management - FULLY IMPLEMENTED

#### 1. Create New Property ✅
**Page**: `/my-properties/new`  
**Access**: OWNER, AGENT, ADMIN

**Fields Available**:
- **Basic Information**:
  - Title (required)
  - Property Type (LAND, HOUSE, APARTMENT, COMMERCIAL)
  - Description (required)
  - Price in USD (required)

- **Location**:
  - City (required)
  - Area/Suburb (optional)
  - Full Address (optional)
  - Latitude/Longitude (optional)

- **Property Details**:
  - Land Size in sqm (optional)
  - Bedrooms (optional)
  - Bathrooms (optional)

- **Additional**:
  - Features (comma-separated: Pool, Garden, Garage, Security)
  - Image URLs (comma-separated, first one becomes primary)

**API Endpoint**: `POST /api/properties`  
**Status**: Property created with status DRAFT by default

**How to Use**:
1. Navigate to `/my-properties`
2. Click "+ Add New Property" button
3. Fill in the form
4. Click "List Property"
5. Property appears in your properties list

---

#### 2. Edit Existing Property ✅
**Page**: `/my-properties/edit/[id]`  
**Access**: Property owner only (or ADMIN)

**Editable Fields**: All fields from creation form

**API Endpoint**: `PATCH /api/properties/:id`  
**Validation**: Backend verifies user owns the property

**How to Use**:
1. Go to `/my-properties`
2. Click "Edit" on any property card
3. Update fields as needed
4. Click "Update Property"

---

#### 3. Delete Property ✅
**Page**: `/my-properties`  
**Access**: Property owner only (or ADMIN)

**Confirmation**: Modal dialog before deletion

**API Endpoint**: `DELETE /api/properties/:id`  
**Validation**: Backend verifies ownership

**How to Use**:
1. Go to `/my-properties`
2. Click "Delete" on property card
3. Confirm in modal
4. Property is permanently removed

---

#### 4. View My Properties ✅
**Page**: `/my-properties`  
**Shows**:
- All properties owned by user
- Status badges (VERIFIED, PENDING_VERIFICATION, DRAFT, SOLD)
- View count
- Actions: View, Edit, Delete

**API Endpoint**: `GET /api/properties/my-properties`

---

### Property Verification - TO BE IMPLEMENTED

#### Submit for Verification ⏳
**Page**: `/verify/property` (to be created)  
**Purpose**: Submit property documents for verification

**Expected Workflow**:
1. Owner creates property (status: DRAFT)
2. Owner submits property for verification
3. Upload required documents:
   - Title deed
   - Survey plan
   - Identification
4. Property status changes to PENDING_VERIFICATION
5. Admin reviews and approves
6. Property status changes to VERIFIED

**API Endpoint**: To be created - `POST /api/verifications/property/:id`

---

## ✅ REAL ESTATE AGENTS (AGENT Role)

### Client Property Management - FULLY IMPLEMENTED

#### 1. List Client Properties ✅
**Same as OWNER**: Can create properties on behalf of clients  
**Page**: `/my-properties/new`  
**Access**: AGENT can list properties they manage

**Additional Context**:
- Agents list properties for their clients
- Agents can edit/manage client properties
- Commission tracking in dashboard

---

#### 2. Edit Client Properties ✅
**Same as OWNER**: Full editing capabilities  
**Page**: `/my-properties/edit/[id]`

---

#### 3. Manage Listings ✅
**Dashboard**: Shows "Listed Properties" count  
**Page**: `/my-properties` - Shows all agent-managed properties

---

### Client Management - TO BE IMPLEMENTED

#### Add New Client ⏳
**Page**: `/clients/new` (to be created)  
**Fields**:
- Client name
- Contact information
- Property requirements
- Budget range
- Preferred locations

**API Endpoint**: To be created - `POST /api/clients`

---

#### Track Deals ⏳
**Page**: `/deals` (to be created)  
**Features**:
- Deal pipeline (Lead → Viewing → Negotiation → Closed)
- Commission tracking
- Document management

**API Endpoint**: To be created - `GET/POST /api/deals`

---

## 🏗️ CONTRACTORS (CONTRACTOR Role)

### Profile & Portfolio Management - TO BE IMPLEMENTED

#### 1. Update Contractor Profile ⏳
**Page**: `/profile` (exists, needs contractor-specific fields)  
**Additional Fields Needed**:
- Company name
- Registration number
- Years of experience
- Specializations (Residential, Commercial, Renovation)
- Service areas
- Certifications
- Portfolio images

**API Endpoint**: `PATCH /api/users/profile`

---

#### 2. Submit Portfolio Projects ⏳
**Page**: `/portfolio/new` (to be created)  
**Fields**:
- Project name
- Description
- Property type built
- Duration
- Budget/Cost
- Location
- Before/After images
- Client testimonial

**API Endpoint**: To be created - `POST /api/contractors/portfolio`

---

#### 3. Submit Project Quotes ⏳
**Page**: `/quotes/new` (to be created)  
**Fields**:
- Project reference
- Client name
- Quote amount
- Timeline
- Materials breakdown
- Labor costs
- Terms & conditions

**API Endpoint**: To be created - `POST /api/projects/:id/quotes`

---

#### 4. Update Project Status ⏳
**Page**: `/projects/[id]` (to be created)  
**Statuses**:
- Quoted
- In Progress
- On Hold
- Completed
- Cancelled

**Features**:
- Upload progress photos
- Add milestones
- Time tracking
- Client communication

**API Endpoint**: To be created - `PATCH /api/projects/:id/status`

---

#### 5. Submit for Verification ⏳
**Page**: `/verify/contractor` (to be created)  
**Documents Required**:
- Business registration
- Tax compliance certificate
- Professional qualifications
- Insurance documents
- Portfolio samples

**API Endpoint**: To be created - `POST /api/verifications/contractor`

---

## 📦 SUPPLIERS (SUPPLIER Role)

### Product Catalog Management - TO BE IMPLEMENTED

#### 1. Add New Product ⏳
**Page**: `/products/new` (to be created)  
**Fields**:
- Product name
- Category (Cement, Bricks, Tiles, Paint, Steel, etc.)
- Description
- Unit price
- Unit of measure (bags, sqm, pieces)
- Stock quantity
- Minimum order quantity
- Product images
- Specifications
- Delivery available

**API Endpoint**: To be created - `POST /api/products`

---

#### 2. Edit Product ⏳
**Page**: `/products/edit/[id]` (to be created)  
**All fields editable**: Same as creation

**API Endpoint**: To be created - `PATCH /api/products/:id`

---

#### 3. Update Stock Levels ⏳
**Page**: `/products` or quick update in list  
**Fields**:
- Current stock
- Low stock alert threshold
- Restock date

**API Endpoint**: To be created - `PATCH /api/products/:id/stock`

---

#### 4. Manage Orders ⏳
**Page**: `/orders` (to be created)  
**Actions**:
- View incoming orders
- Confirm orders
- Update order status (Processing, Shipped, Delivered)
- Add tracking information

**API Endpoint**: To be created - `GET/PATCH /api/orders`

---

#### 5. Submit Quotes ⏳
**Page**: `/quotes` (to be created)  
**For bulk orders or custom requests**:
- Quote reference
- Client details
- Product list
- Quantities
- Unit prices
- Delivery cost
- Total amount
- Validity period

**API Endpoint**: To be created - `POST /api/quotes`

---

#### 6. Update Company Profile ⏳
**Page**: `/profile` (needs supplier-specific fields)  
**Additional Fields**:
- Company name
- Business registration
- Product categories
- Delivery areas
- Payment methods
- Bank details
- Opening hours

**API Endpoint**: `PATCH /api/users/profile`

---

## 🏠 BUYERS (BUYER Role)

### Property Interaction - TO BE IMPLEMENTED

#### 1. Save/Favorite Properties ⏳
**Page**: Any property listing  
**Action**: Click "Save" button

**API Endpoint**: To be created - `POST /api/properties/:id/save`

**Dashboard**: Shows "Saved Properties" count

---

#### 2. Submit Property Inquiry ⏳
**Page**: `/buy-property/[id]` (property details page)  
**Form Fields**:
- Name
- Email
- Phone
- Message/Question
- Preferred viewing date

**API Endpoint**: To be created - `POST /api/properties/:id/inquiries`

---

#### 3. Schedule Property Tour ⏳
**Page**: Property details page  
**Fields**:
- Preferred date
- Preferred time
- Number of people
- Special requirements

**API Endpoint**: To be created - `POST /api/properties/:id/tours`

---

#### 4. Submit Building Project Request ⏳
**Page**: `/build-home/new` (to be created)  
**Fields**:
- Project type (New build, Renovation, Extension)
- Property type
- Budget range
- Timeline
- Location
- Number of rooms
- Special requirements
- Design preferences

**API Endpoint**: To be created - `POST /api/projects`

---

#### 5. Review Property ⏳
**Page**: Property details page  
**After purchase or viewing**:
- Rating (1-5 stars)
- Review text
- Would recommend?

**API Endpoint**: To be created - `POST /api/properties/:id/reviews`

---

## 👨‍💼 ADMIN (ADMIN Role)

### User Management - TO BE IMPLEMENTED

#### 1. View All Users ⏳
**Page**: `/admin/users` (to be created)  
**Features**:
- List all users with filters
- Search by name, email, role
- View user details
- Activity logs

**API Endpoint**: To be created - `GET /api/admin/users`

---

#### 2. Update User Status ⏳
**Actions**:
- Suspend user
- Activate user
- Change role
- Delete user

**API Endpoint**: To be created - `PATCH /api/admin/users/:id`

---

### Property Management

#### 1. Moderate Properties ⏳
**Page**: `/admin/properties` (to be created)  
**Actions**:
- View all properties (including drafts)
- Edit any property ✅ (can use existing edit page)
- Delete any property ✅ (can use existing functionality)
- Change property status

**API Endpoint**: Partially exists - `PATCH/DELETE /api/properties/:id` (needs admin override)

---

### Verification Management

#### 1. Review Property Verifications ⏳
**Page**: `/admin/verifications/properties` (to be created)  
**Actions**:
- View submitted documents
- Approve verification
- Reject with reason
- Request additional documents

**API Endpoint**: To be created - `GET/PATCH /api/verifications/properties`

---

#### 2. Review Contractor Verifications ⏳
**Page**: `/admin/verifications/contractors` (to be created)  
**Actions**:
- View submitted credentials
- Verify documents
- Approve/Reject
- Add verification badge

**API Endpoint**: To be created - `GET/PATCH /api/verifications/contractors`

---

## 📊 Summary Status

### ✅ Fully Implemented
| Role | Feature | Status |
|------|---------|--------|
| OWNER | Create Property | ✅ Complete |
| OWNER | Edit Property | ✅ Complete |
| OWNER | Delete Property | ✅ Complete |
| OWNER | View My Properties | ✅ Complete |
| AGENT | All OWNER features | ✅ Complete |
| ADMIN | View Dashboard | ✅ Complete |

### ⏳ To Be Implemented
| Role | Feature | Priority |
|------|---------|----------|
| OWNER | Submit for Verification | High |
| AGENT | Client Management | Medium |
| AGENT | Deal Tracking | Medium |
| CONTRACTOR | Portfolio Management | High |
| CONTRACTOR | Quote Submission | High |
| CONTRACTOR | Project Status Updates | High |
| CONTRACTOR | Verification Submission | Medium |
| SUPPLIER | Product Catalog | High |
| SUPPLIER | Order Management | High |
| SUPPLIER | Stock Updates | Medium |
| BUYER | Save Properties | Medium |
| BUYER | Submit Inquiries | High |
| BUYER | Schedule Tours | Medium |
| BUYER | Building Requests | High |
| ADMIN | User Management | High |
| ADMIN | Verification Review | High |

---

## 🚀 Next Implementation Steps

### Week 2 - Priority Features
1. **Property Inquiries** (BUYER → OWNER)
   - Create inquiry form on property details page
   - Email notifications to property owner
   - Dashboard widget for owners to view inquiries

2. **Contractor Portfolio** (CONTRACTOR)
   - Portfolio creation page
   - Portfolio display on contractor profile
   - Project showcase with images

3. **Supplier Products** (SUPPLIER)
   - Product catalog creation
   - Product listing page
   - Product search and filtering

### Week 3 - Secondary Features
1. **Property Verification** (OWNER/AGENT → ADMIN)
   - Document upload system
   - Admin review interface
   - Status tracking

2. **Building Project Requests** (BUYER → CONTRACTOR)
   - Project creation form
   - Contractor bidding system
   - Project management dashboard

3. **Client Management** (AGENT)
   - Client database
   - Lead tracking
   - Communication history

---

## Testing Current Functionality

### Test Property Owner Workflow
1. **Register as OWNER**:
   ```
   Email: owner@test.com
   Role: Property Owner / Seller
   ```

2. **Create Property**:
   - Go to http://localhost:3000/my-properties
   - Click "+ Add New Property"
   - Fill form and submit
   - Verify property appears in list

3. **Edit Property**:
   - Click "Edit" on any property
   - Update fields
   - Save changes
   - Verify updates reflected

4. **Delete Property**:
   - Click "Delete" on property
   - Confirm in modal
   - Verify property removed

### Test Agent Workflow
Same as OWNER - agents have identical property management capabilities.

### Test Access Control
1. **Register as BUYER**: Cannot access `/my-properties` (should redirect)
2. **Register as CONTRACTOR**: Cannot access `/my-properties` (should redirect)
3. **Register as SUPPLIER**: Cannot access `/my-properties` (should redirect)

---

**Last Updated**: January 13, 2026  
**Status**: Property management COMPLETE, other role features IN PROGRESS
