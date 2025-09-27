'use client';

import React, { useState } from 'react';
import { LoginCredentials, SignupCredentials, AuthError } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange, onSuccess }) => {
  const [formData, setFormData] = useState<LoginCredentials & SignupCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific errors when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== name));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: AuthError[] = [];

    if (!formData.email) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push({ field: 'email', message: 'Please enter a valid email' });
    }

    if (!formData.password) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    } else if (formData.password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const response = mode === 'login' 
        ? await authService.login(formData)
        : await authService.signup(formData);

      if (response.success && response.token && response.user) {
        authService.storeAuthData(response.token, response.user);
        onSuccess();
      } else {
        setErrors([{ message: response.message || 'Authentication failed' }]);
      }
    } catch (error) {
      setErrors([{ message: 'An unexpected error occurred' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message;
  };

  return (
    <div className="w-full space-y-8 bg-white rounded-lg border border-amber-200 shadow-sm p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? 'Sign in to your MealWise account' 
              : 'Join MealWise to start organizing your meals'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  getFieldError('email') ? 'border-red-300' : 'border-amber-300'
                }`}
                placeholder="john@example.com"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  getFieldError('password') ? 'border-red-300' : 'border-amber-300'
                }`}
                placeholder="••••••••"
              />
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    getFieldError('confirmPassword') ? 'border-red-300' : 'border-amber-300'
                  }`}
                  placeholder="••••••••"
                />
                {getFieldError('confirmPassword') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
                )}
              </div>
            )}
          </div>

          {errors.some(error => !error.field) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">
                {errors.find(error => !error.field)?.message}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </form>
    </div>
  );
};
