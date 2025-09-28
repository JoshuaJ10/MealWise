import { LoginCredentials, SignupCredentials } from '@/types/auth';

// Mock auth service
export const authService = {
  login: async (credentials: LoginCredentials) => {
    // Mock implementation
    return { 
      success: true, 
      token: 'mock-token-123',
      user: { email: credentials.email, id: '1' },
      message: 'Login successful'
    };
  },
  signup: async (credentials: SignupCredentials) => {
    // Mock implementation
    return { 
      success: true, 
      token: 'mock-token-123',
      user: { email: credentials.email, id: '1' },
      message: 'Signup successful'
    };
  },
  logout: async () => {
    // Mock implementation
    return { success: true };
  },
  storeAuthData: (token: string, user: { email: string; id: string }) => {
    // Mock implementation
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};
