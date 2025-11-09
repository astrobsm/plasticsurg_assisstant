# Authentication System Testing Checklist

## Test Environment
- **App URL:** http://localhost:5174/
- **Test Date:** November 8, 2025
- **Browser:** Any modern browser (Chrome, Edge, Firefox)

---

## Test Suite 1: Admin Account Initialization ✅

### Test 1.1: Verify Admin Account Auto-Creation
**Objective:** Confirm default admin account is created on first load

**Steps:**
1. ✅ App is running on http://localhost:5174/
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for message: `"Default admin account created"`
5. Go to Application tab → IndexedDB → PSA_Clinical_DB → approved_users
6. Verify admin user exists with:
   - email: `blakvelvet@bonnesante.com`
   - password: `natiss4natiss`
   - role: `super_admin`
   - is_active: `true`

**Expected Result:** ✅ Admin account created automatically

**Status:** [ ] PASS / [ ] FAIL

**Notes:**
_______________________________________

---

## Test Suite 2: User Registration Flow 📝

### Test 2.1: Access Registration Form
**Objective:** Verify registration form is accessible

**Steps:**
1. Navigate to login page
2. Locate "Create New Profile" button
3. Click the button
4. Verify registration modal opens

**Expected Result:** ✅ Modal displays with all required fields

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2.2: Form Validation - Empty Fields
**Objective:** Test required field validation

**Steps:**
1. Open registration form
2. Leave all fields empty
3. Click "Submit Registration"

**Expected Result:** ✅ Browser shows validation errors for required fields

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2.3: Form Validation - Password Mismatch
**Objective:** Test password confirmation validation

**Steps:**
1. Fill registration form:
   - Name: Test User 1
   - Email: testuser1@example.com
   - Password: test123
   - Confirm Password: test456 (different)
   - Role: House Officer
2. Submit form

**Expected Result:** ✅ Error message: "Passwords do not match"

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2.4: Form Validation - Short Password
**Objective:** Test minimum password length

**Steps:**
1. Fill registration form:
   - Name: Test User 2
   - Email: testuser2@example.com
   - Password: 12345 (5 characters)
   - Confirm Password: 12345
   - Role: House Officer
2. Submit form

**Expected Result:** ✅ Error message: "Password must be at least 6 characters"

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2.5: Successful Registration - House Officer
**Objective:** Test successful registration request submission

**Steps:**
1. Fill registration form completely:
   - Name: Dr. Jane Doe
   - Email: jane.doe@hospital.com
   - Password: test1234
   - Confirm Password: test1234
   - Role: House Officer
   - Phone: +234 800 123 4567
   - Department: Surgery
   - Registration Number: MDCN/HO/12345
2. Submit form
3. Wait for confirmation

**Expected Result:** ✅ Success alert: "Registration request submitted successfully! Your account will be activated once approved by the administrator."

**Status:** [ ] PASS / [ ] FAIL

**Notes:**
_______________________________________

---

### Test 2.6: Duplicate Email Prevention
**Objective:** Test email uniqueness validation

**Steps:**
1. Try to register again with same email (jane.doe@hospital.com)
2. Fill form with different name but same email
3. Submit form

**Expected Result:** ✅ Error message: "A registration request with this email is already pending approval."

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2.7: Register Multiple Users
**Objective:** Create test users for different roles

**Create these test accounts:**

**Test User 2 - Junior Registrar:**
- Name: Dr. John Smith
- Email: john.smith@hospital.com
- Password: test1234
- Role: Junior Registrar
- Department: Plastic Surgery

**Test User 3 - Medical Officer:**
- Name: Dr. Sarah Williams
- Email: sarah.williams@hospital.com
- Password: test1234
- Role: Medical Officer
- Department: General Surgery

**Test User 4 - Consultant:**
- Name: Dr. Michael Brown
- Email: michael.brown@hospital.com
- Password: test1234
- Role: Consultant
- Department: Plastic Surgery

**Expected Result:** ✅ All 4 registration requests created (total 4 pending)

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 3: Login Attempts (Before Approval) 🚫

### Test 3.1: Login with Pending Account
**Objective:** Verify users cannot login before approval

**Steps:**
1. Logout if logged in
2. Try to login with:
   - Email: jane.doe@hospital.com
   - Password: test1234
3. Submit login form

**Expected Result:** ✅ Error message: "Invalid email or password" (user not in approved_users table)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 3.2: Login with Invalid Credentials
**Objective:** Test authentication security

**Steps:**
1. Try to login with:
   - Email: nonexistent@email.com
   - Password: wrongpassword
2. Submit login form

**Expected Result:** ✅ Error message: "Invalid email or password"

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 4: Admin Login & User Management 👨‍💼

### Test 4.1: Admin Login
**Objective:** Verify admin account works

**Steps:**
1. Go to login page
2. Enter credentials:
   - Email: blakvelvet@bonnesante.com
   - Password: natiss4natiss
3. Click "Sign in"

**Expected Result:** ✅ Successfully logged in, redirected to dashboard

**Status:** [ ] PASS / [ ] FAIL

**Notes:**
_______________________________________

---

### Test 4.2: Access User Management (Method 1)
**Objective:** Find user management interface

**Steps:**
1. While logged in as admin
2. Look for "Admin" or "User Management" in navigation
3. Navigate to user management section

**Expected Result:** ✅ Can access user approval interface

**Status:** [ ] PASS / [ ] FAIL

**Alternative:** If UserApprovalManager component isn't added to Admin page yet, you can test via browser console (see Suite 7)

---

### Test 4.3: View Pending Requests
**Objective:** Verify pending users are displayed

**Steps:**
1. In User Management interface
2. Go to "Pending Approvals" tab
3. Count pending requests

**Expected Result:** ✅ Shows 4 pending registration requests

**Status:** [ ] PASS / [ ] FAIL

**Pending Users:**
- [ ] jane.doe@hospital.com (House Officer)
- [ ] john.smith@hospital.com (Junior Registrar)
- [ ] sarah.williams@hospital.com (Medical Officer)
- [ ] michael.brown@hospital.com (Consultant)

---

### Test 4.4: View User Details
**Objective:** Test user details modal

**Steps:**
1. Click on "View Details" icon (📄) for jane.doe@hospital.com
2. Verify all information is displayed

**Expected Result:** ✅ Modal shows complete user information

**Status:** [ ] PASS / [ ] FAIL

---

### Test 4.5: Approve User - House Officer
**Objective:** Test approval workflow

**Steps:**
1. Find jane.doe@hospital.com in pending list
2. Click green checkmark (✓) button
3. Confirm approval in popup
4. Wait for success message

**Expected Result:** 
✅ Success message: "User approved successfully!"
✅ User moves from pending_users to approved_users table
✅ User disappears from pending list

**Status:** [ ] PASS / [ ] FAIL

**Verification Steps:**
1. Check IndexedDB → approved_users → verify jane.doe@hospital.com exists
2. Check privileges array includes: ['view_assigned', 'create_notes', 'request_labs', 'assist_procedures']
3. Check is_active = true

---

### Test 4.6: Reject User - Junior Registrar
**Objective:** Test rejection workflow

**Steps:**
1. Find john.smith@hospital.com in pending list
2. Click red X button (✗)
3. Enter rejection reason: "Incomplete documentation"
4. Submit

**Expected Result:** 
✅ Success message: "Registration rejected."
✅ User status updated to 'rejected' in pending_users table

**Status:** [ ] PASS / [ ] FAIL

**Verification:**
1. Check IndexedDB → pending_users → john.smith@hospital.com
2. Verify status = 'rejected'
3. Verify rejection_reason = "Incomplete documentation"

---

### Test 4.7: Approve Multiple Users
**Objective:** Approve remaining test users

**Approve these users:**
1. sarah.williams@hospital.com (Medical Officer)
2. michael.brown@hospital.com (Consultant)

**Expected Result:** ✅ Both users approved and activated

**Status:** [ ] PASS / [ ] FAIL

---

### Test 4.8: View Approved Users List
**Objective:** Verify approved users tab

**Steps:**
1. Click "All Users" tab
2. Count total approved users

**Expected Result:** 
✅ Shows 4 approved users:
- [ ] blakvelvet@bonnesante.com (Super Admin)
- [ ] jane.doe@hospital.com (House Officer)
- [ ] sarah.williams@hospital.com (Medical Officer)
- [ ] michael.brown@hospital.com (Consultant)

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 5: User Login After Approval ✅

### Test 5.1: Login as House Officer
**Objective:** Verify approved user can login

**Steps:**
1. Logout from admin account
2. Login with:
   - Email: jane.doe@hospital.com
   - Password: test1234
3. Submit

**Expected Result:** 
✅ Login successful
✅ Redirected to dashboard
✅ User name displays correctly
✅ Role-appropriate menu items visible

**Status:** [ ] PASS / [ ] FAIL

---

### Test 5.2: Verify Role-Based Privileges - House Officer
**Objective:** Confirm privilege restrictions

**Steps:**
1. While logged in as House Officer
2. Try to access admin-only features
3. Check navigation menu

**Expected Result:** 
✅ Cannot access admin functions
✅ Cannot access user management
✅ Cannot access topic management
✅ Limited to assigned patient views

**Status:** [ ] PASS / [ ] FAIL

---

### Test 5.3: Check Last Login Timestamp
**Objective:** Verify login tracking

**Steps:**
1. Check IndexedDB → approved_users → jane.doe@hospital.com
2. Look at last_login field

**Expected Result:** ✅ last_login shows current timestamp

**Status:** [ ] PASS / [ ] FAIL

---

### Test 5.4: Login as Medical Officer
**Objective:** Test Medical Officer role

**Steps:**
1. Logout
2. Login as sarah.williams@hospital.com / test1234

**Expected Result:** 
✅ Login successful
✅ Different privileges than House Officer
✅ Can prescribe medications (House Officer cannot)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 5.5: Login as Consultant
**Objective:** Test Consultant admin-level access

**Steps:**
1. Logout
2. Login as michael.brown@hospital.com / test1234
3. Try to access user management

**Expected Result:** 
✅ Login successful
✅ Has admin-level privileges
✅ Can access user management
✅ Can approve registration requests
✅ Can manage educational content

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 6: User Account Management 🔧

### Test 6.1: Deactivate User Account
**Objective:** Test account deactivation

**Steps:**
1. Login as admin
2. Go to User Management → All Users tab
3. Find jane.doe@hospital.com
4. Click deactivate button (red ✗)
5. Confirm action

**Expected Result:** 
✅ Success message
✅ User status shows "Inactive"
✅ is_active = false in database

**Status:** [ ] PASS / [ ] FAIL

---

### Test 6.2: Login with Deactivated Account
**Objective:** Verify deactivated users cannot login

**Steps:**
1. Logout
2. Try to login as jane.doe@hospital.com / test1234

**Expected Result:** ✅ Error: "Your account has been deactivated. Please contact the administrator."

**Status:** [ ] PASS / [ ] FAIL

---

### Test 6.3: Reactivate User Account
**Objective:** Test account reactivation

**Steps:**
1. Login as admin
2. Go to User Management → All Users
3. Find jane.doe@hospital.com (Inactive)
4. Click activate button (green ✓)
5. Confirm

**Expected Result:** 
✅ User status shows "Active"
✅ is_active = true

**Status:** [ ] PASS / [ ] FAIL

---

### Test 6.4: Login with Reactivated Account
**Objective:** Verify reactivated user can login

**Steps:**
1. Logout
2. Login as jane.doe@hospital.com / test1234

**Expected Result:** ✅ Login successful

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 7: Browser DevTools Testing 🛠️

### Test 7.1: Inspect Database Tables
**Objective:** Verify database structure

**Steps:**
1. Open DevTools (F12) → Application tab
2. Navigate to IndexedDB → PSA_Clinical_DB
3. Check tables exist:
   - [ ] pending_users
   - [ ] approved_users

**Expected Result:** ✅ Both tables present with correct schema

**Status:** [ ] PASS / [ ] FAIL

---

### Test 7.2: Console API Testing (If UI not ready)
**Alternative method to test approval/rejection**

**Open Browser Console and run:**

```javascript
// Import service
import { userManagementService } from '/src/services/userManagementService';

// Get pending requests
const pending = await userManagementService.getPendingRequests();
console.log('Pending users:', pending);

// Approve user (use actual ID from pending list)
await userManagementService.approveRegistration(1);
console.log('User 1 approved!');

// Reject user (use actual ID)
await userManagementService.rejectRegistration(2, 'Test rejection');
console.log('User 2 rejected!');

// Get all approved users
const approved = await userManagementService.getAllApprovedUsers();
console.log('Approved users:', approved);
```

---

## Test Suite 8: Session Persistence 💾

### Test 8.1: Session Persists on Reload
**Objective:** Verify session survives page reload

**Steps:**
1. Login as any user
2. Reload page (F5)
3. Check if still logged in

**Expected Result:** ✅ User remains logged in after reload

**Status:** [ ] PASS / [ ] FAIL

---

### Test 8.2: Session Survives Browser Close
**Objective:** Test localStorage persistence

**Steps:**
1. Login as any user
2. Close browser completely
3. Reopen browser
4. Navigate to http://localhost:5174/

**Expected Result:** ✅ User still logged in (session restored from localStorage)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 8.3: Logout Clears Session
**Objective:** Verify logout functionality

**Steps:**
1. Login as any user
2. Click logout
3. Check localStorage
4. Try to access protected routes

**Expected Result:** 
✅ Redirected to login page
✅ localStorage cleared
✅ Cannot access protected routes

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 9: Error Handling 🚨

### Test 9.1: Invalid Password Format
**Objective:** Test password validation

**Test Cases:**
- [ ] Empty password: Error shown
- [ ] 1 character password: Error shown
- [ ] 5 character password: Error shown
- [ ] 6 character password: Accepted ✅

**Status:** [ ] PASS / [ ] FAIL

---

### Test 9.2: Invalid Email Format
**Objective:** Test email validation

**Test Cases:**
- [ ] No @ symbol: Browser validation error
- [ ] Missing domain: Browser validation error
- [ ] Valid email: Accepted ✅

**Status:** [ ] PASS / [ ] FAIL

---

### Test 9.3: SQL Injection Prevention
**Objective:** Test input sanitization

**Steps:**
1. Try to register with email: `'; DROP TABLE users; --`
2. Try to login with email: `admin'--`

**Expected Result:** ✅ Treated as literal strings, no SQL injection

**Status:** [ ] PASS / [ ] FAIL

---

## Test Suite 10: Role-Based Access Control ✅

### Test 10.1: Privilege Verification
**Objective:** Confirm each role has correct privileges

**Super Admin Privileges:**
```javascript
['view_all', 'approve_plans', 'sign_checklists', 'supervise', 
 'manage_users', 'approve_registrations', 'system_settings', 
 'topic_management', 'mcq_management']
```

**Consultant Privileges:**
```javascript
['view_all', 'approve_plans', 'sign_checklists', 'supervise',
 'topic_management', 'mcq_management', 'approve_registrations']
```

**Senior Registrar Privileges:**
```javascript
['view_all', 'create_plans', 'supervise_juniors', 'sign_checklists',
 'request_labs', 'prescribe_medications', 'schedule_procedures']
```

**Junior Registrar Privileges:**
```javascript
['view_assigned', 'create_plans', 'request_labs', 
 'prescribe_medications', 'schedule_procedures', 'create_notes']
```

**Medical Officer Privileges:**
```javascript
['view_assigned', 'create_notes', 'request_labs', 
 'prescribe_medications', 'assist_procedures']
```

**House Officer Privileges:**
```javascript
['view_assigned', 'create_notes', 'request_labs', 'assist_procedures']
```

**Verification Steps:**
1. Check IndexedDB for each approved user
2. Verify privileges array matches role definition

**Status:** [ ] PASS / [ ] FAIL

---

## Test Summary 📊

**Total Tests:** ~50 test cases
**Tests Passed:** ____
**Tests Failed:** ____
**Pass Rate:** ____%

### Critical Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

### Minor Issues Found:
1. _________________________________
2. _________________________________
3. _________________________________

### Recommendations:
1. _________________________________
2. _________________________________
3. _________________________________

---

## Next Steps After Testing ✨

If all tests pass:
- [ ] Implement password hashing for production
- [ ] Add email notifications
- [ ] Add UserApprovalManager component to Admin page
- [ ] Implement password reset functionality
- [ ] Add two-factor authentication
- [ ] Set up audit logging

---

## Quick Reference

**Admin Credentials:**
- Email: blakvelvet@bonnesante.com
- Password: natiss4natiss

**Test User Credentials (after approval):**
- jane.doe@hospital.com / test1234 (House Officer)
- sarah.williams@hospital.com / test1234 (Medical Officer)
- michael.brown@hospital.com / test1234 (Consultant)

**Database Location:**
- DevTools → Application → IndexedDB → PSA_Clinical_DB

**Service Worker:**
- Should show as registered in Console

---

**Testing Started:** _______________
**Testing Completed:** _______________
**Tester Name:** _______________
**Browser Used:** _______________
**OS:** Windows

