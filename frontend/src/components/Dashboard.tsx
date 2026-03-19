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

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Users,
  Radar,
  Globe,
  Activity,
} from 'lucide-react';

// Import dashboard components
import StatsCard from './StatsCard';
import ThreatMap from './ThreatMap';
import VideoFeed from './VideoFeed';
import AlertsFeed from './AlertsFeed';
import PredictionChart from './PredictionChart';
import NexusGraph from './NexusGraph';

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

const Dashboard: React.FC = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  /**
   * Dashboard statistics (simulated updates)
   */
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);

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
    return currentTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
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
            {formatDateTime()} UTC
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Last sync: Just now
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* Statistics Cards Row */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Alerts */}
        <StatsCard
          title="Active Alerts"
          value={stats.activeAlerts}
          status={stats.criticalAlerts > 0 ? 'critical' : stats.activeAlerts > 0 ? 'warning' : 'ok'}
          icon={<AlertTriangle className="w-5 h-5" />}
          description={`${stats.criticalAlerts} critical`}
          change={stats.activeAlerts > INITIAL_STATS.activeAlerts ? 15 : -10}
          changeType={stats.activeAlerts > INITIAL_STATS.activeAlerts ? 'increase' : 'decrease'}
        />

        {/* Personnel */}
        <StatsCard
          title="Personnel"
          value={stats.personnel}
          status="ok"
          icon={<Users className="w-5 h-5" />}
          description="On duty"
        />

        {/* Sensors Online */}
        <StatsCard
          title="Sensors Online"
          value={`${sensorPercentage}%`}
          status={sensorPercentage >= 90 ? 'ok' : sensorPercentage >= 70 ? 'warning' : 'critical'}
          icon={<Radar className="w-5 h-5" />}
          description={`${stats.sensorsOnline}/${stats.sensorsTotal} operational`}
        />

        {/* Global Operations */}
        <StatsCard
          title="Global Ops"
          value={stats.globalOps}
          status="neutral"
          icon={<Globe className="w-5 h-5" />}
          description="Active missions"
        />
      </div>

      {/* ===================================================================== */}
      {/* Main Content Grid - Row 1: Map & Video */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tactical Map */}
        <ThreatMap
          height="h-80"
          showControls={true}
        />

        {/* Live Video Feed */}
        <VideoFeed
          height="h-80"
          showControls={true}
        />
      </div>

      {/* ===================================================================== */}
      {/* Main Content Grid - Row 2: Charts & Alerts */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Area (Toggleable) */}
        <div className="flex flex-col space-y-2">
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => setShowNexusGraph(false)}
                    className={`px-3 py-1 text-xs font-medium rounded-t-lg transition-colors ${!showNexusGraph ? 'bg-slate-800 text-white border-t border-x border-slate-700' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                    Predictions
                </button>
                <button
                    onClick={() => setShowNexusGraph(true)}
                    className={`px-3 py-1 text-xs font-medium rounded-t-lg transition-colors ${showNexusGraph ? 'bg-slate-800 text-white border-t border-x border-slate-700' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                    Nexus Graph
                </button>
            </div>
            {showNexusGraph ? (
                <NexusGraph height={280} />
            ) : (
                <PredictionChart
                    height={280}
                    showLegend={true}
                />
            )}
        </div>

        {/* Recent Alerts Feed */}
        <AlertsFeed
          maxItems={8}
          showHeader={true}
        />
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
