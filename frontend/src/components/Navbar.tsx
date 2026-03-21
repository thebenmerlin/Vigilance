/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Navbar Component
 * =============================================================================
 * 
 * Top navigation bar containing:
 * - Logo and branding
 * - Current location breadcrumb
 * - System status indicator
 * - Notification bell
 * - User profile dropdown
 * 
 * The navbar is fixed at the top and always visible.
 * Height: 64px (h-16)
 * 
 * Props:
 * - onMenuClick: Callback to toggle sidebar
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Settings,
  Menu,
  Shield,
  ChevronDown,
  LogOut,
  User,
  TerminalSquare
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface NavbarProps {
  /** Callback when hamburger menu is clicked */
  onMenuClick?: () => void;
  /** Callback to toggle Vanguard AI Copilot */
  onToggleCopilot?: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onToggleCopilot }) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  /**
   * Current time display
   * Updates every second for real-time clock
   */
  const [currentTime, setCurrentTime] = useState(new Date());

  /**
   * User dropdown menu open state
   */
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /**
   * Number of unread notifications (demo)
   */
  const [notificationCount] = useState(3);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  /**
   * Update clock every second
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Format current time for display
   */
  const formatTime = (): string => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  /**
   * Format current date for display
   */
  const formatDate = (): string => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <nav className="bg-slate-800 border-b border-slate-700 h-16 px-4 sticky top-0 z-50">
      <div className="h-full flex items-center justify-between">
        {/* ------------------------------------------------------------------- */}
        {/* LEFT SECTION: Menu, Logo, Breadcrumb */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo and Branding */}
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-xl font-bold text-white tracking-wider">
                VIGILANCE
              </h1>
              <p className="text-xs text-slate-400 -mt-0.5">
                Command Center
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-700 mx-2" />

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center text-sm text-slate-400">
            <span>Operations</span>
            <span className="mx-2">→</span>
            <span className="text-white font-medium">Dashboard</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* RIGHT SECTION: Status, Time, Notifications, User */}
        {/* ------------------------------------------------------------------- */}
        <div className="flex items-center space-x-4">
          {/* System Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            <span className="text-green-400 text-sm font-medium">
              OPERATIONAL
            </span>
          </div>

          {/* Date/Time Display */}
          <div className="hidden md:block text-right">
            <div className="text-white font-mono text-sm font-medium">
              {formatTime()} UTC
            </div>
            <div className="text-slate-400 text-xs">
              {formatDate()}
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-700" />

          {/* Vanguard AI Toggle */}
          <button
            onClick={onToggleCopilot}
            className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-900/50 hover:bg-indigo-800/50 border border-indigo-500/30 rounded-lg text-indigo-300 transition-colors group"
            aria-label="Toggle AI Copilot"
          >
            <TerminalSquare className="w-4 h-4 group-hover:text-indigo-200" />
            <span className="text-xs font-mono font-bold tracking-wider hidden md:block">VANGUARD_AI</span>
          </button>

          {/* Notification Bell */}
          <button
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">CM</span>
              </div>

              {/* Name and Rank */}
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-white">Col. Mitchell</div>
                <div className="text-xs text-slate-400">Sector Command</div>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </a>
                <hr className="my-1 border-slate-700" />
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
