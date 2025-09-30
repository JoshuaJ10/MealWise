'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NotesInterface } from '@/components/NotesInterface';
import { NotesSidebar } from '@/components/layout/NotesSidebar';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { isAuthenticated, isLoading, initializeAuth, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize authentication from cookie
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/landing');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to landing page
  }

  return (
    <div className="h-screen bg-amber-50 flex overflow-hidden">
      {/* Sidebar */}
      <NotesSidebar user={user || undefined} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main app content */}
        <NotesInterface />
      </div>
    </div>
  );
}