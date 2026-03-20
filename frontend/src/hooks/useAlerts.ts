/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Real-time Alerts Hook
 * =============================================================================
 * 
 * Custom React hook for managing alerts with simulated real-time updates.
 * 
 * In demo mode: Generates fake alerts periodically
 * In production: Would connect to WebSocket for real updates
 * 
 * Usage:
 *   const { alerts, loading, acknowledgeAlert } = useAlerts();
 * 
 * TODO: Replace simulation with actual WebSocket connection
 * =============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import type { Alert, AlertPriority, AlertStatus } from '@/types';

// =============================================================================
// DEMO DATA GENERATION
// =============================================================================

/**
 * Sample alert messages for demo
 */
const DEMO_MESSAGES = [
    { title: 'Perimeter breach detected', priority: 'critical' as AlertPriority },
    { title: 'Motion detected - Sector Alpha', priority: 'high' as AlertPriority },
    { title: 'Unidentified vehicle approaching', priority: 'high' as AlertPriority },
    { title: 'Thermal anomaly detected', priority: 'medium' as AlertPriority },
    { title: 'Communications signal interference', priority: 'medium' as AlertPriority },
    { title: 'Routine patrol completed', priority: 'low' as AlertPriority },
    { title: 'Sensor calibration required', priority: 'info' as AlertPriority },
    { title: 'Drone battery low - returning to base', priority: 'low' as AlertPriority },
];

const SECTORS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
const SOURCES = ['Drone-01', 'Camera-12', 'Radar-03', 'Motion-07', 'Thermal-02'];

/**
 * Generate a random demo alert
 */
function generateDemoAlert(): Alert {
    const template = DEMO_MESSAGES[Math.floor(Math.random() * DEMO_MESSAGES.length)];
    const sector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];

    return {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        priority: template.priority,
        status: 'new' as AlertStatus,
        title: template.title,
        message: `${template.title} in Sector ${sector}. Immediate attention required.`,
        sector: `Sector ${sector}`,
        source,
    };
}

/**
 * Generate initial batch of alerts for demo
 */
function generateInitialAlerts(count: number): Alert[] {
    const alerts: Alert[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
        const alert = generateDemoAlert();
        // Spread out timestamps over the last hour
        const timestamp = new Date(now - Math.random() * 3600000).toISOString();
        alerts.push({
            ...alert,
            id: `alert-init-${i}`,
            timestamp,
            status: i < 3 ? 'new' : ('acknowledged' as AlertStatus),
        });
    }

    // Sort by timestamp descending (newest first)
    return alerts.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

interface UseAlertsOptions {
    /** Enable demo mode with simulated alerts */
    demoMode?: boolean;
    /** Interval for new alert generation in demo mode (ms) */
    demoInterval?: number;
    /** Maximum number of alerts to keep */
    maxAlerts?: number;
}

interface UseAlertsReturn {
    /** List of alerts */
    alerts: Alert[];
    /** Loading state */
    loading: boolean;
    /** Error message if any */
    error: string | null;
    /** Acknowledge an alert */
    acknowledgeAlert: (alertId: string) => void;
    /** Get count of unacknowledged alerts by priority */
    unacknowledgedCount: Record<AlertPriority, number>;
    /** Clear all alerts (for testing) */
    clearAlerts: () => void;
}

/**
 * Custom hook for managing real-time alerts
 */
export function useAlerts(options: UseAlertsOptions = {}): UseAlertsReturn {
    const {
        demoMode = true,
        demoInterval = 15000, // New alert every 15 seconds in demo
        maxAlerts = 50,
    } = options;

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null);

    // ---------------------------------------------------------------------------
    // Initialize alerts
    // ---------------------------------------------------------------------------
    useEffect(() => {
        let mounted = true;

        if (demoMode) {
            // Wait for next tick to avoid synchronous state updates in effect during initial render
            setTimeout(() => {
                if (mounted) {
                    setAlerts(generateInitialAlerts(10));
                    setLoading(false);
                }
            }, 0);
        } else {
            // TODO: Fetch real alerts from API
            // try {
            //   const response = await getAlerts();
            //   if (mounted) setAlerts(response.data);
            // } catch (err) {
            //   if (mounted) setError('Failed to fetch alerts');
            // }
            setTimeout(() => {
                if (mounted) setLoading(false);
            }, 0);
        }

        return () => {
            mounted = false;
        };
    }, [demoMode]);

    // ---------------------------------------------------------------------------
    // Demo mode: Simulate new alerts periodically
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!demoMode) return;

        const interval = setInterval(() => {
            const newAlert = generateDemoAlert();

            setAlerts((prev) => {
                const updated = [newAlert, ...prev];
                // Keep only the most recent alerts
                return updated.slice(0, maxAlerts);
            });

            // Log for debugging
            console.log(`[Demo] New alert: ${newAlert.title}`);
        }, demoInterval);

        return () => clearInterval(interval);
    }, [demoMode, demoInterval, maxAlerts]);

    // ---------------------------------------------------------------------------
    // Acknowledge an alert
    // ---------------------------------------------------------------------------
    const acknowledgeAlert = useCallback((alertId: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId
                    ? {
                        ...alert,
                        status: 'acknowledged' as AlertStatus,
                        acknowledgedAt: new Date().toISOString(),
                        acknowledgedBy: 'Current User', // TODO: Use actual user
                    }
                    : alert
            )
        );
    }, []);

    // ---------------------------------------------------------------------------
    // Calculate unacknowledged counts by priority
    // ---------------------------------------------------------------------------
    const unacknowledgedCount = alerts.reduce(
        (acc, alert) => {
            if (alert.status === 'new') {
                acc[alert.priority] = (acc[alert.priority] || 0) + 1;
            }
            return acc;
        },
        {} as Record<AlertPriority, number>
    );

    // ---------------------------------------------------------------------------
    // Clear all alerts (for testing/demo reset)
    // ---------------------------------------------------------------------------
    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    return {
        alerts,
        loading,
        error,
        acknowledgeAlert,
        unacknowledgedCount,
        clearAlerts,
    };
}

export default useAlerts;
