import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GodmodeSidebar } from './sidebar/GodmodeSidebar';
import { GodmodeHeader } from './header/GodmodeHeader';
import { GhostModeIndicator } from './overlay/GhostModeIndicator';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { cn } from '@/lib/utils';

export const GodmodeLayout: React.FC = () => {
  const { isGhostMode } = useAdminSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Sophisticated Background */}
      <div className="fixed inset-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 premium-grid opacity-30" />
        
        {/* Elegant gradient overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-blue-500/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-purple-500/5 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-gradient-radial from-indigo-500/3 to-transparent blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        {/* Professional overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-transparent to-slate-950/30" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <GodmodeSidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        {/* Main content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "ml-72" : "ml-16"
        )}>
          {/* Header */}
          <GodmodeHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Ghost Mode Indicator */}
        {isGhostMode && <GhostModeIndicator />}
      </div>
    </div>
  );
};