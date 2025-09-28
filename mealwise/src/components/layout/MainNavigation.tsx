'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const MainNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
              <div className="flex items-center space-x-2">
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

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-amber-200 py-4">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Notes
              </Link>
              <div className="pt-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Welcome, <span className="font-medium text-gray-900">{user?.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-sm bg-red-600 text-white font-medium hover:bg-red-700 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm bg-green-600 text-white font-medium hover:bg-green-700 rounded-md transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
