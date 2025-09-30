import { create } from 'zustand';
import { TokenManager, CookieManager } from '@/lib/tokenUtils';

interface User {
  username: string;
  email: string;
  accessToken?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken?: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, _get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: (user: User, accessToken?: string) => {
    // Create encrypted token
    const token = TokenManager.createToken({
      username: user.username,
      email: user.email,
      accessToken
    });
    
    // Store token in cookie
    CookieManager.setToken(token);
    
    set({
      user: { ...user, accessToken },
      isAuthenticated: true,
      isLoading: false,
    });
  },
  
  logout: () => {
    // Remove token from cookie
    CookieManager.removeToken();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: () => {
    // Check if user is authenticated via cookie
    const isAuth = CookieManager.isAuthenticated();
    
    if (isAuth) {
      const userData = CookieManager.getCurrentUser();
      if (userData) {
        set({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    }
    
    // If not authenticated or invalid token, clear state
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
