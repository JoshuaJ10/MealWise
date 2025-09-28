'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function LogoutButton() {
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    // This will clear the encrypted token from cookie and update state
    logout();
    router.push('/landing');
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        Welcome, <span className="font-medium text-gray-900">{user?.username}</span>
      </span>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
