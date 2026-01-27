-- Admin Supplier Verification Flow Test Guide

## Prerequisites
1. Backend running on http://localhost:4000
2. Frontend running on http://localhost:3000
3. Admin user created (email: admin@zimbuild.com)
4. 8 suppliers seeded in database (run seed-suppliers.ts if not done)

## Test Flow

### Step 1: Login as Admin
1. Navigate to http://localhost:3000/auth/login
2. Login with admin credentials:
   - Email: admin@zimbuild.com
   - Password: admin123

### Step 2: Access Admin Supplier Management
1. After login, navigate to http://localhost:3000/admin
2. Click on "Suppliers" in the left sidebar
3. You should see the suppliers list page with filters

### Step 3: View Pending Suppliers
1. Set the status filter to "Pending"
2. You should see suppliers with status = PENDING
3. Note: Initially all suppliers should be PENDING unless already verified

### Step 4: View Supplier Details
1. Click "View Details" button on any supplier
2. You should see:
   - Company information (name, location, phone, description)
   - Contact person details
   - Statistics (products count, orders count)
   - Recent products list
   - Action buttons (Verify/Reject based on status)

### Step 5: Verify a Supplier
1. From the supplier details page, click "✓ Verify Supplier" button
2. Confirm the verification in the popup
3. The supplier status should change to "VERIFIED"
4. The verifiedAt timestamp should be set
5. The action buttons should change to show "Suspend" button

### Step 6: Reject a Supplier
1. Go back to suppliers list
2. Find another PENDING supplier
3. Click "View Details"
4. Click "✗ Reject" button
5. Enter a rejection reason in the prompt
6. The supplier status should remain PENDING (or you can modify to set a REJECTED status)

### Step 7: Suspend a Verified Supplier
1. Go back to suppliers list
2. Filter by "Verified" status
3. Find the supplier you just verified
4. Click "Suspend Supplier" button
5. Enter a suspension reason
6. The supplier status should change to "SUSPENDED"

### Step 8: Reactivate a Suspended Supplier
1. Filter by "Suspended" status
2. Click "Reactivate" button
3. The supplier status should change back to "VERIFIED"

### Step 9: Test Search Functionality
1. Enter a company name or location in the search box
2. The list should filter to show matching suppliers

### Step 10: Verify API Endpoints (Optional - Using Postman/curl)

#### Get all suppliers
```bash
curl -X GET "http://localhost:4000/api/admin/suppliers?status=PENDING" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Get supplier by ID
```bash
curl -X GET "http://localhost:4000/api/admin/suppliers/SUPPLIER_ID" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Verify supplier
```bash
curl -X POST "http://localhost:4000/api/admin/suppliers/SUPPLIER_ID/verify" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

#### Reject supplier
```bash
curl -X POST "http://localhost:4000/api/admin/suppliers/SUPPLIER_ID/reject" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rejectionReason": "Invalid business documents"}'
```

## Expected Results

### Database Changes
After verification:
- Supplier.status should be 'VERIFIED'
- Supplier.verifiedAt should have a timestamp

After suspension:
- Supplier.status should be 'SUSPENDED'

### UI Updates
- Status badges should update immediately after actions
- Action buttons should change based on current status
- Filters should work correctly
- Pagination should display if more than 20 suppliers

## What Was Implemented

### Backend (NestJS)
1. **Admin Controller** (`backend/src/admin/admin.controller.ts`):
   - `GET /api/admin/suppliers` - Get all suppliers with filters
   - `GET /api/admin/suppliers/:id` - Get supplier details
   - `POST /api/admin/suppliers/:id/verify` - Verify a supplier
   - `POST /api/admin/suppliers/:id/reject` - Reject a supplier
   - `POST /api/admin/suppliers/:id/suspend` - Suspend a supplier
   - `POST /api/admin/suppliers/:id/activate` - Activate a suspended supplier

2. **Admin Service** (`backend/src/admin/admin.service.ts`):
   - `getAllSuppliers()` - Fetch suppliers with pagination, search, and status filter
   - `getSupplierById()` - Fetch single supplier with related data
   - `verifySupplier()` - Set status to VERIFIED and update verifiedAt
   - `rejectSupplier()` - Handle rejection (currently sets status to PENDING)
   - `suspendSupplier()` - Set status to SUSPENDED
   - `activateSupplier()` - Reactivate to VERIFIED

### Frontend (Next.js)
1. **Admin API Client** (`frontend/src/lib/api/admin.ts`):
   - Added supplier management methods

2. **Suppliers List Page** (`frontend/src/app/admin/suppliers/page.tsx`):
   - Lists all suppliers with filters (status, search)
   - Displays supplier info cards
   - Quick action buttons (Verify, Reject, Suspend, Activate)
   - Pagination support
   - Responsive design

3. **Supplier Details Page** (`frontend/src/app/admin/suppliers/[id]/page.tsx`):
   - Detailed supplier information
   - Contact person details
   - Statistics (products, orders)
   - Recent products list
   - Full verification/management actions

4. **Admin Layout** (`frontend/src/app/admin/layout.tsx`):
   - Added "Suppliers" navigation link

## Troubleshooting

### Issue: "Unauthorized" error
- Make sure you're logged in as ADMIN
- Check JWT token in browser localStorage
- Verify admin guards are correctly applied

### Issue: Empty suppliers list
- Run the seed script: `docker exec zimbuild-backend npm run seed-suppliers`
- Check database connection
- Verify API endpoint is returning data

### Issue: Action buttons not working
- Check browser console for errors
- Verify API endpoints are accessible
- Check network tab for failed requests

## Next Steps (Optional Enhancements)

1. **Email Notifications**: Send emails to suppliers when verified/rejected
2. **Rejection Tracking**: Create a separate table to track rejection history
3. **Audit Log**: Track all admin actions on suppliers
4. **Bulk Actions**: Allow selecting multiple suppliers for bulk verification
5. **Comments/Notes**: Allow admins to add notes to supplier profiles
6. **Document Verification**: Add document upload requirement for verification
7. **Advanced Search**: Add more filter options (date range, location, etc.)
