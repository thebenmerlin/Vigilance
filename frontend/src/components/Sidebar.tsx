/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Sidebar Component
 * =============================================================================
 * 
 * Left sidebar navigation containing:
 * - Navigation menu items with icons
 * - System status indicators
 * - Collapsible functionality
 * 
 * The sidebar has two modes:
 * - Expanded (256px): Shows icons + labels
 * - Collapsed (64px): Shows only icons
 * 
 * Props:
 * - collapsed: Whether sidebar is in collapsed mode
 * - activePage: Currently active page for highlighting
 * - onNavigate: Callback when nav item is clicked
 * - onToggle: Callback to toggle collapse state
 * =============================================================================
 */

import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Target,
  Radio,
  Bell,
  BarChart3,
  Users,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface SidebarProps {
  /** Whether sidebar is collapsed (icons only) */
  collapsed: boolean;
  /** Currently active page */
  activePage: string;
  /** Navigation callback */
  onNavigate: (page: string) => void;
  /** Toggle collapse callback */
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SystemStatus {
  name: string;
  status: number; // 0-100 percentage
  online: boolean;
}

// =============================================================================
// DATA
// =============================================================================

/**
 * Navigation menu items
 * Add new pages here to include them in the sidebar
 */
const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'threats', label: 'Threat Analysis', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'operations', label: 'Operations', icon: <Target className="w-5 h-5" /> },
  { id: 'surveillance', label: 'Surveillance', icon: <Radio className="w-5 h-5" /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'personnel', label: 'Personnel', icon: <Users className="w-5 h-5" /> },
  { id: 'systems', label: 'Systems', icon: <Cpu className="w-5 h-5" /> },
];

/**
 * System status data (demo values)
 * TODO: Replace with real API data
 */
const SYSTEM_STATUS: SystemStatus[] = [
  { name: 'Radar Array', status: 95, online: true },
  { name: 'Communications', status: 87, online: true },
  { name: 'Defense Grid', status: 92, online: true },
  { name: 'Satellite Link', status: 0, online: false },
];

// =============================================================================
// COMPONENT
// =============================================================================

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activePage,
  onNavigate,
  onToggle,
}) => {
  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Get status bar color based on percentage
   */
  const getStatusColor = (status: number, online: boolean): string => {
    if (!online) return 'bg-gray-500';
    if (status >= 90) return 'bg-green-500';
    if (status >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  /**
   * Get status text color based on percentage
   */
  const getStatusTextColor = (status: number, online: boolean): string => {
    if (!online) return 'text-gray-500';
    if (status >= 90) return 'text-green-400';
    if (status >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <aside
      className={`
        fixed left-0 top-16
        h-[calc(100vh-64px)]
        bg-black
        border-r border-slate-700
        transition-all duration-300 ease-in-out
        z-40
        flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* --------------------------------------------------------------------- */}
      {/* Navigation Menu */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex-1 py-4 overflow-y-auto">
        {/* Section Title (hidden when collapsed) */}
        {!collapsed && (
          <h2 className="px-4 text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Command
          </h2>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center
                  ${collapsed ? 'justify-center px-2' : 'px-3'}
                  py-2.5 rounded-lg
                  text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                {/* Icon */}
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>

                {/* Label (hidden when collapsed) */}
                {!collapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* System Status Section */}
      {/* --------------------------------------------------------------------- */}
      <div className={`border-t border-slate-700 ${collapsed ? 'p-2' : 'p-4'}`}>
        {/* Section Title */}
        {!collapsed && (
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            System Status
          </h3>
        )}

        {/* Status Items */}
        <div className="space-y-3">
          {SYSTEM_STATUS.map((system, index) => (
            <div key={index} className={collapsed ? 'flex justify-center' : ''}>
              {collapsed ? (
                /* Collapsed: Show only status indicator */
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(system.status, system.online)}`}
                  title={`${system.name}: ${system.online ? `${system.status}%` : 'Offline'}`}
                />
              ) : (
                /* Expanded: Show full status bar */
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 flex items-center">
                      {system.online ? (
                        <Wifi className="w-3 h-3 mr-1" />
                      ) : (
                        <WifiOff className="w-3 h-3 mr-1" />
                      )}
                      {system.name}
                    </span>
                    <span className={getStatusTextColor(system.status, system.online)}>
                      {system.online ? `${system.status}%` : 'OFF'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getStatusColor(system.status, system.online)}`}
                      style={{ width: `${system.online ? system.status : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Collapse Toggle Button */}
      {/* --------------------------------------------------------------------- */}
      <button
        onClick={onToggle}
        className="
          w-full py-3 
          border-t border-slate-700
          text-slate-400 hover:text-white hover:bg-slate-700
          transition-colors
          flex items-center justify-center
        "
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
