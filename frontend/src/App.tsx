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

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VanguardAI from './components/VanguardAI';
import PlaceholderPage from './pages/PlaceholderPage';
import { useAppStore } from './store';
import './styles/globals.css';

/**
 * Main Application Component
 */
function App(): React.JSX.Element {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const { sidebarCollapsed, toggleSidebar, isCopilotOpen, toggleCopilot, setCopilotOpen } = useAppStore();

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white relative flex flex-col">
        {/* 
          Top Navigation Bar
          Contains: Logo, breadcrumbs, system status, user info
        */}
        <Navbar
          onMenuClick={toggleSidebar}
          onToggleCopilot={toggleCopilot}
        />

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* 
            Left Sidebar Navigation
            Contains: Navigation menu, system status indicators
          */}
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />

          {/* 
            Main Content Area
            Adjusts padding based on sidebar width
          */}
          <main
            className={`
              flex-1
              overflow-y-auto
              p-6
              transition-all
              duration-300
              ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
            `}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/threats" element={<PlaceholderPage title="Threat Analysis" />} />
              <Route path="/operations" element={<PlaceholderPage title="Operations Center" />} />
              <Route path="/surveillance" element={<PlaceholderPage title="Surveillance" />} />
              <Route path="/alerts" element={<PlaceholderPage title="Alerts & Incidents" />} />
              <Route path="/analytics" element={<PlaceholderPage title="Intelligence Analytics" />} />
              <Route path="/personnel" element={<PlaceholderPage title="Personnel & Assets" />} />
              <Route path="/systems" element={<PlaceholderPage title="System Status" />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>

        {/* Floating Vanguard AI Copilot */}
        <VanguardAI
          isOpen={isCopilotOpen}
          onClose={() => setCopilotOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
