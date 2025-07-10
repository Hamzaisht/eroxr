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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Neural background effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(120,119,198,0.1)_90deg,transparent_180deg)]" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
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
          <main className="flex-1 overflow-auto p-6">
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