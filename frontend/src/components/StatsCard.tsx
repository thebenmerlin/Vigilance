/**
 * =============================================================================
 * VIGILANCE DASHBOARD - StatsCard Component
 * =============================================================================
 * 
 * Reusable statistics card component for displaying key metrics.
 * 
 * Features:
 * - Icon display
 * - Title and value
 * - Status indicator (color-coded)
 * - Optional trend indicator (up/down arrow with percentage)
 * 
 * Usage:
 *   <StatsCard
 *     title="Active Alerts"
 *     value={12}
 *     status="critical"
 *     icon={<AlertTriangle />}
 *     change={15}
 *     changeType="increase"
 *   />
 * =============================================================================
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface StatsCardProps {
    /** Card title */
    title: string;
    /** Main value to display */
    value: string | number;
    /** Status affects the indicator color */
    status: 'ok' | 'warning' | 'critical' | 'neutral';
    /** Optional icon to display */
    icon?: React.ReactNode;
    /** Optional description text */
    description?: string;
    /** Percentage change from previous period */
    change?: number;
    /** Direction of change */
    changeType?: 'increase' | 'decrease' | 'neutral';
    /** Whether the card should pulse (for critical status) */
    pulse?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    status,
    icon,
    description,
    change,
    changeType = 'neutral',
}) => {
    // ---------------------------------------------------------------------------
    // HELPERS
    // ---------------------------------------------------------------------------

    /**
     * Get background gradient based on status
     */
    const getStatusGradient = (): string => {
        switch (status) {
            case 'critical':
                return 'from-red-500/10 to-transparent';
            case 'warning':
                return 'from-amber-500/10 to-transparent';
            case 'ok':
                return 'from-green-500/10 to-transparent';
            default:
                return 'from-blue-500/10 to-transparent';
        }
    };

    /**
     * Get status indicator color
     */
    const getIndicatorColor = (): string => {
        switch (status) {
            case 'critical':
                return 'bg-red-500 shadow-red-500/50';
            case 'warning':
                return 'bg-amber-500 shadow-amber-500/50';
            case 'ok':
                return 'bg-green-500 shadow-green-500/50';
            default:
                return 'bg-blue-500 shadow-blue-500/50';
        }
    };

    /**
     * Get change indicator color and icon
     */
    const getChangeStyles = (): { color: string; Icon: React.FC<{ className?: string }> } => {
        switch (changeType) {
            case 'increase':
                return {
                    color: status === 'critical' ? 'text-red-400' : 'text-green-400',
                    Icon: TrendingUp,
                };
            case 'decrease':
                return {
                    color: status === 'critical' ? 'text-green-400' : 'text-red-400',
                    Icon: TrendingDown,
                };
            default:
                return { color: 'text-slate-400', Icon: Minus };
        }
    };

    const changeStyles = getChangeStyles();

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------

    return (
        <div
            className={`
        relative overflow-hidden
        bg-slate-800 border border-slate-700 rounded-xl
        p-5
        transition-all duration-300
        hover:border-slate-600 hover:shadow-lg
        bg-gradient-to-br ${getStatusGradient()}
      `}
        >
            {/* Status Indicator Dot */}
            <div
                className={`
          absolute top-4 right-4
          w-3 h-3 rounded-full
          shadow-lg
          ${getIndicatorColor()}
          ${status === 'critical' ? 'animate-pulse' : ''}
        `}
            />

            {/* Icon */}
            {icon && (
                <div className="text-slate-400 mb-3">
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3 className="text-slate-400 text-sm uppercase tracking-wide font-medium">
                {title}
            </h3>

            {/* Value */}
            <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">
                    {value}
                </span>

                {/* Change Indicator */}
                {change !== undefined && (
                    <span className={`flex items-center text-sm ${changeStyles.color}`}>
                        <changeStyles.Icon className="w-4 h-4 mr-0.5" />
                        {Math.abs(change)}%
                    </span>
                )}
            </div>

            {/* Description */}
            {description && (
                <p className="mt-2 text-slate-500 text-sm">
                    {description}
                </p>
            )}
        </div>
    );
};

export default StatsCard;
