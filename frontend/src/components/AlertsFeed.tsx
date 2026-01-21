/**
 * =============================================================================
 * VIGILANCE DASHBOARD - AlertsFeed Component
 * =============================================================================
 * 
 * Real-time alerts feed showing recent security notifications.
 * 
 * Features:
 * - Color-coded priority indicators
 * - Auto-updating (uses useAlerts hook)
 * - Click to acknowledge
 * - Expandable details
 * 
 * Priority Colors:
 * - Critical: Red (pulsing)
 * - High: Orange
 * - Medium: Yellow
 * - Low: Blue
 * - Info: Gray
 * 
 * TODO: Connect to WebSocket for real-time updates
 * =============================================================================
 */

import React, { useState } from 'react';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Info,
} from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import type { Alert, AlertPriority } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

interface AlertsFeedProps {
    /** Maximum number of alerts to display */
    maxItems?: number;
    /** Show header with title */
    showHeader?: boolean;
    /** Enable compact mode */
    compact?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get priority color classes
 */
const getPriorityStyles = (priority: AlertPriority): {
    dot: string;
    text: string;
    bg: string;
    Icon: React.FC<{ className?: string }>;
} => {
    switch (priority) {
        case 'critical':
            return {
                dot: 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50',
                text: 'text-red-400',
                bg: 'bg-red-500/10 border-red-500/30',
                Icon: AlertTriangle,
            };
        case 'high':
            return {
                dot: 'bg-orange-500',
                text: 'text-orange-400',
                bg: 'bg-orange-500/10 border-orange-500/30',
                Icon: AlertCircle,
            };
        case 'medium':
            return {
                dot: 'bg-yellow-500',
                text: 'text-yellow-400',
                bg: 'bg-yellow-500/10 border-yellow-500/30',
                Icon: AlertCircle,
            };
        case 'low':
            return {
                dot: 'bg-blue-500',
                text: 'text-blue-400',
                bg: 'bg-blue-500/10 border-blue-500/30',
                Icon: Info,
            };
        default:
            return {
                dot: 'bg-slate-500',
                text: 'text-slate-400',
                bg: 'bg-slate-500/10 border-slate-500/30',
                Icon: Info,
            };
    }
};

/**
 * Format timestamp to relative time
 */
const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
};

// =============================================================================
// COMPONENT
// =============================================================================

const AlertsFeed: React.FC<AlertsFeedProps> = ({
    maxItems = 10,
    showHeader = true,
    compact = false,
}) => {
    // ---------------------------------------------------------------------------
    // STATE & HOOKS
    // ---------------------------------------------------------------------------

    const { alerts, loading, acknowledgeAlert, unacknowledgedCount } = useAlerts({
        demoMode: true,
        demoInterval: 20000, // New alert every 20 seconds
    });

    const [expandedId, setExpandedId] = useState<string | null>(null);

    // ---------------------------------------------------------------------------
    // HANDLERS
    // ---------------------------------------------------------------------------

    /**
     * Toggle alert expansion
     */
    const handleToggleExpand = (id: string): void => {
        setExpandedId(prev => prev === id ? null : id);
    };

    /**
     * Handle acknowledge click
     */
    const handleAcknowledge = (alert: Alert): void => {
        acknowledgeAlert(alert.id);
    };

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------

    // Take only the first maxItems alerts
    const displayedAlerts = alerts.slice(0, maxItems);

    // Calculate critical/high count
    const urgentCount = (unacknowledgedCount.critical || 0) + (unacknowledgedCount.high || 0);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            {/* Header */}
            {showHeader && (
                <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
                        {urgentCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                                {urgentCount} urgent
                            </span>
                        )}
                    </div>

                    <button className="text-slate-400 hover:text-white text-sm">
                        View All →
                    </button>
                </div>
            )}

            {/* Alerts List */}
            <div className={`divide-y divide-slate-700 ${compact ? 'max-h-64' : 'max-h-96'} overflow-y-auto`}>
                {loading ? (
                    /* Loading State */
                    <div className="p-8 text-center text-slate-400">
                        <div className="animate-spin w-8 h-8 border-2 border-slate-600 border-t-red-500 rounded-full mx-auto mb-3" />
                        Loading alerts...
                    </div>
                ) : displayedAlerts.length === 0 ? (
                    /* Empty State */
                    <div className="p-8 text-center text-slate-400">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-lg font-medium text-white">All Clear</p>
                        <p className="text-sm">No active alerts at this time</p>
                    </div>
                ) : (
                    /* Alert Items */
                    displayedAlerts.map((alert) => {
                        const styles = getPriorityStyles(alert.priority);
                        const isExpanded = expandedId === alert.id;
                        const isNew = alert.status === 'new';
                        const PriorityIcon = styles.Icon;

                        return (
                            <div
                                key={alert.id}
                                className={`
                  p-4 
                  transition-colors
                  ${isNew ? styles.bg : 'hover:bg-slate-700/50'}
                  ${isNew ? 'border-l-2' : 'border-l-2 border-transparent'}
                `}
                            >
                                {/* Main Row */}
                                <div className="flex items-start space-x-3">
                                    {/* Priority Indicator */}
                                    <div className={`w-3 h-3 rounded-full mt-1.5 ${styles.dot}`} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-medium ${isNew ? 'text-white' : 'text-slate-300'}`}>
                                                {alert.title}
                                            </h3>
                                            <span className="text-xs text-slate-500 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {formatTime(alert.timestamp)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                                            {alert.sector} • {alert.source}
                                        </p>
                                    </div>

                                    {/* Expand Button */}
                                    <button
                                        onClick={() => handleToggleExpand(alert.id)}
                                        className="p-1 text-slate-400 hover:text-white"
                                    >
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="mt-3 ml-6 animate-slide-in">
                                        <p className="text-sm text-slate-300 mb-3">
                                            {alert.message}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                <span className="flex items-center">
                                                    <PriorityIcon className={`w-3 h-3 mr-1 ${styles.text}`} />
                                                    {alert.priority.toUpperCase()}
                                                </span>
                                                <span>ID: {alert.id.slice(-8)}</span>
                                            </div>

                                            {isNew && (
                                                <button
                                                    onClick={() => handleAcknowledge(alert)}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                                                >
                                                    Acknowledge
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AlertsFeed;
