import { LoginCredentials, SignupCredentials, User } from '@/types/auth';

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Mock implementation - replace with real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          resolve({
            success: true,
            token: 'mock-token',
            user: {
              id: '1',
              email: credentials.email,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
        } else {
          resolve({
            success: false,
            message: 'Invalid credentials',
          });
        }
      }, 1000);
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Mock implementation - replace with real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.password !== credentials.confirmPassword) {
          resolve({
            success: false,
            message: 'Passwords do not match',
          });
          return;
        }
        
        resolve({
          success: true,
          token: 'mock-token',
          user: {
            id: '1',
            email: credentials.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }, 1000);
    });
  }

  storeAuthData(token: string, user: User): void {
    // Mock implementation - store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  async logout(): Promise<void> {
    // Mock implementation - replace with real API call
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return Promise.resolve();
  }
}

export const authService = new AuthService();
