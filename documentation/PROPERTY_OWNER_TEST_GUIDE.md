# Quick Test Guide: Property Owner Submissions

## ✅ What's Now Working

Property Owners and Agents can now:
1. **Create new properties** - Full form with all fields
2. **Edit existing properties** - Update any property details
3. **Delete properties** - With confirmation modal
4. **View all their properties** - In organized grid

---

## 🧪 How to Test

### Step 1: Register as Property Owner
1. Go to http://localhost:3000/auth/register
2. Fill in:
   - Name: John Owner
   - Email: owner@test.com
   - Password: Test123!
   - **Role: Property Owner / Seller** ✅
   - Phone: +263712345678
3. Click "Create Account"

### Step 2: Navigate to My Properties
1. After login, click your name in header
2. Click "Dashboard" or go directly to `/my-properties`
3. You should see empty state: "No properties yet"

### Step 3: Create Your First Property
1. Click **"+ Add New Property"** button (top right)
2. Fill in the form:

   **Basic Information**:
   - Title: `Beautiful 3 Bedroom House in Borrowdale`
   - Type: `House`
   - Description: `Spacious family home with modern finishes`
   - Price: `150000`

   **Location**:
   - City: `Harare`
   - Area: `Borrowdale`
   - Address: `123 Main Road` (optional)

   **Property Details**:
   - Land Size: `500` sqm
   - Bedrooms: `3`
   - Bathrooms: `2`

   **Additional**:
   - Features: `Pool, Garden, Garage, Security` (comma-separated)
   - Images: Leave blank or add image URLs (optional)

3. Click **"List Property"**
4. ✅ You should be redirected to `/my-properties`
5. ✅ Your property should appear in the grid

### Step 4: Edit Property
1. On your property card, click **"Edit"** button
2. Update any field (e.g., change price to `160000`)
3. Click **"Update Property"**
4. ✅ Changes should be saved
5. ✅ You're redirected back to `/my-properties`

### Step 5: View Property Details
1. Click **"View"** button on your property card
2. ✅ Should open property details page
3. You'll see full property information

### Step 6: Delete Property
1. Back on `/my-properties`, click **"Delete"** button
2. ✅ Confirmation modal appears
3. Click **"Delete"** to confirm
4. ✅ Property is removed from list

### Step 7: Check Dashboard
1. Go to `/dashboard`
2. ✅ Should see **Owner Dashboard** with:
   - My Properties: 1 (or 0 if deleted)
   - Total Value: $150,000 (or updated amount)
   - Quick action: "List Property" button
3. ✅ Recent properties list shows your properties

---

## 🎯 Expected Behavior

### ✅ What Works
- [x] Create property with all fields
- [x] Form validation (required fields highlighted)
- [x] Edit existing properties
- [x] Delete with confirmation
- [x] View all my properties
- [x] Status badges (DRAFT, PENDING_VERIFICATION, VERIFIED, SOLD)
- [x] View count displayed
- [x] Dashboard shows property count and total value
- [x] Role-based access (OWNER, AGENT, ADMIN only)

### ❌ What to Expect (Not Yet Implemented)
- [ ] Image upload (currently need to provide URLs)
- [ ] Submit for verification workflow
- [ ] Document upload
- [ ] Property status change to VERIFIED
- [ ] Property analytics (views over time)

---

## 🔍 Testing as Different Roles

### As AGENT (Same as OWNER)
1. Register with role: **Real Estate Agent**
2. Same full access to property management
3. Can create properties for clients
4. Dashboard shows "Listed Properties" instead of "My Properties"

### As BUYER (Should be Blocked)
1. Register with role: **Property Buyer / Home Builder**
2. Try to access http://localhost:3000/my-properties
3. ✅ Should be redirected to home page
4. ✅ "My Properties" link not visible in navigation

### As CONTRACTOR (Should be Blocked)
1. Register with role: **Contractor / Builder**
2. Try to access `/my-properties`
3. ✅ Should be redirected
4. ✅ Navigation doesn't show "My Properties"

### As SUPPLIER (Should be Blocked)
1. Register with role: **Supplier / Vendor**
2. Try to access `/my-properties`
3. ✅ Should be redirected

---

## 🐛 Troubleshooting

### Issue: "Add New Property" button not visible
**Solution**: Make sure you're logged in as OWNER, AGENT, or ADMIN

### Issue: Form submission fails
**Possible causes**:
1. Backend not running - check `docker ps`
2. Not authenticated - log out and log in again
3. Missing required fields - check form validation

**Debug**:
```bash
# Check backend logs
docker logs zimbuild-backend

# Check if backend is healthy
curl http://localhost:4000/api/properties
```

### Issue: Property not appearing after creation
**Solution**: 
1. Check browser console for errors (F12)
2. Refresh the page
3. Check if backend saved it: Go to `/buy-property` and search

### Issue: Can't edit property
**Possible cause**: You don't own the property
**Solution**: Only property owner (or admin) can edit

---

## 📋 API Endpoints Being Used

### Create Property
```
POST http://localhost:4000/api/properties
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "title": "Property Title",
  "description": "Description",
  "propertyType": "HOUSE",
  "price": 150000,
  "locationCity": "Harare",
  "bedrooms": 3,
  "bathrooms": 2,
  ...
}
```

### Get My Properties
```
GET http://localhost:4000/api/properties/my-properties
Authorization: Bearer <access_token>
```

### Update Property
```
PATCH http://localhost:4000/api/properties/:id
Authorization: Bearer <access_token>
Content-Type: application/json

Body: (same as create)
```

### Delete Property
```
DELETE http://localhost:4000/api/properties/:id
Authorization: Bearer <access_token>
```

---

## ✅ Success Checklist

After testing, you should have:
- [x] Successfully created at least one property
- [x] Edited a property and seen changes saved
- [x] Deleted a property with confirmation
- [x] Viewed properties in grid layout
- [x] Seen property count in dashboard
- [x] Verified BUYER role cannot access property management
- [x] Navigation updates based on user role

---

## 🚀 What's Next?

Now that property management is complete, next priorities are:

1. **Property Inquiries** - Let buyers contact owners
2. **Verification System** - Submit properties for approval
3. **Contractor Portfolio** - Let contractors showcase work
4. **Supplier Products** - Let suppliers list materials
5. **Admin Review System** - Let admins approve verifications

See [SUBMISSION_FEATURES_BY_ROLE.md](./SUBMISSION_FEATURES_BY_ROLE.md) for full roadmap.

---

**Test Status**: ✅ READY FOR TESTING  
**Last Updated**: January 13, 2026
