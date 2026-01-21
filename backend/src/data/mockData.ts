/**
 * =============================================================================
 * VIGILANCE BACKEND - Mock Data
 * =============================================================================
 * 
 * Comprehensive mock data for demo purposes.
 * 
 * This file contains realistic sample data for:
 * - Threats (with threat levels 1-5)
 * - Alerts (with priority levels)
 * - Sensors (various types and statuses)
 * - Predictions (24-hour threat forecasts)
 * 
 * TODO: Replace with database queries in production
 * =============================================================================
 */

// =============================================================================
// TYPES (duplicated from frontend for standalone use)
// =============================================================================

export type ThreatLevel = 1 | 2 | 3 | 4 | 5;
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved';
export type SensorStatus = 'operational' | 'degraded' | 'offline' | 'maintenance';
export type SensorType = 'drone' | 'camera' | 'radar' | 'motion' | 'thermal' | 'acoustic';

export interface Threat {
    id: string;
    timestamp: string;
    level: ThreatLevel;
    classification: string;
    confidence: number;
    location: {
        lat: number;
        lng: number;
        sector: string;
    };
    source: string;
    description: string;
    isActive: boolean;
}

export interface Alert {
    id: string;
    timestamp: string;
    priority: AlertPriority;
    status: AlertStatus;
    title: string;
    message: string;
    sector: string;
    source: string;
    threatId?: string;
}

export interface Sensor {
    id: string;
    name: string;
    type: SensorType;
    status: SensorStatus;
    location: {
        lat: number;
        lng: number;
    };
    sector: string;
    lastPing: string;
    signalStrength: number;
}

export interface PredictionPoint {
    hour: number;
    timestamp: string;
    threatProbability: number;
    confidence: number;
    sector: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

/**
 * Sample threats - simulating active and historical threats
 */
export const MOCK_THREATS: Threat[] = [
    {
        id: 'threat-001',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        level: 4,
        classification: 'vehicle',
        confidence: 92,
        location: { lat: 28.6120, lng: 77.2080, sector: 'Alpha' },
        source: 'Drone-01',
        description: 'Unidentified vehicle detected approaching perimeter fence at high speed',
        isActive: true,
    },
    {
        id: 'threat-002',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        level: 3,
        classification: 'personnel',
        confidence: 87,
        location: { lat: 28.6200, lng: 77.1980, sector: 'Bravo' },
        source: 'Camera-12',
        description: 'Two individuals observed conducting reconnaissance near checkpoint',
        isActive: true,
    },
    {
        id: 'threat-003',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        level: 2,
        classification: 'animal',
        confidence: 95,
        location: { lat: 28.6050, lng: 77.2150, sector: 'Charlie' },
        source: 'Motion-07',
        description: 'Wildlife detected crossing sensor grid - confirmed non-threat',
        isActive: false,
    },
    {
        id: 'threat-004',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        level: 5,
        classification: 'personnel',
        confidence: 89,
        location: { lat: 28.6180, lng: 77.2300, sector: 'Delta' },
        source: 'Thermal-02',
        description: 'CRITICAL: Armed personnel detected attempting fence breach',
        isActive: false,
    },
];

/**
 * Sample alerts - various priorities
 */
export const MOCK_ALERTS: Alert[] = [
    {
        id: 'alert-001',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        priority: 'critical',
        status: 'new',
        title: 'Perimeter breach detected',
        message: 'Motion sensors triggered in Sector Alpha, Zone 3. Immediate response required.',
        sector: 'Sector Alpha',
        source: 'Motion-03',
        threatId: 'threat-001',
    },
    {
        id: 'alert-002',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        priority: 'high',
        status: 'acknowledged',
        title: 'Unidentified vehicle approaching',
        message: 'Vehicle detected 500m from main gate, no identification signal received.',
        sector: 'Sector Alpha',
        source: 'Radar-01',
    },
    {
        id: 'alert-003',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        priority: 'medium',
        status: 'investigating',
        title: 'Communications interference',
        message: 'Radio signal degradation detected in Sector Bravo. Possible jamming attempt.',
        sector: 'Sector Bravo',
        source: 'Comm-Hub-02',
    },
    {
        id: 'alert-004',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        priority: 'low',
        status: 'resolved',
        title: 'Sensor calibration needed',
        message: 'Camera-15 reporting intermittent focus issues. Maintenance scheduled.',
        sector: 'Sector Charlie',
        source: 'Camera-15',
    },
    {
        id: 'alert-005',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        priority: 'info',
        status: 'resolved',
        title: 'Routine patrol completed',
        message: 'Drone-02 completed sector sweep. All zones clear.',
        sector: 'Sector Delta',
        source: 'Drone-02',
    },
];

/**
 * Sample sensors - various types and statuses
 */
export const MOCK_SENSORS: Sensor[] = [
    // Cameras
    { id: 'cam-01', name: 'Camera 01', type: 'camera', status: 'operational', location: { lat: 28.6139, lng: 77.2090 }, sector: 'Alpha', lastPing: new Date().toISOString(), signalStrength: 98 },
    { id: 'cam-02', name: 'Camera 02', type: 'camera', status: 'operational', location: { lat: 28.6200, lng: 77.2150 }, sector: 'Alpha', lastPing: new Date().toISOString(), signalStrength: 95 },
    { id: 'cam-03', name: 'Camera 03', type: 'camera', status: 'degraded', location: { lat: 28.6180, lng: 77.2300 }, sector: 'Bravo', lastPing: new Date().toISOString(), signalStrength: 72 },

    // Radars
    { id: 'rad-01', name: 'Radar 01', type: 'radar', status: 'operational', location: { lat: 28.6050, lng: 77.1950 }, sector: 'Bravo', lastPing: new Date().toISOString(), signalStrength: 100 },
    { id: 'rad-02', name: 'Radar 02', type: 'radar', status: 'operational', location: { lat: 28.6100, lng: 77.2200 }, sector: 'Charlie', lastPing: new Date().toISOString(), signalStrength: 97 },

    // Motion sensors
    { id: 'mot-01', name: 'Motion 01', type: 'motion', status: 'operational', location: { lat: 28.6100, lng: 77.2000 }, sector: 'Alpha', lastPing: new Date().toISOString(), signalStrength: 94 },
    { id: 'mot-02', name: 'Motion 02', type: 'motion', status: 'offline', location: { lat: 28.6250, lng: 77.2100 }, sector: 'Delta', lastPing: new Date(Date.now() - 3600000).toISOString(), signalStrength: 0 },
    { id: 'mot-03', name: 'Motion 03', type: 'motion', status: 'operational', location: { lat: 28.6080, lng: 77.2050 }, sector: 'Alpha', lastPing: new Date().toISOString(), signalStrength: 91 },

    // Drones
    { id: 'drn-01', name: 'Drone 01', type: 'drone', status: 'operational', location: { lat: 28.6150, lng: 77.2050 }, sector: 'Alpha', lastPing: new Date().toISOString(), signalStrength: 88 },
    { id: 'drn-02', name: 'Drone 02', type: 'drone', status: 'maintenance', location: { lat: 28.6000, lng: 77.2000 }, sector: 'Base', lastPing: new Date(Date.now() - 7200000).toISOString(), signalStrength: 0 },

    // Thermal
    { id: 'thm-01', name: 'Thermal 01', type: 'thermal', status: 'operational', location: { lat: 28.6120, lng: 77.2120 }, sector: 'Bravo', lastPing: new Date().toISOString(), signalStrength: 96 },
    { id: 'thm-02', name: 'Thermal 02', type: 'thermal', status: 'operational', location: { lat: 28.6220, lng: 77.2000 }, sector: 'Charlie', lastPing: new Date().toISOString(), signalStrength: 93 },
];

/**
 * Generate prediction data for next 24 hours
 */
export function generatePredictions(): PredictionPoint[] {
    const predictions: PredictionPoint[] = [];
    const now = new Date();
    const sectors = ['Alpha', 'Bravo', 'Charlie', 'Delta'];

    for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(now.getTime() + hour * 60 * 60 * 1000);
        const hourOfDay = timestamp.getHours();

        // Higher threat probability during night hours
        const nightMultiplier = (hourOfDay >= 22 || hourOfDay <= 5) ? 1.5 : 1;

        sectors.forEach((sector) => {
            const baseProb = {
                'Alpha': 35,
                'Bravo': 28,
                'Charlie': 22,
                'Delta': 18,
            }[sector] || 25;

            // Add some randomness with wave patterns
            const wave = Math.sin(hour / 4 + sectors.indexOf(sector)) * 15;
            const random = Math.random() * 10 - 5;
            const probability = Math.min(95, Math.max(5, (baseProb + wave + random) * nightMultiplier));

            predictions.push({
                hour,
                timestamp: timestamp.toISOString(),
                threatProbability: Math.round(probability),
                confidence: Math.round(85 + Math.random() * 10),
                sector,
            });
        });
    }

    return predictions;
}

/**
 * Get system status overview
 */
export function getSystemStatus() {
    const onlineSensors = MOCK_SENSORS.filter(s => s.status === 'operational').length;
    const degradedSensors = MOCK_SENSORS.filter(s => s.status === 'degraded').length;
    const activeAlerts = MOCK_ALERTS.filter(a => a.status === 'new' || a.status === 'investigating').length;
    const criticalAlerts = MOCK_ALERTS.filter(a => a.priority === 'critical' && a.status === 'new').length;

    return {
        overall: criticalAlerts > 0 ? 'critical' : degradedSensors > 2 ? 'degraded' : 'operational',
        uptime: 86400 * 7, // 7 days in seconds (mock)
        sensorsOnline: onlineSensors,
        sensorsTotal: MOCK_SENSORS.length,
        activeAlerts,
        criticalAlerts,
        personnelOnDuty: 247,
        lastUpdate: new Date().toISOString(),
    };
}
