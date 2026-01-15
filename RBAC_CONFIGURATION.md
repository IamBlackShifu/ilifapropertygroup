# Role-Based Access Control (RBAC) Configuration

## Overview
This document outlines the access permissions for each user role in ZimBuildHub.

## User Roles

### 1. BUYER (Property Buyer / Home Builder)
**Primary Goal**: Find and purchase properties, build homes

**Accessible Pages**:
- ✅ `/` - Home page
- ✅ `/buy-property` - Browse all properties
- ✅ `/buy-property/[id]` - View property details
- ✅ `/professionals` - Find agents, contractors
- ✅ `/build-home` - Start building projects
- ✅ `/suppliers` - Browse suppliers
- ✅ `/dashboard` - Personal dashboard (saved properties, searches)
- ✅ `/profile` - Edit profile
- ❌ `/my-properties` - NOT accessible (not a property owner)

**Dashboard Features**:
- Saved properties count
- Property searches
- Inquiries sent
- Scheduled property tours
- Quick actions: Browse properties, Find professionals, Build home

---

### 2. OWNER (Property Owner / Seller)
**Primary Goal**: List and manage property sales

**Accessible Pages**:
- ✅ All BUYER pages PLUS:
- ✅ `/my-properties` - Manage their property listings
- ✅ `/my-properties/new` - Create new property listing
- ✅ `/my-properties/edit/[id]` - Edit their properties
- ✅ `/verify/property` - Verify property documents

**Dashboard Features**:
- My properties count
- Total property value
- Property views
- Inquiries received
- Quick actions: List property, Manage properties, Verify property
- Recent properties list

---

### 3. AGENT (Real Estate Agent)
**Primary Goal**: Manage client properties and transactions

**Accessible Pages**:
- ✅ All BUYER pages PLUS:
- ✅ `/my-properties` - Manage client property listings
- ✅ `/my-properties/new` - Create listings for clients
- ✅ `/my-properties/edit/[id]` - Edit managed properties
- ✅ `/verify/property` - Verify properties

**Dashboard Features**:
- Listed properties count
- Active clients
- Closed deals
- Commission earned
- Quick actions: Add listing, My listings, Browse market
- Listed properties overview

---

### 4. CONTRACTOR (Contractor / Builder)
**Primary Goal**: Find projects and showcase work

**Accessible Pages**:
- ✅ `/` - Home page
- ✅ `/build-home` - Browse building projects
- ✅ `/professionals` - View other professionals
- ✅ `/suppliers` - Find material suppliers
- ✅ `/dashboard` - Personal dashboard
- ✅ `/profile` - Edit profile and portfolio
- ❌ `/my-properties` - NOT accessible
- ⚠️ `/buy-property` - Read-only access

**Dashboard Features**:
- Active projects count
- Completed projects
- Pending quotes
- Earnings
- Quick actions: Find projects, Update portfolio, Find suppliers

---

### 5. SUPPLIER (Supplier / Vendor)
**Primary Goal**: List products and receive orders

**Accessible Pages**:
- ✅ `/` - Home page
- ✅ `/suppliers` - Manage product catalog
- ✅ `/dashboard` - Personal dashboard
- ✅ `/profile` - Edit company profile
- ❌ `/my-properties` - NOT accessible
- ⚠️ `/buy-property` - Read-only access
- ⚠️ `/professionals` - Read-only access

**Dashboard Features**:
- Products listed count
- Orders received
- Pending quotes
- Revenue
- Quick actions: Add products, My catalog, Company profile

---

### 6. ADMIN (Administrator)
**Primary Goal**: Manage platform and oversee all operations

**Accessible Pages**:
- ✅ **ALL PAGES** - Full access to entire platform
- ✅ `/admin` - Admin panel (TODO: to be implemented)
- ✅ `/verify/property` - Approve verifications
- ✅ `/verify/contractor` - Approve contractor verifications

**Dashboard Features**:
- Total users count
- Total properties
- Pending verifications
- Platform revenue
- Quick actions: Manage properties, Manage users, Verifications

---

## Implementation Details

### Protected Route Component
Location: `frontend/src/components/auth/ProtectedRoute.tsx`

```tsx
<ProtectedRoute allowedRoles={['OWNER', 'AGENT', 'ADMIN']}>
  {/* Page content */}
</ProtectedRoute>
```

### Role Check in Components
```tsx
import { useAuth } from '@/contexts/AuthContext'

const { user, hasRole } = useAuth()

// Check single role
if (user?.role === 'OWNER') {
  // Show owner-specific content
}

// Check multiple roles
if (hasRole(['OWNER', 'AGENT', 'ADMIN'])) {
  // Show content for multiple roles
}
```

### Backend Role Enforcement
All protected API endpoints enforce role-based access:
- `POST /api/properties` - Requires: OWNER, AGENT, or ADMIN
- `PATCH /api/properties/:id` - Requires: Property owner or ADMIN
- `DELETE /api/properties/:id` - Requires: Property owner or ADMIN
- `GET /api/properties/my-properties` - Requires: Authenticated user

---

## Current Status

### ✅ Implemented
- User role types defined in backend (BUYER, OWNER, CONTRACTOR, SUPPLIER, AGENT, ADMIN)
- Registration form updated with all role options
- ProtectedRoute component with `allowedRoles` support
- Role-specific dashboards for all 6 roles
- My Properties page restricted to OWNER, AGENT, ADMIN
- Role-based navigation and quick actions

### ⏳ To Be Implemented
- Admin panel (`/admin`)
- Contractor verification page
- Supplier product management
- Project management for contractors
- Client management for agents
- Hide navigation links based on role
- Role-based content filtering in listings

---

## Testing Role-Based Access

1. **Register as different roles**:
   - BUYER: Can browse, cannot list properties
   - OWNER: Can list and manage properties
   - AGENT: Can manage client properties
   - CONTRACTOR: Sees project-focused dashboard
   - SUPPLIER: Sees supplier-focused dashboard
   - ADMIN: Can access everything

2. **Try accessing protected routes**:
   - BUYER accessing `/my-properties` → Redirected to home
   - OWNER accessing `/my-properties` → ✅ Allowed

3. **Check dashboard content**:
   - Each role sees role-appropriate stats and actions
   - Different quick action buttons per role
