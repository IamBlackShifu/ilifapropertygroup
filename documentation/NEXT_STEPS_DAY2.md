# 🗺️ NEXT STEPS ROADMAP - ZimBuildHub

## 📅 Day 2 Plan (Estimated 8-10 hours)

### 🎯 Primary Goals
1. Complete Contractor Management Frontend
2. Implement Verification System (Backend + Frontend)
3. Test end-to-end Property Owner workflow

---

## Session 1: Contractor Management Frontend (3-4 hours)

### 1. Contractor Listing Page (`frontend/src/app/contractors/page.tsx`)
**Estimated Time**: 1.5 hours

**Features to Implement**:
- [ ] Grid layout with contractor cards
- [ ] Display company name, services, rating, location
- [ ] Filter by service category
- [ ] Filter by location
- [ ] Filter by minimum rating
- [ ] Search functionality
- [ ] Pagination
- [ ] Loading states
- [ ] Empty state
- [ ] Click to view contractor profile

**Component Structure**:
```tsx
- Contractor Card
  - Company logo/avatar
  - Company name
  - Services badges
  - Rating stars (with count)
  - Location
  - Years of experience
  - "View Profile" button
```

### 2. Contractor Profile Page (`frontend/src/app/contractors/[id]/page.tsx`)
**Estimated Time**: 1.5 hours

**Features to Implement**:
- [ ] Company information section
- [ ] Services offered display
- [ ] Rating & reviews section
- [ ] Recent projects showcase
- [ ] Contact information
- [ ] Verification badge
- [ ] Review submission form (for buyers)
- [ ] Edit button (for contractor owner)
- [ ] Admin actions (verify, suspend)
- [ ] Statistics cards (projects, rating, reviews)

**Sections**:
```
1. Header (Company name, rating, verified badge)
2. About Section (Description, details)
3. Services Section (List of services)
4. Statistics Cards (Projects, Rating, Reviews)
5. Reviews Section (Paginated reviews)
6. Contact Card (Email, phone, location)
7. Action Buttons (role-based)
```

### 3. Contractor Registration Form (`frontend/src/app/contractors/register/page.tsx`)
**Estimated Time**: 1 hour

**Features to Implement**:
- [ ] Multi-section form
  - [ ] Company Information
  - [ ] Services Selection
  - [ ] Experience & Team Size
  - [ ] Location Details
- [ ] Services selection (checkboxes or multi-select)
- [ ] Form validation
- [ ] Submit to create contractor profile
- [ ] Protected route (CONTRACTOR role only)
- [ ] Success redirect to profile
- [ ] Error handling

### 4. Contractors API Client (`frontend/src/lib/api/contractors.ts`)
**Estimated Time**: 30 minutes

**Functions to Create**:
```typescript
- getContractors(filters) - List with filters
- getContractor(id) - Single contractor
- getMyContractorProfile() - Current user profile
- createContractor(data) - Create profile
- updateContractor(id, data) - Update profile
- deleteContractor(id) - Delete profile
- rateContractor(id, rating) - Submit review
- getContractorReviews(id, page) - Get reviews
- getContractorStats(id) - Get statistics
- verifyContractor(id) - Admin verify
- suspendContractor(id) - Admin suspend
```

---

## Session 2: Verification System Backend (2-3 hours)

### 1. Verifications Service (`backend/src/verifications/verifications.service.ts`)
**Estimated Time**: 1.5 hours

**Methods to Implement**:
- [ ] `create()` - Submit verification request
- [ ] `findAll()` - List all verifications (with filters)
- [ ] `findOne()` - Get verification details
- [ ] `findByEntityId()` - Get verifications for entity
- [ ] `findPending()` - Get pending verifications (Admin)
- [ ] `update()` - Update verification status
- [ ] `approve()` - Approve verification
- [ ] `reject()` - Reject verification with reason
- [ ] `addDocument()` - Add document to verification
- [ ] `removeDocument()` - Remove document
- [ ] `getStats()` - Verification statistics

**Key Features**:
- Link to Property OR Contractor
- Support multiple documents
- Admin review workflow
- Status tracking (PENDING → UNDER_REVIEW → APPROVED/REJECTED)
- Rejection reason handling
- Badge issuance on approval

### 2. Verifications Controller (`backend/src/verifications/verifications.controller.ts`)
**Estimated Time**: 45 minutes

**Endpoints to Create**:
```
POST   /verifications                - Submit verification
GET    /verifications                - List all (Admin)
GET    /verifications/pending        - Get pending (Admin)
GET    /verifications/my-requests    - Get user's verifications
GET    /verifications/:id            - Get single verification
PATCH  /verifications/:id            - Update verification
PATCH  /verifications/:id/review     - Start review (Admin)
PATCH  /verifications/:id/approve    - Approve (Admin)
PATCH  /verifications/:id/reject     - Reject (Admin)
POST   /verifications/:id/documents  - Add document
DELETE /verifications/:id/documents/:docId - Remove document
```

### 3. Verifications DTOs (`backend/src/verifications/dto/`)
**Estimated Time**: 30 minutes

**DTOs to Create**:
- `CreateVerificationDto` - Submit request
- `UpdateVerificationDto` - Update status
- `ReviewVerificationDto` - Admin review
- `RejectVerificationDto` - Rejection with reason
- `FilterVerificationDto` - Search parameters

### 4. Document Upload Integration
**Estimated Time**: 30 minutes

- [ ] Update FilesService to handle documents
- [ ] Create document validation
- [ ] Link documents to verifications
- [ ] Support PDF, images for documents

---

## Session 3: Verification System Frontend (2-3 hours)

### 1. Verification Request Form (`frontend/src/components/verification/VerificationRequestForm.tsx`)
**Estimated Time**: 1 hour

**Features**:
- [ ] Document upload (multiple files)
- [ ] Document type selection
- [ ] Description field
- [ ] Submit button
- [ ] Loading state
- [ ] Success/error feedback

### 2. Verification Status Component (`frontend/src/components/verification/VerificationStatus.tsx`)
**Estimated Time**: 45 minutes

**Features**:
- [ ] Status badge (color-coded)
- [ ] Timeline of status changes
- [ ] Documents list
- [ ] Admin feedback/notes
- [ ] Resubmit option (if rejected)

### 3. Admin Verification Dashboard (`frontend/src/app/admin/verifications/page.tsx`)
**Estimated Time**: 1.5 hours

**Features**:
- [ ] List pending verifications
- [ ] Filter by entity type (Property/Contractor)
- [ ] View verification details
- [ ] Review documents
- [ ] Approve/Reject actions
- [ ] Add admin notes
- [ ] Statistics cards
- [ ] Search functionality

### 4. Verification API Client (`frontend/src/lib/api/verifications.ts`)
**Estimated Time**: 30 minutes

**Functions**:
```typescript
- submitVerification(data) - Submit request
- getMyVerifications() - User's verifications
- getPendingVerifications() - Admin view
- getVerification(id) - Single verification
- reviewVerification(id) - Start review
- approveVerification(id) - Approve
- rejectVerification(id, reason) - Reject
- addDocument(id, file) - Upload document
```

---

## Session 4: Email Notifications (1-2 hours)

### 1. Notifications Service Enhancement
**Estimated Time**: 1 hour

**Notifications to Implement**:
- [ ] Property verification approved
- [ ] Property verification rejected
- [ ] Contractor verification approved
- [ ] Contractor verification rejected
- [ ] New property listing (to admins)
- [ ] New contractor registration (to admins)
- [ ] Property reserved/sold
- [ ] New review received

### 2. Email Templates
**Estimated Time**: 30 minutes

**Templates to Create**:
- Property verification result
- Contractor verification result
- Welcome email
- Admin notification email

### 3. Integration
**Estimated Time**: 30 minutes

- [ ] Trigger emails on verification actions
- [ ] Trigger emails on status changes
- [ ] Configure email service (SendGrid/Mailgun)

---

## 📋 TESTING CHECKLIST FOR DAY 2

### Contractor Management Frontend
- [ ] List contractors with filters
- [ ] View contractor profile
- [ ] Register as contractor
- [ ] Edit contractor profile
- [ ] Rate a contractor
- [ ] View contractor reviews
- [ ] Admin verify contractor
- [ ] Admin suspend contractor

### Verification System
- [ ] Submit property verification
- [ ] Submit contractor verification
- [ ] Upload verification documents
- [ ] View verification status
- [ ] Admin review verification
- [ ] Admin approve verification
- [ ] Admin reject verification
- [ ] Receive email notifications
- [ ] Resubmit rejected verification

---

## 🎯 SUCCESS CRITERIA

### End of Day 2 Goals
1. ✅ Contractor management fully functional (frontend + backend)
2. ✅ Verification system complete (frontend + backend)
3. ✅ Email notifications working
4. ✅ Property Owner can complete full workflow:
   - Register → Create Property → Upload Images → Submit Verification → Get Approved
5. ✅ Contractor can complete full workflow:
   - Register → Create Profile → Upload Documents → Get Verified → Receive Projects
6. ✅ Admin can complete full workflow:
   - Review Pending Verifications → Approve/Reject → Monitor System

---

## 📊 Day 3+ Priorities (User Journeys)

### Property Owner Journey
1. **Registration & Setup**
   - [ ] Register as OWNER
   - [ ] Complete profile
   - [ ] Upload profile picture

2. **Property Management**
   - [ ] Create property listing
   - [ ] Upload property images
   - [ ] Submit for verification
   - [ ] Track verification status
   - [ ] Manage approved properties
   - [ ] View property statistics
   - [ ] Update property details
   - [ ] Mark as reserved/sold

3. **Communication**
   - [ ] Receive buyer inquiries
   - [ ] Respond to messages
   - [ ] Schedule viewings

### Contractor Journey
1. **Registration & Setup**
   - [ ] Register as CONTRACTOR
   - [ ] Create contractor profile
   - [ ] Upload documents
   - [ ] Submit for verification
   - [ ] Track verification status

2. **Project Management**
   - [ ] Browse available projects
   - [ ] Submit project proposals
   - [ ] Accept awarded projects
   - [ ] Update project status
   - [ ] Complete projects
   - [ ] Receive payments

3. **Reputation**
   - [ ] Receive ratings & reviews
   - [ ] Respond to reviews
   - [ ] Build portfolio
   - [ ] Showcase completed projects

### Buyer Journey
1. **Property Search**
   - [ ] Browse properties
   - [ ] Filter & search
   - [ ] Save favorite properties
   - [ ] Compare properties

2. **Engagement**
   - [ ] Contact property owners
   - [ ] Schedule viewings
   - [ ] Submit reservation requests
   - [ ] Rate contractors (after projects)

3. **Project Creation**
   - [ ] Create construction project
   - [ ] Request quotes from contractors
   - [ ] Review proposals
   - [ ] Award projects
   - [ ] Track project progress

### Admin Journey
1. **Verification Management**
   - [ ] Review property verifications
   - [ ] Review contractor verifications
   - [ ] Approve/reject with feedback
   - [ ] Monitor verification queue

2. **User Management**
   - [ ] View all users
   - [ ] Suspend/unsuspend users
   - [ ] Handle disputes
   - [ ] Manage roles

3. **System Monitoring**
   - [ ] View analytics dashboard
   - [ ] Monitor platform activity
   - [ ] Generate reports
   - [ ] Configure system settings

---

## 🚀 DEPLOYMENT CHECKLIST (Future)

### Before Production
- [ ] All modules tested
- [ ] All user journeys completed
- [ ] Security audit completed
- [ ] Performance optimization
- [ ] Error logging configured
- [ ] Backup strategy implemented
- [ ] SSL certificates installed
- [ ] Environment variables configured
- [ ] Database migrations verified
- [ ] Email service configured
- [ ] Payment gateway tested
- [ ] Documentation updated

---

## 📝 NOTES FOR DAY 2

### Prerequisites
1. Backend from Day 1 must be running
2. Database must be properly migrated
3. JWT authentication working
4. File upload directories created

### Dependencies to Install
```bash
# Backend (if needed)
npm install @nestjs/config
npm install multer @types/multer
npm install nodemailer @types/nodemailer

# Frontend (if needed)
npm install react-hook-form zod
npm install @hookform/resolvers
```

### Environment Variables to Add
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@zimbuild hub.com

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

## 💡 TIPS FOR EFFICIENT DEVELOPMENT

1. **Reuse Components**: Image upload component can be reused for contractor logos
2. **Consistent Patterns**: Follow same structure as Property pages
3. **Copy-Paste-Modify**: Use Property Service as template for Verification Service
4. **Test As You Go**: Test each endpoint in Postman before building frontend
5. **Incremental Commits**: Commit after each major feature completion
6. **Use TypeScript**: Let types guide your implementation
7. **Error Handling**: Copy error patterns from existing code
8. **Loading States**: Always show loading spinners during API calls
9. **Role-Based UI**: Show/hide elements based on user role
10. **Responsive Design**: Test mobile view as you build

---

## 🎯 DEFINITION OF DONE

### Feature is Complete When:
- [ ] Backend endpoint working and tested in Postman
- [ ] Frontend component created and integrated
- [ ] API client function added
- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Success feedback shown
- [ ] Role-based access working
- [ ] Responsive on mobile
- [ ] TypeScript types defined
- [ ] No console errors
- [ ] Code documented (comments)
- [ ] Git committed with clear message

---

**Current Status**: Day 1 Complete ✅  
**Next Session**: Day 2 - Contractor Frontend + Verification System  
**Est. Time**: 8-10 hours  
**Goal**: 3 Complete Modules
