/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Main Dashboard Component
 * =============================================================================
 * 
 * The primary view that brings together all dashboard components:
 * - Stats overview cards
 * - Tactical threat map
 * - Live video feed
 * - Alerts feed
 * - Prediction chart
 * 
 * Layout:
 * ┌────────────────────────────────────────────────────────────┐
 * │                     Stats Cards (4)                        │
 * ├───────────────────────────────┬────────────────────────────┤
 * │         Threat Map            │       Video Feed           │
 * ├───────────────────────────────┼────────────────────────────┤
 * │      Prediction Chart         │       Alerts Feed          │
 * └───────────────────────────────┴────────────────────────────┘
 * 
 * All components use demo data in standalone mode.
 * TODO: Connect to backend APIs when available.
 * =============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Responsive as ResponsiveGridLayout, Layout } from 'react-grid-layout';
// @ts-ignore
import { WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  AlertTriangle,
  Users,
  Radar,
  Globe,
  Activity,
  GripHorizontal,
} from 'lucide-react';

// Import dashboard components
import StatsCard from './StatsCard';
import ThreatMap from './ThreatMap';
import VideoFeed from './VideoFeed';
import AlertsFeed from './AlertsFeed';
import PredictionChart from './PredictionChart';
import NexusGraph from './NexusGraph';

// @ts-ignore
const ResponsiveGridLayoutWithWidth = WidthProvider(ResponsiveGridLayout);

// =============================================================================
// TYPES
// =============================================================================

interface DashboardStats {
  activeAlerts: number;
  criticalAlerts: number;
  personnel: number;
  sensorsOnline: number;
  sensorsTotal: number;
  globalOps: number;
}

// =============================================================================
// DEMO DATA
// =============================================================================

/**
 * Initial demo statistics
 * These values simulate a realistic command center scenario
 */
const INITIAL_STATS: DashboardStats = {
  activeAlerts: 3,
  criticalAlerts: 1,
  personnel: 247,
  sensorsOnline: 89,
  sensorsTotal: 100,
  globalOps: 12,
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Panel Wrapper Component
 */
const PanelWrapper = ({ children, title }: { children: React.ReactNode, title?: string }) => (
  <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden group">
    {title && (
      <div className="drag-handle cursor-move bg-slate-800 border-b border-slate-700 px-3 py-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 left-0 right-0 z-10">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</span>
        <GripHorizontal className="w-4 h-4 text-slate-500" />
      </div>
    )}
    <div className={`flex-1 h-full overflow-hidden ${title ? 'pt-8' : ''} drag-handle cursor-move`}>
        {/* Use another div for children so pointer events can interact with content. Dragging only works if there's no interference, so we keep the handle specific. For stats cards, the whole thing is draggable. For others, we only want the top bar to be draggable to allow interaction with map/video/etc. */}
        <div className="h-full pointer-events-auto cursor-auto" onMouseDown={e => e.stopPropagation()}>
           {children}
        </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  /**
   * Dashboard statistics (simulated updates)
   */
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

  /**
   * Layout configuration for React Grid Layout
   */
  const defaultLayouts = useMemo(() => {
    return {
      lg: [
        { i: 'stats-alerts', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3, isResizable: false } as unknown as Layout,
        { i: 'stats-personnel', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3, isResizable: false } as unknown as Layout,
        { i: 'stats-sensors', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3, isResizable: false } as unknown as Layout,
        { i: 'stats-global', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3, isResizable: false } as unknown as Layout,
        { i: 'map', x: 0, y: 4, w: 6, h: 14, minW: 4, minH: 8 } as unknown as Layout,
        { i: 'video', x: 6, y: 4, w: 6, h: 14, minW: 4, minH: 8 } as unknown as Layout,
        { i: 'charts', x: 0, y: 18, w: 6, h: 12, minW: 4, minH: 8 } as unknown as Layout,
        { i: 'alerts', x: 6, y: 18, w: 6, h: 12, minW: 4, minH: 8 } as unknown as Layout
      ],
      md: [
        { i: 'stats-alerts', x: 0, y: 0, w: 5, h: 4, isResizable: false } as unknown as Layout,
        { i: 'stats-personnel', x: 5, y: 0, w: 5, h: 4, isResizable: false } as unknown as Layout,
        { i: 'stats-sensors', x: 0, y: 4, w: 5, h: 4, isResizable: false } as unknown as Layout,
        { i: 'stats-global', x: 5, y: 4, w: 5, h: 4, isResizable: false } as unknown as Layout,
        { i: 'map', x: 0, y: 8, w: 10, h: 14 } as unknown as Layout,
        { i: 'video', x: 0, y: 22, w: 10, h: 14 } as unknown as Layout,
        { i: 'charts', x: 0, y: 36, w: 10, h: 12 } as unknown as Layout,
        { i: 'alerts', x: 0, y: 48, w: 10, h: 12 } as unknown as Layout
      ],
      sm: [
        { i: 'stats-alerts', x: 0, y: 0, w: 6, h: 4, isResizable: false } as unknown as Layout,
        { i: 'stats-personnel', x: 0, y: 4, w: 6, h: 4, isResizable: false } as unknown as Layout,
        { i: 'stats-sensors', x: 0, y: 8, w: 6, h: 4, isResizable: false } as unknown as Layout,
        { i: 'stats-global', x: 0, y: 12, w: 6, h: 4, isResizable: false } as unknown as Layout,
        { i: 'map', x: 0, y: 16, w: 6, h: 14 } as unknown as Layout,
        { i: 'video', x: 0, y: 30, w: 6, h: 14 } as unknown as Layout,
        { i: 'charts', x: 0, y: 44, w: 6, h: 12 } as unknown as Layout,
        { i: 'alerts', x: 0, y: 56, w: 6, h: 12 } as unknown as Layout
      ]
    };
  }, []);

  const [layouts, setLayouts] = useState<Partial<Record<string, Layout>>>(defaultLayouts as unknown as Partial<Record<string, Layout>>);

  const onLayoutChange = (layout: Layout, newLayouts: Partial<Record<string, Layout>>) => {
    setLayouts(newLayouts);
  };

  /**
   * Current date/time for header
   */
  const [currentTime, setCurrentTime] = useState(new Date());

  // Toggle between Nexus Graph and Prediction Chart
  const [showNexusGraph, setShowNexusGraph] = useState(false);

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

  /**
   * Simulate occasional stats updates (demo mode)
   * In production, this would be driven by WebSocket events
   */
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setStats(prev => {
        // Randomly fluctuate values slightly to simulate real-time changes
        const alertChange = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newAlerts = Math.max(0, Math.min(10, prev.activeAlerts + alertChange));

        return {
          ...prev,
          activeAlerts: newAlerts,
          criticalAlerts: Math.floor(newAlerts / 3),
          sensorsOnline: Math.min(prev.sensorsTotal, Math.max(85, prev.sensorsOnline + (Math.random() > 0.9 ? -1 : (Math.random() > 0.9 ? 1 : 0)))),
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  }, []);

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Format date for header display
   */
  const formatDateTime = (): string => {
    return currentTime.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });
  };

  /**
   * Calculate sensor percentage
   */
  const sensorPercentage = Math.round((stats.sensorsOnline / stats.sensorsTotal) * 100);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* Dashboard Header */}
      {/* ===================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2 text-red-500" />
            Command Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time operational overview • All sectors
          </p>
        </div>

        <div className="text-right">
          <div className="text-white font-mono text-sm">
            {formatDateTime()} IST
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Last sync: Just now
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Draggable Dashboard Layout */}
      {/* ===================================================================== */}
      <div className="min-h-[800px]">
          <ResponsiveGridLayoutWithWidth
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              onLayoutChange={onLayoutChange}
              // @ts-ignore
              draggableHandle=".drag-handle"
              margin={[16, 16]}
          >
              <div key="stats-alerts" className="cursor-move drag-handle relative group">
                  <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <GripHorizontal className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="h-full pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
                      <StatsCard
                          title="Active Alerts"
                          value={stats.activeAlerts}
                          status={stats.criticalAlerts > 0 ? 'critical' : stats.activeAlerts > 0 ? 'warning' : 'ok'}
                          icon={<AlertTriangle className="w-5 h-5" />}
                          description={`${stats.criticalAlerts} critical`}
                          change={stats.activeAlerts > INITIAL_STATS.activeAlerts ? 15 : -10}
                          changeType={stats.activeAlerts > INITIAL_STATS.activeAlerts ? 'increase' : 'decrease'}
                      />
                  </div>
              </div>

              <div key="stats-personnel" className="cursor-move drag-handle relative group">
                  <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <GripHorizontal className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="h-full pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
                      <StatsCard
                          title="Personnel"
                          value={stats.personnel}
                          status="ok"
                          icon={<Users className="w-5 h-5" />}
                          description="On duty"
                      />
                  </div>
              </div>

              <div key="stats-sensors" className="cursor-move drag-handle relative group">
                  <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <GripHorizontal className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="h-full pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
                      <StatsCard
                          title="Sensors Online"
                          value={`${sensorPercentage}%`}
                          status={sensorPercentage >= 90 ? 'ok' : sensorPercentage >= 70 ? 'warning' : 'critical'}
                          icon={<Radar className="w-5 h-5" />}
                          description={`${stats.sensorsOnline}/${stats.sensorsTotal} operational`}
                      />
                  </div>
              </div>

              <div key="stats-global" className="cursor-move drag-handle relative group">
                  <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <GripHorizontal className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="h-full pointer-events-auto" onMouseDown={e => e.stopPropagation()}>
                      <StatsCard
                          title="Global Ops"
                          value={stats.globalOps}
                          status="neutral"
                          icon={<Globe className="w-5 h-5" />}
                          description="Active missions"
                      />
                  </div>
              </div>

              <div key="map">
                  <PanelWrapper title="Tactical Map">
                      <ThreatMap
                          height="h-full"
                          showControls={true}
                      />
                  </PanelWrapper>
              </div>

              <div key="video">
                  <PanelWrapper title="Live Video Feed">
                      <VideoFeed
                          height="h-full"
                          showControls={true}
                      />
                  </PanelWrapper>
              </div>

              <div key="charts">
                  <PanelWrapper title="Analytics">
                      <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="text-white font-semibold">Intelligence Hub</h3>
                              <div className="flex space-x-2">
                                  <button
                                      onClick={(e) => { e.stopPropagation(); setShowNexusGraph(false); }}
                                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${!showNexusGraph ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
                                  >
                                      Predictions
                                  </button>
                                  <button
                                      onClick={(e) => { e.stopPropagation(); setShowNexusGraph(true); }}
                                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${showNexusGraph ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
                                  >
                                      Nexus Graph
                                  </button>
                              </div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                              {showNexusGraph ? (
                                  <div className="h-full relative overflow-hidden rounded border border-slate-800">
                                       <NexusGraph height={250} />
                                  </div>
                              ) : (
                                  <div className="h-full relative overflow-hidden">
                                        <PredictionChart height={250} showLegend={true} />
                                  </div>
                              )}
                          </div>
                      </div>
                  </PanelWrapper>
              </div>

              <div key="alerts">
                  <PanelWrapper title="Recent Alerts">
                      <div className="h-full bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-y-auto">
                           <AlertsFeed maxItems={15} showHeader={false} />
                      </div>
                  </PanelWrapper>
              </div>
          </ResponsiveGridLayoutWithWidth>
      </div>

      {/* ===================================================================== */}
      {/* Footer Notes */}
      {/* ===================================================================== */}
      <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-800">
        <p>
          VIGILANCE Command Center • Classification: DEMO MODE •
          System Version 1.0.0 •
          <span className="text-green-500 ml-2">● All Systems Operational</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
