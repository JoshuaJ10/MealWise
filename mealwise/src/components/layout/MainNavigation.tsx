'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const MainNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout(); // This will clear the cookie and update state
    router.push('/landing');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/landing" className="flex items-center space-x-2">
            <Image
              src="/MealWise.png"
              alt="MealWise Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">MealWise</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Notes
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-600 text-white font-medium px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-green-600 text-white font-medium px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile - Show only essential elements */}
          <div className="md:hidden flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-600 truncate max-w-20">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-red-600 text-white font-medium px-2 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs text-gray-600 hover:text-gray-900 font-medium px-2 py-1 rounded transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-xs bg-green-600 text-white font-medium px-2 py-1 rounded hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};
