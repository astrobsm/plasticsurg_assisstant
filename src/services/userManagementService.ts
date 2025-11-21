import { apiClient } from './apiClient';

export interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  role: 'consultant' | 'registrar' | 'intern' | 'nurse' | 'lab_staff' | 'pharmacy';
  phone?: string;
  department?: string;
  specialization?: string;
  license_number?: string;
  created_at: string;
  is_approved: boolean;
  is_active: boolean;
}

export interface ApprovedUser {
  id: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'consultant' | 'registrar' | 'intern' | 'nurse' | 'lab_staff' | 'pharmacy';
  phone?: string;
  department?: string;
  specialization?: string;
  license_number?: string;
  created_at: string;
  updated_at?: string;
  is_approved: boolean;
  is_active: boolean;
}

class UserManagementService {
  async getPendingRequests(): Promise<PendingUser[]> {
    try {
      const users = await apiClient.getUsers();
      return users.filter((user: PendingUser) => !user.is_approved);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      throw error;
    }
  }

  async getAllApprovedUsers(): Promise<ApprovedUser[]> {
    try {
      const users = await apiClient.getUsers();
      return users.filter((user: ApprovedUser) => user.is_approved);
    } catch (error) {
      console.error('Error fetching approved users:', error);
      throw error;
    }
  }

  async approveRegistration(userId: string): Promise<void> {
    try {
      await apiClient.approveUser(userId, true);
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  }

  async rejectRegistration(userId: string, reason: string): Promise<void> {
    try {
      await apiClient.approveUser(userId, false);
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      await apiClient.updateUserStatus(userId, isActive);
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async submitRegistrationRequest(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    department?: string;
    registration_number?: string;
  }): Promise<void> {
    try {
      await apiClient.register({
        full_name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role as any,
        phone: userData.phone,
        department: userData.department,
        license_number: userData.registration_number
      });
    } catch (error) {
      console.error('Error submitting registration request:', error);
      throw error;
    }
  }
}

export const userManagementService = new UserManagementService();
