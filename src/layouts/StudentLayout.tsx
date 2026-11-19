import React from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { StudentNavbar } from '../components/navigation/StudentNavbar';
import { GlobalVoiceAssistant } from '../components/navigation/GlobalVoiceAssistant';
import { useUiStore } from '../state/uiStore';

export const StudentLayout: React.FC = () => {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex font-sans">
      {/* Collapsible Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Top Navbar */}
        <StudentNavbar />

        {/* Page Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Globally Accessible Voice Assistant Dialog */}
      <GlobalVoiceAssistant />
    </div>
  );
};
