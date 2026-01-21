/**
 * =============================================================================
 * VIGILANCE DASHBOARD - ThreatMap Component
 * =============================================================================
 * 
 * Interactive map showing sensor locations and threat zones.
 * Uses Leaflet with dark theme styling.
 * 
 * Features:
 * - Dark-themed map tiles
 * - Sensor markers with status
 * - Threat zone overlays (red circles)
 * - Clickable popups with details
 * - Sector boundaries
 * 
 * TODO: 
 * - Connect to real sensor API
 * - Add real-time threat position updates
 * - Implement drone tracking
 * =============================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
    Crosshair,
    Radio,
    AlertTriangle,
    Eye,
    RefreshCw,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ThreatMapProps {
    /** Map height */
    height?: string;
    /** Center coordinates [lat, lng] */
    center?: [number, number];
    /** Initial zoom level */
    zoom?: number;
    /** Show controls panel */
    showControls?: boolean;
}

interface Sensor {
    id: string;
    name: string;
    type: 'camera' | 'radar' | 'motion' | 'drone';
    lat: number;
    lng: number;
    status: 'operational' | 'degraded' | 'offline';
    sector: string;
}

interface ThreatZone {
    id: string;
    lat: number;
    lng: number;
    radius: number; // meters
    level: 1 | 2 | 3 | 4 | 5;
    description: string;
}

// =============================================================================
// DEMO DATA
// =============================================================================

/**
 * Demo sensor positions (around a fictional border area)
 * TODO: Replace with API data
 */
const DEMO_SENSORS: Sensor[] = [
    { id: 'cam-01', name: 'Camera 01', type: 'camera', lat: 28.6139, lng: 77.2090, status: 'operational', sector: 'Alpha' },
    { id: 'cam-02', name: 'Camera 02', type: 'camera', lat: 28.6200, lng: 77.2150, status: 'operational', sector: 'Alpha' },
    { id: 'rad-01', name: 'Radar 01', type: 'radar', lat: 28.6050, lng: 77.1950, status: 'operational', sector: 'Bravo' },
    { id: 'rad-02', name: 'Radar 02', type: 'radar', lat: 28.6180, lng: 77.2300, status: 'degraded', sector: 'Charlie' },
    { id: 'mot-01', name: 'Motion 01', type: 'motion', lat: 28.6100, lng: 77.2000, status: 'operational', sector: 'Bravo' },
    { id: 'mot-02', name: 'Motion 02', type: 'motion', lat: 28.6250, lng: 77.2100, status: 'offline', sector: 'Alpha' },
    { id: 'drn-01', name: 'Drone 01', type: 'drone', lat: 28.6150, lng: 77.2050, status: 'operational', sector: 'Alpha' },
];

/**
 * Demo threat zones
 */
const DEMO_THREATS: ThreatZone[] = [
    { id: 'threat-01', lat: 28.6120, lng: 77.2080, radius: 200, level: 4, description: 'Unidentified movement detected' },
    { id: 'threat-02', lat: 28.6200, lng: 77.1980, radius: 300, level: 2, description: 'Suspicious activity - monitoring' },
];

// =============================================================================
// COMPONENT
// =============================================================================

const ThreatMap: React.FC<ThreatMapProps> = ({
    height = 'h-96',
    center = [28.6139, 77.2090], // Default: New Delhi area
    zoom = 14,
    showControls = true,
}) => {
    // ---------------------------------------------------------------------------
    // REFS & STATE
    // ---------------------------------------------------------------------------

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

    // ---------------------------------------------------------------------------
    // HELPERS
    // ---------------------------------------------------------------------------

    /**
     * Get marker icon based on sensor type and status
     */
    const getSensorIcon = (sensor: Sensor): L.DivIcon => {
        const statusColor = sensor.status === 'operational'
            ? '#10B981'
            : sensor.status === 'degraded'
                ? '#F59E0B'
                : '#EF4444';

        const typeEmoji = {
            camera: '📹',
            radar: '📡',
            motion: '🔴',
            drone: '🛸',
        }[sensor.type];

        return L.divIcon({
            className: 'custom-marker',
            html: `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #1f2937;
          border: 2px solid ${statusColor};
          border-radius: 50%;
          box-shadow: 0 0 10px ${statusColor}40;
          font-size: 14px;
        ">
          ${typeEmoji}
        </div>
      `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    /**
     * Get threat zone color based on level
     */
    const getThreatColor = (level: number): string => {
        if (level >= 4) return '#EF4444'; // Critical
        if (level >= 3) return '#F59E0B'; // Warning
        return '#3B82F6'; // Low
    };

    // ---------------------------------------------------------------------------
    // INITIALIZE MAP
    // ---------------------------------------------------------------------------

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Create map instance
        const map = L.map(mapRef.current, {
            center: center,
            zoom: zoom,
            zoomControl: false, // We'll add custom controls
        });

        // Add dark-themed tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap, &copy; CartoDB',
            maxZoom: 19,
        }).addTo(map);

        // Add zoom control to bottom-right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Store reference
        mapInstanceRef.current = map;

        // Add sensors as markers
        DEMO_SENSORS.forEach((sensor) => {
            const marker = L.marker([sensor.lat, sensor.lng], {
                icon: getSensorIcon(sensor),
            }).addTo(map);

            // Add popup
            marker.bindPopup(`
        <div style="background: #1f2937; color: white; padding: 8px; border-radius: 8px; min-width: 150px;">
          <strong style="font-size: 14px;">${sensor.name}</strong>
          <div style="margin-top: 4px; font-size: 12px; color: #9ca3af;">
            <div>Type: ${sensor.type.toUpperCase()}</div>
            <div>Sector: ${sensor.sector}</div>
            <div style="display: flex; align-items: center; margin-top: 4px;">
              <span style="
                width: 8px; 
                height: 8px; 
                border-radius: 50%; 
                background: ${sensor.status === 'operational' ? '#10B981' : sensor.status === 'degraded' ? '#F59E0B' : '#EF4444'};
                margin-right: 6px;
              "></span>
              ${sensor.status.toUpperCase()}
            </div>
          </div>
        </div>
      `, {
                className: 'dark-popup',
            });

            marker.on('click', () => setSelectedSensor(sensor));
        });

        // Add threat zones as circles
        DEMO_THREATS.forEach((threat) => {
            const circle = L.circle([threat.lat, threat.lng], {
                radius: threat.radius,
                color: getThreatColor(threat.level),
                fillColor: getThreatColor(threat.level),
                fillOpacity: 0.2,
                weight: 2,
            }).addTo(map);

            circle.bindPopup(`
        <div style="background: #1f2937; color: white; padding: 8px; border-radius: 8px;">
          <strong style="color: ${getThreatColor(threat.level)};">THREAT LEVEL ${threat.level}</strong>
          <p style="margin-top: 4px; font-size: 12px; color: #9ca3af;">
            ${threat.description}
          </p>
        </div>
      `);
        });

        // Loading complete
        setTimeout(() => setIsLoading(false), 500);

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [center, zoom]);

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Crosshair className="w-5 h-5 text-red-400" />
                    <h2 className="text-lg font-semibold text-white">Tactical Map</h2>
                </div>

                {showControls && (
                    <div className="flex items-center space-x-2">
                        <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            title="Toggle sensors"
                        >
                            <Radio className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            title="Toggle threats"
                        >
                            <AlertTriangle className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className={`relative ${height}`}>
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-900 z-10 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin w-10 h-10 border-2 border-slate-600 border-t-red-500 rounded-full mb-3" />
                            <p className="text-slate-400">Loading tactical map...</p>
                        </div>
                    </div>
                )}

                {/* Leaflet Map */}
                <div ref={mapRef} className="w-full h-full" />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 text-xs z-[1000]">
                    <div className="font-medium text-white mb-2">Legend</div>
                    <div className="space-y-1 text-slate-400">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Operational</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span>Degraded</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>Offline / Threat</span>
                        </div>
                    </div>
                </div>

                {/* Selected Sensor Info */}
                {selectedSensor && (
                    <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-4 w-48 z-[1000]">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-white">{selectedSensor.name}</h3>
                            <button
                                onClick={() => setSelectedSensor(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-1 text-xs text-slate-400">
                            <div className="flex justify-between">
                                <span>Type:</span>
                                <span className="text-white">{selectedSensor.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sector:</span>
                                <span className="text-white">{selectedSensor.sector}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={
                                    selectedSensor.status === 'operational' ? 'text-green-400' :
                                        selectedSensor.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                                }>
                                    {selectedSensor.status}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreatMap;
