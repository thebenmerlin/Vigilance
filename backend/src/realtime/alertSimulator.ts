/**
 * =============================================================================
 * VIGILANCE BACKEND - Real-time Alert Simulator
 * =============================================================================
 * 
 * Generates simulated alerts at random intervals for demo purposes.
 * Broadcasts new alerts via Socket.io to connected clients.
 * 
 * This simulates the behavior of a real threat detection system.
 * 
 * TODO: Replace with actual sensor data processing
 * =============================================================================
 */

import { Server as SocketServer } from 'socket.io';
import { Alert, AlertPriority } from '../data/mockData.js';
import { addAlert } from '../routes/alerts.js';

// =============================================================================
// ALERT TEMPLATES
// =============================================================================

const ALERT_TEMPLATES = [
    { title: 'Perimeter breach detected', priority: 'critical' as AlertPriority },
    { title: 'Motion detected in restricted zone', priority: 'high' as AlertPriority },
    { title: 'Unidentified vehicle approaching', priority: 'high' as AlertPriority },
    { title: 'Thermal anomaly detected', priority: 'medium' as AlertPriority },
    { title: 'Communications signal interference', priority: 'medium' as AlertPriority },
    { title: 'Sensor calibration drift detected', priority: 'low' as AlertPriority },
    { title: 'Routine patrol checkpoint', priority: 'info' as AlertPriority },
    { title: 'Wildlife detected crossing grid', priority: 'low' as AlertPriority },
    { title: 'Drone battery level warning', priority: 'low' as AlertPriority },
    { title: 'Camera feed quality degraded', priority: 'medium' as AlertPriority },
];

const SECTORS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
const SOURCES = ['Drone-01', 'Drone-02', 'Camera-12', 'Camera-15', 'Radar-01', 'Motion-03', 'Thermal-02'];

// =============================================================================
// ALERT GENERATOR
// =============================================================================

/**
 * Generate a random demo alert
 */
function generateRandomAlert(): Alert {
    const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const sector = SECTORS[Math.floor(Math.random() * SECTORS.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];

    return {
        id: `alert-sim-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        timestamp: new Date().toISOString(),
        priority: template.priority,
        status: 'new',
        title: template.title,
        message: `${template.title} in Sector ${sector}. Source: ${source}. Immediate assessment required.`,
        sector: `Sector ${sector}`,
        source,
    };
}

// =============================================================================
// SIMULATOR
// =============================================================================

/**
 * Start the alert simulator
 * Generates alerts at random intervals (15-45 seconds)
 * 
 * @param io - Socket.io server instance
 */
export function startAlertSimulator(io: SocketServer): void {
    console.log('[AlertSimulator] Started - generating demo alerts');

    function scheduleNextAlert(): void {
        // Random interval between 15-45 seconds
        const delay = 15000 + Math.random() * 30000;

        setTimeout(() => {
            // Generate new alert
            const alert = generateRandomAlert();

            // Add to in-memory store
            addAlert(alert);

            // Broadcast to all connected clients
            io.emit('alert:new', {
                event: 'alert:new',
                data: alert,
                timestamp: new Date().toISOString(),
            });

            // Log for debugging
            console.log(`[AlertSimulator] New alert: ${alert.priority.toUpperCase()} - ${alert.title}`);

            // Schedule next alert
            scheduleNextAlert();
        }, delay);
    }

    // Start the cycle
    scheduleNextAlert();
}
