/**
 * =============================================================================
 * VIGILANCE DASHBOARD - TypeScript Type Definitions
 * =============================================================================
 * 
 * This file contains all TypeScript interfaces and types used across the app.
 * 
 * Naming conventions:
 * - Interfaces start with capital letter (Threat, Alert, etc.)
 * - Enums use SCREAMING_SNAKE_CASE for values
 * - Generic types end with 'Type' suffix
 * 
 * TODO: These types should match your backend API response schemas
 * =============================================================================
 */

// =============================================================================
// THREAT CLASSIFICATION
// =============================================================================

/**
 * Threat levels following military classification standard
 * Level 1: No threat (benign activity)
 * Level 2: Low threat (suspicious activity)
 * Level 3: Moderate threat (potential hostile)
 * Level 4: High threat (confirmed hostile)
 * Level 5: Critical threat (immediate danger)
 */
export type ThreatLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Threat classification result from AI engine
 */
export interface Threat {
    id: string;
    timestamp: string;           // ISO 8601 format
    level: ThreatLevel;
    classification: string;      // e.g., "vehicle", "personnel", "animal"
    confidence: number;          // 0-100 percentage
    location: {
        lat: number;
        lng: number;
        sector: string;            // e.g., "Sector Alpha"
    };
    source: string;              // e.g., "Drone-01", "Camera-12"
    description: string;
    imageUrl?: string;           // Optional frame capture
    isActive: boolean;           // Whether threat is ongoing
}

// =============================================================================
// ALERTS
// =============================================================================

/**
 * Alert priority levels
 */
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * Alert status
 */
export type AlertStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved';

/**
 * System alert notification
 */
export interface Alert {
    id: string;
    timestamp: string;
    priority: AlertPriority;
    status: AlertStatus;
    title: string;
    message: string;
    sector: string;
    source: string;
    threatId?: string;           // Optional link to related threat
    acknowledgedBy?: string;     // Username who acknowledged
    acknowledgedAt?: string;     // When acknowledged
}

// =============================================================================
// SENSORS
// =============================================================================

/**
 * Sensor operational status
 */
export type SensorStatus = 'operational' | 'degraded' | 'offline' | 'maintenance';

/**
 * Types of sensors in the system
 */
export type SensorType =
    | 'drone'
    | 'camera'
    | 'radar'
    | 'motion'
    | 'thermal'
    | 'acoustic'
    | 'satellite';

/**
 * Sensor device information
 */
export interface Sensor {
    id: string;
    name: string;
    type: SensorType;
    status: SensorStatus;
    location: {
        lat: number;
        lng: number;
        altitude?: number;         // For drones/aircraft
    };
    sector: string;
    lastPing: string;            // Last health check timestamp
    batteryLevel?: number;       // For mobile sensors
    signalStrength: number;      // 0-100 percentage
    metadata: {
        model?: string;
        firmware?: string;
        deployedAt?: string;
    };
}

// =============================================================================
// PREDICTIONS
// =============================================================================

/**
 * Prediction data point for timeline chart
 */
export interface PredictionPoint {
    timestamp: string;           // ISO 8601 format
    hour: number;                // Hour of day (0-23)
    threatProbability: number;   // 0-100 percentage
    confidence: number;          // Model confidence 0-100
    sector: string;
    factors: string[];           // Contributing factors
}

/**
 * Prediction summary for a sector
 */
export interface SectorPrediction {
    sector: string;
    next24Hours: PredictionPoint[];
    peakThreatTime: string;
    peakThreatProbability: number;
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
}

// =============================================================================
// SYSTEM STATUS
// =============================================================================

/**
 * Overall system status for dashboard header
 */
export interface SystemStatus {
    overall: 'operational' | 'degraded' | 'critical' | 'offline';
    uptime: number;              // Seconds since last restart
    sensorsOnline: number;
    sensorsTotal: number;
    activeAlerts: number;
    criticalAlerts: number;
    personnelOnDuty: number;
    lastUpdate: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    };
    timestamp: string;
}

// =============================================================================
// DASHBOARD STATS
// =============================================================================

/**
 * Single stat card data
 */
export interface StatCard {
    id: string;
    title: string;
    value: string | number;
    change?: number;             // Percentage change from previous period
    changeType?: 'increase' | 'decrease' | 'neutral';
    status: 'ok' | 'warning' | 'critical';
    icon?: string;
}

// =============================================================================
// USER & AUTH (Future Implementation)
// =============================================================================

/**
 * User role in the system
 */
export type UserRole = 'operator' | 'analyst' | 'commander' | 'admin';

/**
 * User profile (for future auth implementation)
 */
export interface User {
    id: string;
    username: string;
    displayName: string;
    role: UserRole;
    rank?: string;               // Military rank
    clearanceLevel: number;      // 1-5
    avatar?: string;
}

// =============================================================================
// WEBSOCKET EVENTS
// =============================================================================

/**
 * WebSocket event types for real-time updates
 */
export type WebSocketEventType =
    | 'alert:new'
    | 'alert:updated'
    | 'threat:detected'
    | 'threat:resolved'
    | 'sensor:status'
    | 'system:status';

/**
 * WebSocket message payload
 */
export interface WebSocketMessage<T = unknown> {
    event: WebSocketEventType;
    data: T;
    timestamp: string;
}
