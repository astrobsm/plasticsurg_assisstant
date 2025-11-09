import { db } from '../db/database';

export interface PendingUser {
  id?: number; // Auto-incremented by Dexie
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  role: 'consultant' | 'senior_registrar' | 'junior_registrar' | 'medical_officer' | 'house_officer';
  phone?: string;
  department?: string;
  registration_number?: string;
  requested_at: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: Date;
  rejection_reason?: string;
}

export interface ApprovedUser {
  id?: number; // Auto-incremented by Dexie
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  role: 'super_admin' | 'consultant' | 'senior_registrar' | 'junior_registrar' | 'medical_officer' | 'house_officer' | 'nursing' | 'lab' | 'pharmacy';
  phone?: string;
  department?: string;
  registration_number?: string;
  privileges: string[];
  approved_at: Date;
  approved_by: string;
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
}

class UserManagementService {
  // Submit registration request
  async submitRegistrationRequest(userData: Omit<PendingUser, 'id' | 'requested_at' | 'status'>): Promise<number> {
    // Check if email already exists
    const existingApproved = await db.approved_users
      .where('email')
      .equals(userData.email.toLowerCase())
      .first();

    if (existingApproved) {
      throw new Error('This email is already registered. Please login or use a different email.');
    }

    const existingPending = await db.pending_users
      .where('email')
      .equals(userData.email.toLowerCase())
      .first();

    if (existingPending && existingPending.status === 'pending') {
      throw new Error('A registration request with this email is already pending approval.');
    }

    const pendingUser: PendingUser = {
      ...userData,
      email: userData.email.toLowerCase(),
      requested_at: new Date(),
      status: 'pending'
    };

    const id = await db.pending_users.add(pendingUser);
    return id as number;
  }

  // Get all pending registration requests
  async getPendingRequests(): Promise<PendingUser[]> {
    return await db.pending_users
      .where('status')
      .equals('pending')
      .reverse()
      .sortBy('requested_at');
  }

  // Get all registration requests (pending, approved, rejected)
  async getAllRequests(): Promise<PendingUser[]> {
    return await db.pending_users
      .reverse()
      .sortBy('requested_at');
  }

  // Approve registration request
  async approveRegistration(requestId: number, adminId: string = 'admin'): Promise<number> {
    const pendingUser = await db.pending_users.get(requestId);
    
    if (!pendingUser) {
      throw new Error('Registration request not found');
    }

    if (pendingUser.status !== 'pending') {
      throw new Error('This request has already been processed');
    }

    // Determine privileges based on role
    const privileges = this.getPrivilegesByRole(pendingUser.role);

    // Create approved user
    const approvedUser: ApprovedUser = {
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: pendingUser.role,
      phone: pendingUser.phone,
      department: pendingUser.department,
      registration_number: pendingUser.registration_number,
      privileges,
      approved_at: new Date(),
      approved_by: adminId,
      created_at: new Date(),
      is_active: true
    };

    const userId = await db.approved_users.add(approvedUser);

    // Update pending request status
    await db.pending_users.update(requestId, {
      status: 'approved',
      reviewed_by: adminId,
      reviewed_at: new Date()
    });

    return userId as number;
  }

  // Reject registration request
  async rejectRegistration(requestId: number, reason: string, adminId: string = 'admin'): Promise<void> {
    const pendingUser = await db.pending_users.get(requestId);
    
    if (!pendingUser) {
      throw new Error('Registration request not found');
    }

    if (pendingUser.status !== 'pending') {
      throw new Error('This request has already been processed');
    }

    await db.pending_users.update(requestId, {
      status: 'rejected',
      reviewed_by: adminId,
      reviewed_at: new Date(),
      rejection_reason: reason
    });
  }

  // Get privileges by role
  private getPrivilegesByRole(role: string): string[] {
    const privilegeMap: Record<string, string[]> = {
      super_admin: [
        'view_all',
        'approve_plans',
        'sign_checklists',
        'supervise',
        'manage_users',
        'approve_registrations',
        'system_settings',
        'topic_management',
        'mcq_management'
      ],
      consultant: [
        'view_all',
        'approve_plans',
        'sign_checklists',
        'supervise',
        'topic_management',
        'mcq_management',
        'approve_registrations'
      ],
      senior_registrar: [
        'view_all',
        'create_plans',
        'supervise_juniors',
        'sign_checklists',
        'request_labs',
        'prescribe_medications',
        'schedule_procedures'
      ],
      junior_registrar: [
        'view_assigned',
        'create_plans',
        'request_labs',
        'prescribe_medications',
        'schedule_procedures',
        'create_notes'
      ],
      medical_officer: [
        'view_assigned',
        'create_notes',
        'request_labs',
        'prescribe_medications',
        'assist_procedures'
      ],
      house_officer: [
        'view_assigned',
        'create_notes',
        'request_labs',
        'assist_procedures'
      ]
    };

    return privilegeMap[role] || [];
  }

  // Authenticate user
  async authenticateUser(email: string, password: string): Promise<ApprovedUser | null> {
    const user = await db.approved_users
      .where('email')
      .equals(email.toLowerCase())
      .first();

    if (!user) {
      return null;
    }

    // In production, use proper password hashing (bcrypt, argon2, etc.)
    if (user.password !== password) {
      return null;
    }

    if (!user.is_active) {
      throw new Error('Your account has been deactivated. Please contact the administrator.');
    }

    // Update last login
    if (user.id) {
      await db.approved_users.update(user.id, {
        last_login: new Date()
      });
    }

    return user;
  }

  // Get all approved users
  async getAllApprovedUsers(): Promise<ApprovedUser[]> {
    return await db.approved_users.toArray();
  }

  // Update user status (activate/deactivate)
  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    await db.approved_users.update(userId, {
      is_active: isActive
    });
  }

  // Deactivate user
  async deactivateUser(userId: number, adminId: string = 'admin'): Promise<void> {
    await db.approved_users.update(userId, {
      is_active: false
    });
  }

  // Activate user
  async activateUser(userId: number, adminId: string = 'admin'): Promise<void> {
    await db.approved_users.update(userId, {
      is_active: true
    });
  }

  // Initialize admin account
  async initializeAdminAccount(): Promise<void> {
    const adminEmail = 'blakvelvet@bonnesante.com';
    
    const existingAdmin = await db.approved_users
      .where('email')
      .equals(adminEmail)
      .first();

    if (!existingAdmin) {
      const admin: ApprovedUser = {
        name: 'System Administrator',
        email: adminEmail,
        password: 'natiss4natiss',
        role: 'super_admin',
        department: 'Administration',
        privileges: [
          'view_all',
          'approve_plans',
          'sign_checklists',
          'supervise',
          'manage_users',
          'approve_registrations',
          'system_settings',
          'topic_management',
          'mcq_management'
        ],
        approved_at: new Date(),
        approved_by: 'system',
        created_at: new Date(),
        is_active: true
      };

      await db.approved_users.add(admin);
      console.log('Default admin account created');
    }
  }
}

export const userManagementService = new UserManagementService();
