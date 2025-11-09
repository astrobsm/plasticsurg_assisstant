# User Authentication & Registration System - Implementation Guide

## Overview

This document describes the complete user authentication and registration system implemented for the Plastic Surgeon Assistant PWA. The system includes user registration with admin approval, role-based access control, and secure authentication.

## Admin Credentials

**Default Administrator Account:**
- **Email:** `blakvelvet@bonnesante.com`
- **Password:** `natiss4natiss`

This account is automatically created on first app launch and has full system access including user management capabilities.

## System Architecture

### Components

1. **UserManagementService** (`src/services/userManagementService.ts`)
   - Handles all user registration, approval, and authentication logic
   - Manages pending and approved user records
   - Provides role-based privilege mapping

2. **Authentication Store** (`src/store/authStore.ts`)
   - Zustand-based state management for authentication
   - Persists user session to localStorage
   - Integrates with UserManagementService for authentication

3. **Login Page** (`src/pages/Login.tsx`)
   - Provides login interface
   - Includes registration form modal
   - Displays error messages and validation

4. **User Approval Manager** (`src/components/UserApprovalManager.tsx`)
   - Admin interface for managing user registrations
   - Approve/reject pending requests
   - View and manage all approved users
   - Activate/deactivate user accounts

5. **Database Tables** (`src/db/database.ts`)
   - `pending_users` - Stores registration requests
   - `approved_users` - Stores active user accounts

## User Roles & Privileges

### Role Hierarchy

1. **Super Admin** (System Administrator)
   - Full system access
   - User management
   - System settings
   - Topic management
   - MCQ management

2. **Consultant** (Attending Surgeon)
   - Same privileges as Super Admin (for clinical purposes)
   - Can approve registration requests
   - Can manage educational content
   - Full patient access

3. **Senior Registrar**
   - View all patients
   - Create treatment plans
   - Supervise junior staff
   - Sign checklists
   - Request labs
   - Prescribe medications
   - Schedule procedures

4. **Junior Registrar**
   - View assigned patients
   - Create treatment plans
   - Request labs
   - Prescribe medications
   - Schedule procedures
   - Create clinical notes

5. **Medical Officer**
   - View assigned patients
   - Create clinical notes
   - Request labs
   - Prescribe medications
   - Assist in procedures

6. **House Officer**
   - View assigned patients
   - Create clinical notes
   - Request labs
   - Assist in procedures

### Privilege Matrix

| Privilege | Super Admin | Consultant | Sr. Registrar | Jr. Registrar | Medical Officer | House Officer |
|-----------|-------------|------------|---------------|---------------|-----------------|---------------|
| view_all | ✓ | ✓ | ✓ | - | - | - |
| view_assigned | - | - | - | ✓ | ✓ | ✓ |
| approve_plans | ✓ | ✓ | - | - | - | - |
| create_plans | - | - | ✓ | ✓ | - | - |
| sign_checklists | ✓ | ✓ | ✓ | - | - | - |
| supervise | ✓ | ✓ | - | - | - | - |
| supervise_juniors | - | - | ✓ | - | - | - |
| manage_users | ✓ | - | - | - | - | - |
| approve_registrations | ✓ | ✓ | - | - | - | - |
| topic_management | ✓ | ✓ | - | - | - | - |
| mcq_management | ✓ | ✓ | - | - | - | - |
| request_labs | - | - | ✓ | ✓ | ✓ | ✓ |
| prescribe_medications | - | - | ✓ | ✓ | ✓ | - |
| schedule_procedures | - | - | ✓ | ✓ | - | - |
| assist_procedures | - | - | - | - | ✓ | ✓ |
| create_notes | - | - | - | ✓ | ✓ | ✓ |
| system_settings | ✓ | - | - | - | - | - |

## User Registration Workflow

### Step 1: New User Registration

1. User navigates to Login page
2. Clicks "Create New Profile" button
3. Fills out registration form:
   - Full Name (required)
   - Email Address (required)
   - Password (required, min 6 characters)
   - Confirm Password (required)
   - Role (required) - dropdown selection
   - Phone Number (optional)
   - Department (optional)
   - Registration Number (optional)

4. Submits form

**Validation Rules:**
- Email must be unique (not already registered or pending)
- Password must be at least 6 characters
- Password and Confirm Password must match
- Email is automatically converted to lowercase

### Step 2: Pending Approval

After successful submission:
- User receives confirmation message
- Registration request is stored in `pending_users` table with status: `pending`
- User cannot log in until approved

### Step 3: Admin Review

Admin accesses User Management section to:
1. View all pending registration requests
2. See user details:
   - Name, email, role
   - Contact information
   - Department and registration number
   - Request date

3. Decision options:
   - **Approve**: Creates active user account with role-based privileges
   - **Reject**: Marks request as rejected with reason
   - **View Details**: See complete user information

### Step 4: Approval/Rejection

**If Approved:**
- User record moved to `approved_users` table
- Privileges assigned based on role
- Account status set to `active`
- User can now log in

**If Rejected:**
- Pending request status updated to `rejected`
- Rejection reason stored
- User cannot log in
- User must submit new registration request

### Step 5: User Login

After approval:
1. User enters email and password
2. System validates credentials
3. Checks account is active
4. Creates authenticated session
5. Updates last login timestamp
6. Redirects to dashboard

## API Reference

### UserManagementService Methods

#### `submitRegistrationRequest(userData)`
Submits a new user registration request.

**Parameters:**
- `userData`: User registration data (name, email, password, role, etc.)

**Returns:** Promise<number> - ID of created pending request

**Throws:**
- Email already registered
- Email already has pending request

---

#### `getPendingRequests()`
Retrieves all pending registration requests.

**Returns:** Promise<PendingUser[]> - Array of pending users

---

#### `approveRegistration(requestId, adminId?)`
Approves a pending registration request.

**Parameters:**
- `requestId`: Number - ID of pending request
- `adminId`: String (optional) - ID of approving admin (default: 'admin')

**Returns:** Promise<number> - ID of created approved user

**Throws:**
- Request not found
- Request already processed

---

#### `rejectRegistration(requestId, reason, adminId?)`
Rejects a pending registration request.

**Parameters:**
- `requestId`: Number - ID of pending request
- `reason`: String - Rejection reason
- `adminId`: String (optional) - ID of rejecting admin

**Throws:**
- Request not found
- Request already processed

---

#### `authenticateUser(email, password)`
Authenticates user credentials.

**Parameters:**
- `email`: String - User email
- `password`: String - User password

**Returns:** Promise<ApprovedUser | null> - User object if valid, null if invalid

**Throws:**
- Account deactivated error

---

#### `getAllApprovedUsers()`
Retrieves all approved users.

**Returns:** Promise<ApprovedUser[]> - Array of approved users

---

#### `updateUserStatus(userId, isActive)`
Updates user account status.

**Parameters:**
- `userId`: Number - User ID
- `isActive`: Boolean - New active status

---

#### `initializeAdminAccount()`
Creates default admin account if it doesn't exist.

**Called automatically on app initialization**

## Database Schema

### pending_users Table

```typescript
{
  id: number (auto-increment)
  name: string
  email: string (indexed)
  password: string
  role: 'consultant' | 'senior_registrar' | 'junior_registrar' | 'medical_officer' | 'house_officer'
  phone?: string
  department?: string
  registration_number?: string
  requested_at: Date (indexed)
  status: 'pending' | 'approved' | 'rejected' (indexed)
  reviewed_by?: string
  reviewed_at?: Date (indexed)
  rejection_reason?: string
}
```

### approved_users Table

```typescript
{
  id: number (auto-increment)
  name: string
  email: string (indexed)
  password: string
  role: 'super_admin' | 'consultant' | 'senior_registrar' | 'junior_registrar' | 'medical_officer' | 'house_officer' | 'nursing' | 'lab' | 'pharmacy' (indexed)
  phone?: string
  department?: string
  registration_number?: string
  privileges: string[]
  approved_at: Date (indexed)
  approved_by: string
  created_at: Date
  last_login?: Date
  is_active: boolean (indexed)
}
```

## Security Considerations

### Current Implementation

⚠️ **For Development Only**

The current implementation uses **plain text password storage** for development purposes. This is acceptable for a PWA running locally but **MUST NOT be used in production**.

### Production Requirements

Before deploying to production, implement:

1. **Password Hashing**
   - Use bcrypt, argon2, or similar
   - Salt passwords individually
   - Example with bcrypt:
   ```typescript
   import bcrypt from 'bcrypt';
   
   // When creating user
   const hashedPassword = await bcrypt.hash(password, 10);
   
   // When authenticating
   const isValid = await bcrypt.compare(password, user.password);
   ```

2. **JWT Tokens**
   - Replace simple base64 tokens with proper JWTs
   - Include expiration times
   - Sign with secret key
   - Refresh token mechanism

3. **Backend Authentication**
   - Move authentication to secure backend server
   - Validate all requests server-side
   - Use HTTPS only

4. **Additional Security**
   - Implement rate limiting
   - Add account lockout after failed attempts
   - Email verification
   - Password reset functionality
   - Two-factor authentication (2FA)
   - Audit logging for security events

### HIPAA Compliance Notes

For medical data compliance:
- Encrypt data at rest and in transit
- Implement automatic session timeout
- Log all access to patient data
- Regular security audits
- Data backup and recovery procedures
- Access control reviews

## Admin Operations

### Accessing User Management

1. Log in as admin (blakvelvet@bonnesante.com)
2. Navigate to Admin section
3. Select "User Management" or "User Approvals" tab
4. View pending requests and approved users

### Approving Users

1. In Pending Approvals tab:
   - Review user details
   - Click ✓ (green checkmark) to approve
   - Confirm approval
   - User is immediately activated

### Rejecting Users

1. In Pending Approvals tab:
   - Click ✗ (red X) to reject
   - Enter rejection reason when prompted
   - Confirm rejection

### Managing Approved Users

1. In All Users tab:
   - View all approved users
   - See status (Active/Inactive)
   - See last login time
   - Click ✓/✗ to activate/deactivate accounts
   - Click 📄 to view user details

### Deactivating Accounts

Reasons to deactivate:
- User no longer works at facility
- Security concerns
- Temporary suspension

**Note:** Deactivated users cannot log in but their data is preserved.

## Testing Guide

### Test Scenarios

#### 1. New User Registration

**Test Steps:**
1. Go to login page
2. Click "Create New Profile"
3. Fill form with test data:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: Junior Registrar
4. Submit form
5. Verify success message
6. Attempt login (should fail - not approved yet)

**Expected:** Registration succeeds, login fails with pending status

#### 2. Admin Approval

**Test Steps:**
1. Login as admin
2. Go to User Management
3. See pending request for test@example.com
4. Approve request
5. Logout
6. Login as test@example.com with password test123

**Expected:** Login succeeds after approval

#### 3. Role-Based Access

**Test Steps:**
1. Login as House Officer
2. Attempt to access admin functions
3. Verify restricted access

**Expected:** House Officer cannot access admin-only features

#### 4. Account Deactivation

**Test Steps:**
1. Login as admin
2. Deactivate a test user account
3. Logout
4. Attempt login as deactivated user

**Expected:** Login fails with "account deactivated" message

#### 5. Duplicate Email Prevention

**Test Steps:**
1. Register with email: duplicate@test.com
2. Have admin approve
3. Attempt to register again with duplicate@test.com

**Expected:** Registration fails with "email already registered" error

## Troubleshooting

### Common Issues

**Problem:** Cannot login after registration
- **Solution:** Check if admin has approved your registration request

**Problem:** "Email already registered" error
- **Solution:** Email addresses are unique. Use different email or login with existing account

**Problem:** "Account deactivated" error
- **Solution:** Contact administrator to reactivate your account

**Problem:** Admin account not created
- **Solution:** Check browser console for initialization errors. Clear IndexedDB and reload app.

**Problem:** Password validation error
- **Solution:** Password must be at least 6 characters. Check that password and confirm password match.

### Developer Debugging

**View pending requests:**
```typescript
import { userManagementService } from './services/userManagementService';
const pending = await userManagementService.getPendingRequests();
console.log(pending);
```

**View approved users:**
```typescript
const users = await userManagementService.getAllApprovedUsers();
console.log(users);
```

**Check admin account:**
```typescript
import { db } from './db/database';
const admin = await db.approved_users
  .where('email')
  .equals('blakvelvet@bonnesante.com')
  .first();
console.log(admin);
```

**Reset database (CAUTION - deletes all data):**
```typescript
import { resetDatabase } from './utils/dbReset';
await resetDatabase();
```

## Migration from Old System

If upgrading from the previous mock authentication system:

1. **Backup existing data** - Export any important data
2. **Clear localStorage** - Remove old auth tokens
3. **Clear IndexedDB** - Reset database to version 6
4. **Reload app** - Admin account auto-created
5. **Register existing users** - Have users submit registration requests
6. **Approve users** - Admin approves all legitimate users

## Future Enhancements

### Planned Features

1. **Email Notifications**
   - Notify users when registration approved/rejected
   - Send welcome email with login instructions
   - Password reset emails

2. **Password Management**
   - Password reset functionality
   - Password complexity requirements
   - Password expiration policy

3. **Enhanced Security**
   - Two-factor authentication (2FA)
   - Biometric authentication support
   - Session management improvements

4. **Audit Trail**
   - Log all user actions
   - Track login/logout events
   - Monitor failed login attempts

5. **User Profile Management**
   - Allow users to update their profiles
   - Upload profile pictures
   - Manage notification preferences

6. **Role Management**
   - Dynamic role creation
   - Custom privilege assignment
   - Department-based access control

## Support & Contact

For technical support or questions:
- Review this documentation
- Check browser console for errors
- Contact system administrator

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**System:** Plastic Surgeon Assistant PWA - User Authentication System
