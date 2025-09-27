'use client';

import React from 'react';
import { CedarNotesInterface } from '@/components/cedar/CedarNotesInterface';
import { NotesSidebar } from '@/components/layout/NotesSidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* Sidebar */}
      <NotesSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <CedarNotesInterface />
      </div>
    </div>
  );
}