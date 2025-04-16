
import React from 'react';
import { Outlet } from 'react-router-dom';
import { InteractiveNav } from './InteractiveNav';
import { MainContent } from './components/MainContent';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#0D1117]">
      <InteractiveNav />
      
      <div className="flex-1 ml-[60px] md:ml-[220px] min-h-screen">
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default Layout;
