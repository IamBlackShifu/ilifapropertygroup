# Testing Role-Based Access Control (RBAC)

## Overview
This guide helps you test the complete role-based access control system in ILifa Property Group.

---

## Test Preparation

### 1. Ensure Services Are Running
```powershell
# Check Docker containers
docker ps

# You should see:
# - postgres
# - backend (NestJS on port 4000)
# - frontend (Next.js on port 3000)
# - nginx (on port 80)
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/api

---

## Test Cases by Role

### Test 1: BUYER Role
**Primary Goal**: Browse properties and find professionals

#### Registration
1. Navigate to http://localhost:3000/auth/register
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Buyer`
   - Email: `buyer@test.com`
   - Password: `Test123!`
   - Role: **Property Buyer / Home Builder**
   - Phone: `+263712345678`
3. Click "Create Account"
4. ✅ Should be logged in automatically

#### Navigation Visibility
After login, check the header navigation:
- ✅ Should see: **Buy Property, Build Home, Professionals, Suppliers, Diaspora, Market Insights, Learn**
- ❌ Should NOT see: **My Properties, Verify**

#### Dashboard Access
1. Click "Dashboard" in user dropdown
2. ✅ Should see BUYER dashboard with:
   - Saved Properties: 0
   - Searches: 0
   - Inquiries: 0
   - Scheduled Tours: 0
   - Quick Actions: Browse Properties, Find Professionals, Build Home

#### Protected Route Test
1. Manually navigate to http://localhost:3000/my-properties
2. ❌ Should be redirected to home page (/)
3. ✅ Should see toast/error message: "You don't have access to this page"

#### Buy Property Page
1. Navigate to /buy-property
2. ✅ Should see property listings
3. ✅ Can use filters (search, price range, bedrooms)
4. ✅ Can view property details

---

### Test 2: OWNER Role
**Primary Goal**: List and manage properties

#### Registration
1. Log out if logged in
2. Navigate to /auth/register
3. Register with:
   - Name: `Jane Owner`
   - Email: `owner@test.com`
   - Password: `Test123!`
   - Role: **Property Owner / Seller**
   - Phone: `+263712345679`

#### Navigation Visibility
After login, check navigation:
- ✅ Should see: **Buy Property, My Properties, Professionals, Suppliers, Diaspora, Market Insights, Verify (dropdown), Learn**
- ✅ Verify dropdown should show: **Verify Property**

#### Dashboard Access
1. Navigate to /dashboard
2. ✅ Should see OWNER dashboard with:
   - My Properties: (count of your properties)
   - Total Value: $0
   - Views: 0
   - Inquiries: 0
   - Quick Actions: List Property, Manage Properties, Verify Property

#### My Properties Page
1. Click "My Properties" in navigation
2. ✅ Should access the page successfully
3. ✅ Should see empty state: "No properties yet"
4. ✅ Should see "List Your First Property" button

#### Create Property
1. Click "List Your First Property" or "List New Property"
2. Fill in property details:
   - Title: `Beautiful House in Harare`
   - Description: `Spacious 3-bedroom house`
   - Type: HOUSE
   - Price: `150000`
   - Location: `Harare, Zimbabwe`
   - Bedrooms: `3`
   - Bathrooms: `2`
   - Land Size: `500`
3. Submit the form
4. ✅ Property should be created
5. ✅ Should appear in My Properties list
6. ✅ Dashboard should now show: My Properties: 1, Total Value: $150,000

---

### Test 3: AGENT Role
**Primary Goal**: Manage client properties and sales

#### Registration
1. Register as AGENT:
   - Name: `Mike Agent`
   - Email: `agent@test.com`
   - Password: `Test123!`
   - Role: **Real Estate Agent**

#### Navigation Visibility
- ✅ Should see: **Buy Property, My Properties, Professionals, Suppliers, Diaspora, Market Insights, Verify, Learn**

#### Dashboard
1. ✅ Should see AGENT dashboard with:
   - Listed Properties: 0
   - Clients: 0
   - Closed Deals: 0
   - Commission: $0
   - Quick Actions: Add Listing, My Listings, Browse Market

#### My Properties Access
1. ✅ Should access /my-properties successfully
2. ✅ Can create listings for clients
3. ✅ Can manage all properties they list

---

### Test 4: CONTRACTOR Role
**Primary Goal**: Find building projects

#### Registration
1. Register as CONTRACTOR:
   - Name: `Bob Builder`
   - Email: `contractor@test.com`
   - Password: `Test123!`
   - Role: **Contractor / Builder**

#### Navigation Visibility
After login:
- ✅ Should see: **Build Home, Professionals, Suppliers, Diaspora, Market Insights, Verify (Verify Professional only), Learn**
- ❌ Should NOT see: **My Properties**
- ⚠️ Buy Property: Can view but read-only

#### Dashboard
1. ✅ Should see CONTRACTOR dashboard with:
   - Active Projects: 0
   - Completed Projects: 0
   - Pending Quotes: 0
   - Earnings: $0
   - Quick Actions: Find Projects, My Portfolio, Find Suppliers

#### Protected Route Test
1. Try accessing /my-properties
2. ❌ Should be redirected to home

---

### Test 5: SUPPLIER Role
**Primary Goal**: List products and receive orders

#### Registration
1. Register as SUPPLIER:
   - Name: `Sarah Supplier`
   - Email: `supplier@test.com`
   - Password: `Test123!`
   - Role: **Supplier / Vendor**

#### Navigation Visibility
- ✅ Should see: **Professionals, Suppliers, Diaspora, Market Insights, Learn**
- ❌ Should NOT see: **My Properties, Verify**
- ⚠️ Buy Property & Build Home: Read-only

#### Dashboard
1. ✅ Should see SUPPLIER dashboard with:
   - Products Listed: 0
   - Orders Received: 0
   - Pending Quotes: 0
   - Revenue: $0
   - Quick Actions: Add Products, My Catalog, Company Profile

---

### Test 6: ADMIN Role
**Primary Goal**: Manage entire platform

#### Registration
1. Register as ADMIN:
   - Name: `Admin User`
   - Email: `admin@test.com`
   - Password: `Test123!`
   - Role: **Administrator**

#### Navigation Visibility
- ✅ Should see ALL navigation items
- ✅ Full access to every page

#### Dashboard
1. ✅ Should see ADMIN dashboard with:
   - Total Users: (count)
   - Total Properties: (count)
   - Pending Verifications: 0
   - Platform Revenue: $0
   - Quick Actions: Manage Properties, Manage Users, Verifications

#### Access All Pages
1. ✅ Can access /my-properties
2. ✅ Can access /buy-property
3. ✅ Can access /verify/property
4. ✅ Can access /verify/agent
5. ✅ Can view and manage all properties

---

## Cross-Role Testing

### Test 7: Role Switching
1. Register with multiple roles
2. Log out and log in as different roles
3. ✅ Verify navigation changes per role
4. ✅ Verify dashboard content changes
5. ✅ Verify access restrictions enforced

### Test 8: Direct URL Access
For each role, try accessing restricted pages directly:

**BUYER accessing OWNER pages**:
```
http://localhost:3000/my-properties → ❌ Redirected to /
http://localhost:3000/verify/property → ❌ Not visible in nav
```

**CONTRACTOR accessing OWNER pages**:
```
http://localhost:3000/my-properties → ❌ Redirected to /
```

**SUPPLIER accessing BUYER pages**:
```
http://localhost:3000/buy-property → ⚠️ Read-only (can view but not act)
```

---

## Backend API Testing

### Test Backend Role Enforcement

#### 1. Get Auth Token
```bash
# Login as BUYER
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@test.com",
    "password": "Test123!"
  }'

# Copy the access_token from response
```

#### 2. Test Property Creation (Should Fail for BUYER)
```bash
curl -X POST http://localhost:4000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Test Property",
    "description": "Test",
    "type": "HOUSE",
    "price": 100000,
    "location": "Harare"
  }'

# Expected: ❌ 403 Forbidden (only OWNER, AGENT, ADMIN can create)
```

#### 3. Test as OWNER (Should Succeed)
```bash
# Login as OWNER
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@test.com",
    "password": "Test123!"
  }'

# Create property
curl -X POST http://localhost:4000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer OWNER_ACCESS_TOKEN" \
  -d '{
    "title": "Test Property",
    "description": "Test",
    "type": "HOUSE",
    "price": 100000,
    "location": "Harare"
  }'

# Expected: ✅ 201 Created
```

---

## Expected Results Summary

| Role | Buy Property | My Properties | Build Home | Verify | Dashboard |
|------|--------------|---------------|------------|---------|-----------|
| BUYER | ✅ Full Access | ❌ Blocked | ✅ Full Access | ❌ Hidden | ✅ Buyer Stats |
| OWNER | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Property Only | ✅ Owner Stats |
| AGENT | ✅ Full Access | ✅ Full Access | ⚠️ View Only | ✅ Full Access | ✅ Agent Stats |
| CONTRACTOR | ⚠️ View Only | ❌ Blocked | ✅ Full Access | ✅ Professional | ✅ Contractor Stats |
| SUPPLIER | ⚠️ View Only | ❌ Blocked | ⚠️ View Only | ❌ Hidden | ✅ Supplier Stats |
| ADMIN | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Admin Stats |

**Legend**:
- ✅ Full Access: Can view and perform all actions
- ⚠️ View Only: Can view but limited actions
- ❌ Blocked: Cannot access, redirected

---

## Troubleshooting

### Issue: "You don't have access" error not showing
**Solution**: Check ProtectedRoute component is wrapping the page

### Issue: Navigation items not updating after login
**Solution**: 
1. Check `useAuth()` returns correct user object
2. Verify `getVisibleNavItems()` function in Header.tsx
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: Dashboard showing wrong content
**Solution**:
1. Log out and log in again
2. Check user.role in browser console: `console.log(user.role)`
3. Verify role stored correctly in localStorage

### Issue: Backend returns 401 Unauthorized
**Solution**:
1. Check token is being sent in Authorization header
2. Verify token hasn't expired (15min access token)
3. Try refreshing token or logging in again

---

## Reporting Issues

When testing, if you find issues, note:
1. **Role**: Which role you were testing
2. **Page**: Which page/URL
3. **Expected**: What should happen
4. **Actual**: What actually happened
5. **Console Errors**: Any errors in browser console (F12)

Example:
```
Role: BUYER
Page: /my-properties
Expected: Redirected to home page
Actual: Page loaded successfully (should be blocked)
Console: No errors
```

---

## Next Steps After Testing

Once all tests pass:
1. ✅ Document any bugs found
2. ✅ Implement fixes
3. ✅ Add more granular permissions (e.g., edit own properties only)
4. ✅ Implement admin panel for user management
5. ✅ Add role-based content filtering in listings
6. ✅ Connect remaining modules (Projects, Contractors, Suppliers)
