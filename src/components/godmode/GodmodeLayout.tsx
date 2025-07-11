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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Vanta Black Background with Neon Effects */}
      <div className="fixed inset-0">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f5ff11_1px,transparent_1px),linear-gradient(to_bottom,#00f5ff11_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        {/* Neon glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 backdrop-blur-[1px]" />
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