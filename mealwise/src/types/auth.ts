export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
