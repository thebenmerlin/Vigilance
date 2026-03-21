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
import ThreatAnalysis from './pages/ThreatAnalysis';
import Operations from './pages/Operations';
import Surveillance from './pages/Surveillance';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Personnel from './pages/Personnel';
import Systems from './pages/Systems';
import Login from './pages/Login';
import PlaceholderPage from './pages/PlaceholderPage';
import { useAppStore } from './store';
import './styles/globals.css';

/**
 * Protected Route Wrapper
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Main Application Component
 */
function App(): React.JSX.Element {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const { sidebarCollapsed, toggleSidebar, isCopilotOpen, toggleCopilot, setCopilotOpen, isAuthenticated } = useAppStore();

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <BrowserRouter>
      {isAuthenticated ? (
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
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/threats" element={<ProtectedRoute><ThreatAnalysis /></ProtectedRoute>} />
                <Route path="/operations" element={<ProtectedRoute><Operations /></ProtectedRoute>} />
                <Route path="/surveillance" element={<ProtectedRoute><Surveillance /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/personnel" element={<ProtectedRoute><Personnel /></ProtectedRoute>} />
                <Route path="/systems" element={<ProtectedRoute><Systems /></ProtectedRoute>} />
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
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
