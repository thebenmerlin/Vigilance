/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Main App Component
 * =============================================================================
 * 
 * The root component that sets up:
 * - Application layout (Navbar, Sidebar, Main content)
 * - React context providers (if needed)
 * - Global state management
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────────────────────┐
 * │                     Navbar                          │
 * ├────────────┬────────────────────────────────────────┤
 * │            │                                        │
 * │  Sidebar   │            Main Content                │
 * │            │             (Dashboard)                │
 * │            │                                        │
 * └────────────┴────────────────────────────────────────┘
 * 
 * TODO: Add React Router for multi-page navigation
 * TODO: Add global state management (Context/Zustand)
 * =============================================================================
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VanguardAI from './components/VanguardAI';
import './styles/globals.css';

/**
 * Main Application Component
 */
function App(): React.JSX.Element {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  /**
   * Sidebar collapse state
   * When collapsed, sidebar shows only icons
   */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /**
   * Current active page/section
   * Used for sidebar navigation highlighting
   */
  const [activePage, setActivePage] = useState('dashboard');

  /**
   * Toggle state for Vanguard AI Copilot
   */
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Toggle sidebar collapse state
   */
  const toggleSidebar = (): void => {
    setSidebarCollapsed((prev) => !prev);
  };

  /**
   * Handle navigation item click
   * TODO: Integrate with React Router for actual navigation
   */
  const handleNavigate = (page: string): void => {
    setActivePage(page);
    console.log(`[Navigation] Navigating to: ${page}`);
    // TODO: Use router.push() when React Router is set up
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* 
        Top Navigation Bar
        Contains: Logo, breadcrumbs, system status, user info
      */}
      <Navbar
        onMenuClick={toggleSidebar}
        onToggleCopilot={() => setIsCopilotOpen(prev => !prev)}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex">
        {/* 
          Left Sidebar Navigation
          Contains: Navigation menu, system status indicators
        */}
        <Sidebar
          collapsed={sidebarCollapsed}
          activePage={activePage}
          onNavigate={handleNavigate}
          onToggle={toggleSidebar}
        />

        {/* 
          Main Content Area
          Adjusts padding based on sidebar width
        */}
        <main
          className={`
            flex-1 
            min-h-[calc(100vh-64px)] 
            p-6 
            transition-all 
            duration-300
            ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
          `}
        >
          {/* 
            Dashboard is the main content
            TODO: Replace with React Router <Outlet /> for multi-page support
          */}
          {activePage === 'dashboard' && <Dashboard />}

          {/* 
            Placeholder for other pages
            TODO: Implement these components
          */}
          {activePage === 'threats' && (
            <div className="flex items-center justify-center h-64 card">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Threat Analysis</h2>
                <p className="text-slate-400">Coming soon...</p>
              </div>
            </div>
          )}

          {activePage === 'operations' && (
            <div className="flex items-center justify-center h-64 card">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Operations Center</h2>
                <p className="text-slate-400">Coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Vanguard AI Copilot */}
      <VanguardAI
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}

export default App;
