import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_TOKEN_SECRET || 'mealwise-secret-key-2024';

export interface TokenData {
  username: string;
  email: string;
  accessToken?: string;
  iat: number; // issued at
  exp: number; // expires at
}

export class TokenManager {
  /**
   * Encrypt and create a token with user data
   */
  static createToken(userData: { username: string; email: string; accessToken?: string }): string {
    const tokenData: TokenData = {
      username: userData.username,
      email: userData.email,
      accessToken: userData.accessToken,
      iat: Date.now(),
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
    };

    const tokenString = JSON.stringify(tokenData);
    const encryptedToken = CryptoJS.AES.encrypt(tokenString, SECRET_KEY).toString();
    
    return encryptedToken;
  }

  /**
   * Decrypt and parse token data
   */
  static parseToken(encryptedToken: string): TokenData | null {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        return null;
      }

      const tokenData: TokenData = JSON.parse(decryptedString);
      
      // Check if token is expired
      if (Date.now() > tokenData.exp) {
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Token parsing error:', error);
      return null;
    }
  }

  /**
   * Validate if token is still valid
   */
  static isTokenValid(encryptedToken: string): boolean {
    const tokenData = this.parseToken(encryptedToken);
    return tokenData !== null;
  }

  /**
   * Extract username from token
   */
  static getUsernameFromToken(encryptedToken: string): string | null {
    const tokenData = this.parseToken(encryptedToken);
    return tokenData?.username || null;
  }
}

export class CookieManager {
  static readonly TOKEN_COOKIE_NAME = 'mealwise_auth_token';
  static readonly COOKIE_OPTIONS = {
    httpOnly: false, // Set to true if you want server-side only access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/'
  };

  /**
   * Set authentication token in cookie
   */
  static setToken(token: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${this.TOKEN_COOKIE_NAME}=${token}; max-age=${this.COOKIE_OPTIONS.maxAge}; path=${this.COOKIE_OPTIONS.path}; samesite=${this.COOKIE_OPTIONS.sameSite}${this.COOKIE_OPTIONS.secure ? '; secure' : ''}`;
    }
  }

  /**
   * Get authentication token from cookie
   */
  static getToken(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.TOKEN_COOKIE_NAME}=`)
    );

    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }

    return null;
  }

  /**
   * Remove authentication token from cookie
   */
  static removeToken(): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${this.TOKEN_COOKIE_NAME}=; max-age=0; path=${this.COOKIE_OPTIONS.path}`;
    }
  }

  /**
   * Check if user is authenticated based on valid token in cookie
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? TokenManager.isTokenValid(token) : false;
  }

  /**
   * Get current user data from token
   */
  static getCurrentUser(): { username: string; email: string } | null {
    const token = this.getToken();
    if (!token) return null;

    const tokenData = TokenManager.parseToken(token);
    if (!tokenData) return null;

    return {
      username: tokenData.username,
      email: tokenData.email
    };
  }
}
