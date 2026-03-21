/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Real-time Alerts Hook
 * =============================================================================
 * 
 * Custom React hook for managing alerts with real-time updates via WebSocket.
 * 
 * Usage:
 *   const { alerts, loading, acknowledgeAlert } = useAlerts();
 * 
 * =============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Alert, AlertPriority, AlertStatus } from '@/types';

interface UseAlertsOptions {
    maxAlerts?: number;
    backendUrl?: string;
}

interface UseAlertsReturn {
    alerts: Alert[];
    loading: boolean;
    error: string | null;
    acknowledgeAlert: (alertId: string) => void;
    unacknowledgedCount: Record<AlertPriority, number>;
    clearAlerts: () => void;
}

export function useAlerts(options: UseAlertsOptions = {}): UseAlertsReturn {
    const {
        maxAlerts = 50,
        backendUrl = 'http://localhost:3001'
    } = options;

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        // Initialize socket connection
        const socket: Socket = io(backendUrl);

        socket.on('connect', () => {
            console.log('[Socket] Connected to real-time feed');
            if (mounted) {
                setLoading(false);
                setError(null);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
            if (mounted) setError('Failed to connect to real-time feed');
        });

        socket.on('alert:new', (payload: { data: Alert }) => {
            if (!mounted) return;

            const newAlert = payload.data;
            setAlerts((prev) => {
                const updated = [newAlert, ...prev];
                return updated.slice(0, maxAlerts);
            });
            console.log(`[Socket] New alert received: ${newAlert.title}`);
        });

        // Cleanup on unmount
        return () => {
            mounted = false;
            socket.disconnect();
        };
    }, [backendUrl, maxAlerts]);

    const acknowledgeAlert = useCallback((alertId: string) => {
        setAlerts((prev) =>
            prev.map((alert) =>
                alert.id === alertId
                    ? {
                        ...alert,
                        status: 'acknowledged' as AlertStatus,
                        acknowledgedAt: new Date().toISOString(),
                        acknowledgedBy: 'Current User',
                    }
                    : alert
            )
        );
    }, []);

    const unacknowledgedCount = alerts.reduce(
        (acc, alert) => {
            if (alert.status === 'new') {
                acc[alert.priority] = (acc[alert.priority] || 0) + 1;
            }
            return acc;
        },
        {} as Record<AlertPriority, number>
    );

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
