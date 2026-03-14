# ILifa Property Group — UAT Script

**Application**: ILifa Property Group / ZimBuildHub  
**URL**: https://www.ilifapropertygroup.com  
**Version**: v1.0  
**Date**: March 2026  
**Prepared by**: Development Team

---

## How to Use This Script

- Work through each section in order.
- Mark each test **PASS**, **FAIL**, or **SKIP** (if not applicable to your role).
- If a test fails, note the exact error message or behaviour in the **Notes** column.
- All test users should be created fresh — do not reuse accounts across test runs.
- Complete the **Sign-off** section at the end.

**Status codes**:
| Symbol | Meaning |
|--------|---------|
| ☐ | Not yet tested |
| ✅ | PASS |
| ❌ | FAIL |
| ➖ | SKIP / N/A |

---

## Test Accounts to Create

Before testing, register the following accounts (Section 2 covers the registration flow):

| Role | Suggested Email | Purpose |
|------|----------------|---------|
| Buyer | buyer@uat-test.com | Test buyer flows |
| Property Owner | owner@uat-test.com | Test property listing |
| Agent | agent@uat-test.com | Test agent flows |
| Contractor | contractor@uat-test.com | Test contractor flows |
| Supplier | supplier@uat-test.com | Test supplier flows |
| Admin | admin@ilifapropertygroup.com | Pre-created (use `Admin@123456`) |

---

## Section 1 — Public Pages (No Login Required)

### 1.1 Homepage

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.1.1 | Navigate to `https://www.ilifapropertygroup.com` | Homepage loads without errors, no broken images, no console errors | ☐ | |
| 1.1.2 | Check the navigation bar | Logo, navigation links (Buy, Build, Services, Suppliers, Professionals) and Login/Register buttons are visible | ☐ | |
| 1.1.3 | Click each main navigation link | Each link navigates to the correct page without a 404 | ☐ | |
| 1.1.4 | Resize browser to mobile width (375px) | Navigation collapses to hamburger menu; all links still accessible | ☐ | |

### 1.2 Buy Property Page

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.2.1 | Navigate to `/buy-property` | Property listings page loads | ☐ | |
| 1.2.2 | Browse the property listings | Property cards display image, title, price, and location | ☐ | |
| 1.2.3 | Click on a property card | Property detail page opens with full information | ☐ | |
| 1.2.4 | Verify property detail page fields | Title, price, location, description, property type, and images are displayed | ☐ | |

### 1.3 Suppliers Marketplace

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.3.1 | Navigate to `/suppliers` | Suppliers listing page loads | ☐ | |
| 1.3.2 | Browse supplier cards | Company name, location, and category are shown | ☐ | |

### 1.4 Professionals / Contractors

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.4.1 | Navigate to `/professionals` | Contractors listing page loads | ☐ | |
| 1.4.2 | Browse contractor cards | Name, specialisation, and status badge are shown | ☐ | |

### 1.5 Build a Home Page

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.5.1 | Navigate to `/build-home` | Page loads with build options/content | ☐ | |

### 1.6 Services Page

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 1.6.1 | Navigate to the services section | Page loads without errors | ☐ | |

---

## Section 2 — Authentication

### 2.1 User Registration

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.1.1 | Click "Register" in the navigation bar | Registration page loads | ☐ | |
| 2.1.2 | Submit the form with all fields empty | Validation errors shown for required fields | ☐ | |
| 2.1.3 | Enter a mismatched password and confirm password | Error: "Passwords do not match" (or similar) | ☐ | |
| 2.1.4 | Enter an invalid email format (e.g. `notanemail`) | Email validation error shown | ☐ | |
| 2.1.5 | Register as **Buyer** with valid details (`buyer@uat-test.com`) | Registration succeeds; user is redirected to dashboard or login | ☐ | |
| 2.1.6 | Register as **Property Owner** with valid details (`owner@uat-test.com`) | Registration succeeds | ☐ | |
| 2.1.7 | Register as **Agent** with valid details (`agent@uat-test.com`) | Registration succeeds | ☐ | |
| 2.1.8 | Register as **Contractor** with valid details (`contractor@uat-test.com`) | Registration succeeds | ☐ | |
| 2.1.9 | Register as **Supplier** with valid details (`supplier@uat-test.com`) | Registration succeeds | ☐ | |
| 2.1.10 | Attempt to register with an already-registered email | Error: "Email already in use" (or similar) | ☐ | |

### 2.2 Login

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.2.1 | Navigate to the login page | Login form loads | ☐ | |
| 2.2.2 | Submit with empty fields | Validation errors shown | ☐ | |
| 2.2.3 | Submit with wrong password | Error: "Invalid credentials" (or similar) | ☐ | |
| 2.2.4 | Submit with non-existent email | Error message shown (does not reveal if email exists) | ☐ | |
| 2.2.5 | Log in as **Buyer** | Redirected to buyer dashboard or homepage; name shown in navigation | ☐ | |
| 2.2.6 | Log in as **Property Owner** | Redirected to owner dashboard; My Properties accessible | ☐ | |
| 2.2.7 | Log in as **Contractor** | Redirected to contractor dashboard | ☐ | |
| 2.2.8 | Log in as **Supplier** | Redirected to supplier dashboard | ☐ | |
| 2.2.9 | Log in as **Admin** (`admin@ilifapropertygroup.com` / `Admin@123456`) | Redirected to admin panel at `/admin` | ☐ | |

### 2.3 Logout

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.3.1 | While logged in, click the logout button/menu item | User is logged out; redirected to homepage or login | ☐ | |
| 2.3.2 | After logout, navigate to `/dashboard` or `/my-properties` | Redirected to login page (not shown protected content) | ☐ | |

### 2.4 Role-Based Access Control

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 2.4.1 | Log in as **Buyer**, navigate to `/my-properties` | Access denied or redirected (Buyers cannot list properties) | ☐ | |
| 2.4.2 | Log in as **Buyer**, navigate to `/admin` | Access denied or redirected | ☐ | |
| 2.4.3 | Log in as **Contractor**, navigate to `/admin` | Access denied or redirected | ☐ | |
| 2.4.4 | Log in as **Supplier**, navigate to `/contractors/dashboard` | Access denied or redirected | ☐ | |

---

## Section 3 — Property Owner / Agent Flows

> **Login as**: `owner@uat-test.com` (role: Property Owner) or `agent@uat-test.com` (role: Agent)

### 3.1 View My Properties

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.1.1 | Navigate to `/my-properties` | My Properties page loads; empty state shown if no properties yet | ☐ | |

### 3.2 Create a New Property

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.2.1 | Click "+ Add New Property" | Property creation form loads at `/my-properties/new` | ☐ | |
| 3.2.2 | Submit the form without filling required fields | Validation errors shown for Title, Type, Price, City, Description | ☐ | |
| 3.2.3 | Fill all required fields: Title "UAT Test House", Type "HOUSE", Price "150000", City "Harare", Description "UAT test description" | Form accepts values | ☐ | |
| 3.2.4 | Add optional fields: Bedrooms "3", Bathrooms "2", Land Size "450" | Form accepts values | ☐ | |
| 3.2.5 | Add features: "Pool, Garden, Garage" | Features accepted | ☐ | |
| 3.2.6 | Submit the form ("List Property") | Success message shown; property appears in My Properties list with status **DRAFT** | ☐ | |
| 3.2.7 | Verify the property appears on the public `/buy-property` page (as DRAFT it may not — note the behaviour) | Note whether DRAFT properties are shown publicly | ☐ | |

### 3.3 Edit a Property

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.3.1 | From My Properties, click "Edit" on the property just created | Edit form loads pre-filled with existing data | ☐ | |
| 3.3.2 | Change the Title to "UAT Test House — Edited" and click "Update Property" | Success message; updated title shown in My Properties list | ☐ | |
| 3.3.3 | Change the Price and save | Price updated correctly | ☐ | |

### 3.4 Delete a Property

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.4.1 | From My Properties, click "Delete" on a property | Confirmation modal appears | ☐ | |
| 3.4.2 | Cancel the deletion | Modal closes; property still exists | ☐ | |
| 3.4.3 | Click "Delete" again and confirm | Property is removed from the list | ☐ | |

### 3.5 Property Verification Submission

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.5.1 | Navigate to `/verify` | Verification page loads | ☐ | |
| 3.5.2 | Attempt to submit property for verification | Form or instructions for document submission are shown | ☐ | |

### 3.6 Saved Properties (as Buyer)

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.6.1 | Log in as **Buyer**, browse to a property detail page | "Save" or bookmark button is visible | ☐ | |
| 3.6.2 | Click "Save" | Property saved; button state changes | ☐ | |
| 3.6.3 | Navigate to `/saved-properties` | Saved property appears in the list | ☐ | |

### 3.7 Property Viewings

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 3.7.1 | As **Buyer**, visit a property detail page | Viewing request option is visible | ☐ | |
| 3.7.2 | Submit a viewing request | Confirmation shown | ☐ | |
| 3.7.3 | Navigate to `/my-viewings` | Submitted viewing appears | ☐ | |

---

## Section 4 — Contractor Flows

> **Login as**: `contractor@uat-test.com` (role: Contractor)

### 4.1 Contractor Dashboard

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 4.1.1 | Navigate to `/contractors/dashboard` | Dashboard loads with contractor-specific stats | ☐ | |

### 4.2 Contractor Profile

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 4.2.1 | Navigate to `/contractors/profile` | Profile page loads | ☐ | |
| 4.2.2 | Navigate to create/edit profile | Profile form loads with fields: company name, specialisations, service areas, experience | ☐ | |
| 4.2.3 | Fill in profile details and save | Profile saved successfully | ☐ | |

### 4.3 Service Requests

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 4.3.1 | Navigate to `/contractors/service-requests` | List of incoming service requests is shown | ☐ | |
| 4.3.2 | Click on a service request to view details | Full details shown with options to respond | ☐ | |

### 4.4 Service Request — Buyer Perspective

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 4.4.1 | Log in as **Buyer**, navigate to `/services/request` | Service request form loads | ☐ | |
| 4.4.2 | Submit a service request | Success confirmation shown | ☐ | |
| 4.4.3 | Navigate to `/services/my-requests` | Submitted request appears in the list | ☐ | |

### 4.5 Contractor Verification

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 4.5.1 | Navigate to `/verify` as contractor | Verification/document upload option available | ☐ | |
| 4.5.2 | Submit verification request | Status shows as PENDING | ☐ | |

---

## Section 5 — Supplier Flows

> **Login as**: `supplier@uat-test.com` (role: Supplier)

### 5.1 Supplier Dashboard

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.1.1 | Navigate to `/suppliers/dashboard` | Dashboard loads with order stats, product count | ☐ | |

### 5.2 Supplier Profile

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.2.1 | Navigate to `/suppliers/profile` | Profile form loads | ☐ | |
| 5.2.2 | Fill in company name, address, categories, and save | Profile saved; shown on public supplier listing | ☐ | |

### 5.3 Products — Create

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.3.1 | Navigate to `/suppliers/products` | Products list loads (empty if new) | ☐ | |
| 5.3.2 | Click "Add Product" | Product creation form loads | ☐ | |
| 5.3.3 | Submit form with empty required fields | Validation errors shown | ☐ | |
| 5.3.4 | Fill in: Name "Cement 50kg Bag", Category, Unit Price "12.50", Stock "500", Unit "bags" | Form accepts values | ☐ | |
| 5.3.5 | Submit the form | Product created and appears in product list | ☐ | |

### 5.4 Products — Edit

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.4.1 | Click "Edit" on a product | Edit form loads pre-filled | ☐ | |
| 5.4.2 | Update the price and save | Updated price shown in product list | ☐ | |

### 5.5 Products — Delete

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.5.1 | Click "Delete" on a product | Confirmation prompt shown | ☐ | |
| 5.5.2 | Confirm deletion | Product removed from list | ☐ | |

### 5.6 Supplier Marketplace — Public View

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 5.6.1 | Log out, then navigate to `/suppliers` | Supplier is listed publicly if verified | ☐ | |
| 5.6.2 | Search/filter suppliers by category or city | List filters correctly | ☐ | |

---

## Section 6 — User Profile & Settings

> Test with any logged-in role.

### 6.1 User Profile

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 6.1.1 | Navigate to `/profile` | Profile page loads showing current user's details | ☐ | |
| 6.1.2 | Update first name, last name, and phone number | Changes saved; reflected in navigation and profile | ☐ | |
| 6.1.3 | Upload a profile photo | Photo uploads and is displayed | ☐ | |

### 6.2 Account Settings

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 6.2.1 | Navigate to `/settings` | Settings page loads | ☐ | |
| 6.2.2 | Attempt to change password with wrong current password | Error shown | ☐ | |
| 6.2.3 | Change password with correct current password and matching new passwords | Success message; old password no longer works | ☐ | |

---

## Section 7 — Notifications

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 7.1 | Trigger an action that generates a notification (e.g. property created, order placed) | Notification badge appears in header | ☐ | |
| 7.2 | Click the notification bell/icon | Notification list opens showing recent notifications | ☐ | |
| 7.3 | Mark a notification as read | Notification is marked read; badge count decreases | ☐ | |

---

## Section 8 — Admin Panel

> **Login as**: `admin@ilifapropertygroup.com` / `Admin@123456`  
> Access the admin panel at `/admin`

### 8.1 Admin Dashboard

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.1.1 | Navigate to `/admin` | Admin dashboard loads with platform statistics (total users, properties, orders, revenue) | ☐ | |
| 8.1.2 | Verify stat cards: Total Users, Properties, Suppliers, Contractors | All figures shown (zeros are acceptable for a fresh install) | ☐ | |

### 8.2 User Management

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.2.1 | Navigate to `/admin/users` | List of all registered users shown | ☐ | |
| 8.2.2 | All UAT test accounts from Section 2 appear in the list | All 5 test users (Buyer, Owner, Agent, Contractor, Supplier) are listed | ☐ | |
| 8.2.3 | Filter users by role (e.g. CONTRACTOR) | Only contractors shown | ☐ | |
| 8.2.4 | Search for a user by name or email | Matching user shown | ☐ | |
| 8.2.5 | Click on a user to view their details | User detail panel or page opens | ☐ | |
| 8.2.6 | Suspend a user (e.g. the buyer test account) | User account suspended; status changes | ☐ | |
| 8.2.7 | Log in as the suspended user | Login rejected with "account suspended" message | ☐ | |
| 8.2.8 | In admin panel, reactivate the suspended user | User status set back to active | ☐ | |
| 8.2.9 | Log in as the reactivated user | Login succeeds | ☐ | |

### 8.3 Property Management

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.3.1 | Navigate to `/admin/properties` | All properties from all owners listed | ☐ | |
| 8.3.2 | Filter by status (DRAFT, PENDING_VERIFICATION, VERIFIED) | Properties filtered correctly | ☐ | |
| 8.3.3 | Click "Approve" on a PENDING_VERIFICATION property | Property status changes to VERIFIED | ☐ | |
| 8.3.4 | Click "Reject" and provide a reason | Property status changes; rejection reason recorded | ☐ | |
| 8.3.5 | Delete a property from admin panel | Property permanently removed | ☐ | |

### 8.4 Verification Management

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.4.1 | Navigate to `/admin/verifications` | Pending verification requests (property, contractor, supplier) listed | ☐ | |
| 8.4.2 | Click on a verification request | Submitted documents and details are shown | ☐ | |
| 8.4.3 | Approve a verification request | Status changes to APPROVED; entity marked as verified | ☐ | |
| 8.4.4 | Reject a verification with a reason | Status changes to REJECTED; reason recorded | ☐ | |

### 8.5 Contractor Management

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.5.1 | Navigate to `/admin/contractors` | All contractor accounts listed with status badges | ☐ | |
| 8.5.2 | Click "Verify" on a PENDING contractor | Contractor status changes to VERIFIED | ☐ | |
| 8.5.3 | Suspend a contractor | Status changes to SUSPENDED | ☐ | |
| 8.5.4 | Reactivate the contractor | Status changes back to VERIFIED | ☐ | |

### 8.6 Supplier Management

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.6.1 | Navigate to `/admin/suppliers` | All supplier accounts listed | ☐ | |
| 8.6.2 | Click "Verify" on a PENDING supplier | Supplier status changes to VERIFIED | ☐ | |
| 8.6.3 | Suspend a supplier | Status changes to SUSPENDED | ☐ | |
| 8.6.4 | Reactivate the supplier | Status changes to active/VERIFIED | ☐ | |

### 8.7 Subscriptions & Payments (Admin View)

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.7.1 | Navigate to `/admin/subscriptions` | Subscription list shown (may be empty) | ☐ | |
| 8.7.2 | View subscription statistics | Stats card shows plan breakdown | ☐ | |
| 8.7.3 | Navigate to payments section | Payment transaction list shown | ☐ | |

### 8.8 Analytics

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 8.8.1 | Access platform analytics from admin dashboard | Analytics page/charts load | ☐ | |
| 8.8.2 | View user growth chart | Chart renders with available data (may be flat on a new instance) | ☐ | |
| 8.8.3 | View revenue analytics | Revenue chart loads | ☐ | |
| 8.8.4 | View property market analytics | Property stats shown | ☐ | |
| 8.8.5 | View supplier performance analytics | Supplier stats shown | ☐ | |
| 8.8.6 | View contractor performance analytics | Contractor stats shown | ☐ | |

---

## Section 9 — Dashboard (Per-Role)

### 9.1 General Dashboard

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 9.1.1 | Log in as **Owner**, navigate to `/dashboard` | Dashboard shows: Listed Properties count, Verified Properties count, Total Views | ☐ | |
| 9.1.2 | Log in as **Contractor**, navigate to `/dashboard` | Dashboard shows: Completed Projects, Active Requests, Verified badge status | ☐ | |
| 9.1.3 | Log in as **Supplier**, navigate to `/dashboard` | Dashboard shows: Products count, Order stats | ☐ | |
| 9.1.4 | Log in as **Buyer**, navigate to `/dashboard` | Dashboard shows: Saved Properties, Viewings, Service Requests | ☐ | |

---

## Section 10 — File Uploads

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 10.1 | Upload a property image during property creation | Image uploads and is shown on the property | ☐ | |
| 10.2 | Upload a profile photo in `/profile` | Photo uploaded and displayed | ☐ | |
| 10.3 | Upload a product image in supplier product form | Image shown on product | ☐ | |
| 10.4 | Attempt to upload a file larger than 10MB | Error: file too large | ☐ | |
| 10.5 | Attempt to upload a non-image file (e.g. `.exe`) | Upload rejected with an appropriate error | ☐ | |

---

## Section 11 — Error Handling & Edge Cases

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 11.1 | Navigate to a non-existent URL (e.g. `/xyz123`) | 404 page shown (not a blank page or crash) | ☐ | |
| 11.2 | Log out and try to access `/admin` directly via URL | Redirected to login (not an error page) | ☐ | |
| 11.3 | Try to access another user's property edit page by typing the URL manually | Access denied (403) or redirect | ☐ | |
| 11.4 | Submit a form with a script injection in a text field (e.g. `<script>alert(1)</script>`) | Input sanitised; no alert executes | ☐ | |
| 11.5 | API health check: navigate to `/api/docs` | Swagger documentation page loads | ☐ | |

---

## Section 12 — Performance & Cross-Browser

| # | Test Step | Expected Result | Status | Notes |
|---|-----------|----------------|--------|-------|
| 12.1 | Load homepage on Chrome | Loads in under 5 seconds | ☐ | |
| 12.2 | Load homepage on Firefox | Loads correctly, no broken layout | ☐ | |
| 12.3 | Load homepage on Safari / Edge | Loads correctly | ☐ | |
| 12.4 | Load homepage on a mobile device (or DevTools mobile emulation) | Responsive layout; no horizontal scroll | ☐ | |
| 12.5 | Run Lighthouse audit (Chrome DevTools → Lighthouse) on homepage | Performance score ≥ 60, no critical accessibility errors | ☐ | |

---

## Defect Log

Use this table to record any issues found during testing:

| # | Section | Test ID | Description | Severity | Status |
|---|---------|---------|-------------|----------|--------|
| 1 | | | | Critical / High / Medium / Low | Open / Fixed |
| 2 | | | | | |
| 3 | | | | | |

**Severity definitions**:
- **Critical** — Application crashes or core feature completely broken; blocks further testing
- **High** — Important feature not working correctly; workaround not possible
- **Medium** — Feature partially working; workaround available
- **Low** — Minor cosmetic or UX issue

---

## Sign-off

| Role | Tester Name | Date | Outcome |
|------|------------|------|---------|
| Property Owner Tester | | | Pass / Fail / Conditional Pass |
| Buyer Tester | | | |
| Contractor Tester | | | |
| Supplier Tester | | | |
| Admin Tester | | | |
| **Overall UAT Sign-off** | | | **APPROVED / NOT APPROVED** |

**Conditions for Approval**:
- All **Critical** and **High** defects resolved.
- No more than 3 open **Medium** defects.
- All Section 2 (Authentication) and Section 8 (Admin) tests passed.

---

*ILifa Property Group UAT Script — v1.0 — March 2026*
