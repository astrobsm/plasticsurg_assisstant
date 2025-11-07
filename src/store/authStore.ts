import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'consultant' | 'registrar' | 'intern' | 'nursing' | 'lab' | 'pharmacy';
  privileges: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: true,

      login: async (email: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: '1',
            name: 'Dr. Sarah Johnson',
            email,
            role: password === 'consultant' ? 'consultant' : 'intern',
            privileges: password === 'consultant' 
              ? ['view_all', 'approve_plans', 'sign_checklists', 'supervise'] 
              : ['view_assigned', 'create_notes', 'request_labs']
          };

          set({ user: mockUser, token: 'mock-jwt-token', loading: false });
        } catch (error) {
          throw new Error('Login failed');
        }
      },

      logout: () => {
        set({ user: null, token: null, loading: false });
      },

      initializeAuth: () => {
        // Check if we have stored auth data
        const state = get();
        if (state.token) {
          // TODO: Validate token with backend
          set({ loading: false });
        } else {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'psa-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);