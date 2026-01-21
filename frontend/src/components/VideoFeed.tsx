/**
 * =============================================================================
 * VIGILANCE DASHBOARD - VideoFeed Component
 * =============================================================================
 * 
 * Simulated live video feed display with threat classification overlay.
 * 
 * In demo mode: Shows a static image with simulated detection boxes
 * In production: Would connect to actual RTSP/WebRTC streams
 * 
 * Features:
 * - Video feed display (simulated)
 * - Threat classification overlay
 * - Detection bounding boxes
 * - Real-time timestamp
 * - Source selector
 * 
 * TODO:
 * - Integrate with actual video streaming
 * - Connect to YOLOv8 classification API
 * =============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
    Video,
    VideoOff,
    Maximize2,
    Radio,
    Camera,
    AlertTriangle,
    ChevronDown,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface VideoFeedProps {
    /** Feed height */
    height?: string;
    /** Show controls */
    showControls?: boolean;
}

interface Detection {
    id: string;
    label: string;
    confidence: number;
    threatLevel: 1 | 2 | 3 | 4 | 5;
    bbox: { x: number; y: number; width: number; height: number };
}

interface FeedSource {
    id: string;
    name: string;
    type: 'camera' | 'drone' | 'satellite';
    status: 'online' | 'offline';
}

// =============================================================================
// DEMO DATA
// =============================================================================

const DEMO_SOURCES: FeedSource[] = [
    { id: 'cam-01', name: 'Camera 01 - Gate North', type: 'camera', status: 'online' },
    { id: 'cam-02', name: 'Camera 02 - Perimeter East', type: 'camera', status: 'online' },
    { id: 'drone-01', name: 'Drone 01 - Patrol Alpha', type: 'drone', status: 'online' },
    { id: 'drone-02', name: 'Drone 02 - Recon', type: 'drone', status: 'offline' },
    { id: 'sat-01', name: 'Satellite - Sector Overview', type: 'satellite', status: 'online' },
];

const DEMO_DETECTIONS: Detection[] = [
    {
        id: 'det-1',
        label: 'Vehicle - Truck',
        confidence: 94,
        threatLevel: 2,
        bbox: { x: 15, y: 40, width: 25, height: 20 },
    },
    {
        id: 'det-2',
        label: 'Personnel - 2 Individuals',
        confidence: 87,
        threatLevel: 3,
        bbox: { x: 60, y: 55, width: 15, height: 25 },
    },
];

// =============================================================================
// COMPONENT
// =============================================================================

const VideoFeed: React.FC<VideoFeedProps> = ({
    height = 'h-64',
    showControls = true,
}) => {
    // ---------------------------------------------------------------------------
    // STATE
    // ---------------------------------------------------------------------------

    const [selectedSource, setSelectedSource] = useState(DEMO_SOURCES[0]);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRecording, setIsRecording] = useState(true);

    // ---------------------------------------------------------------------------
    // EFFECTS
    // ---------------------------------------------------------------------------

    // Update timestamp every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ---------------------------------------------------------------------------
    // HELPERS
    // ---------------------------------------------------------------------------

    const getThreatColor = (level: number): string => {
        if (level >= 4) return '#EF4444';
        if (level >= 3) return '#F59E0B';
        return '#10B981';
    };

    const formatTimestamp = (): string => {
        return currentTime.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    };

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-semibold text-white">Live Feed</h2>

                    {/* Recording Indicator */}
                    {isRecording && (
                        <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs text-red-400 font-medium">REC</span>
                        </div>
                    )}
                </div>

                {showControls && (
                    <div className="flex items-center space-x-2">
                        {/* Source Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                            >
                                {selectedSource.type === 'camera' && <Camera className="w-4 h-4" />}
                                {selectedSource.type === 'drone' && <Radio className="w-4 h-4" />}
                                <span className="max-w-32 truncate">{selectedSource.name}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown */}
                            {showSourceDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-10 py-1">
                                    {DEMO_SOURCES.map((source) => (
                                        <button
                                            key={source.id}
                                            onClick={() => {
                                                setSelectedSource(source);
                                                setShowSourceDropdown(false);
                                            }}
                                            className={`
                        w-full px-4 py-2 text-left text-sm
                        flex items-center justify-between
                        ${source.status === 'offline' ? 'opacity-50' : 'hover:bg-slate-600'}
                        ${selectedSource.id === source.id ? 'bg-slate-600' : ''}
                      `}
                                            disabled={source.status === 'offline'}
                                        >
                                            <div className="flex items-center space-x-2">
                                                {source.type === 'camera' && <Camera className="w-4 h-4 text-slate-400" />}
                                                {source.type === 'drone' && <Radio className="w-4 h-4 text-slate-400" />}
                                                <span className="text-slate-200">{source.name}</span>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${source.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fullscreen Button */}
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Feed Area */}
            <div className={`relative ${height} bg-slate-900`}>
                {/* Simulated Video Feed - Dark gradient background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
              linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
            `,
                        backgroundBlendMode: 'overlay',
                    }}
                >
                    {/* Scan lines effect */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
                        }}
                    />
                </div>

                {/* Detection Boxes */}
                {DEMO_DETECTIONS.map((detection) => (
                    <div
                        key={detection.id}
                        className="absolute border-2 rounded"
                        style={{
                            left: `${detection.bbox.x}%`,
                            top: `${detection.bbox.y}%`,
                            width: `${detection.bbox.width}%`,
                            height: `${detection.bbox.height}%`,
                            borderColor: getThreatColor(detection.threatLevel),
                            boxShadow: `0 0 10px ${getThreatColor(detection.threatLevel)}40`,
                        }}
                    >
                        {/* Label */}
                        <div
                            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                                backgroundColor: getThreatColor(detection.threatLevel),
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {detection.label} ({detection.confidence}%)
                        </div>

                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 rounded-tl" style={{ borderColor: getThreatColor(detection.threatLevel) }} />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 rounded-tr" style={{ borderColor: getThreatColor(detection.threatLevel) }} />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl" style={{ borderColor: getThreatColor(detection.threatLevel) }} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br" style={{ borderColor: getThreatColor(detection.threatLevel) }} />
                    </div>
                ))}

                {/* Threat Classification Legend */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur rounded p-2 text-xs">
                    <div className="font-medium text-white mb-1">AI Classification</div>
                    <div className="space-y-0.5 text-slate-400">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-400">●</span>
                            <span>Level 1-2: Benign</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-yellow-400">●</span>
                            <span>Level 3: Suspicious</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-red-400">●</span>
                            <span>Level 4-5: Threat</span>
                        </div>
                    </div>
                </div>

                {/* Timestamp Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur rounded px-3 py-1.5 font-mono text-sm text-white">
                    {formatTimestamp()}
                </div>

                {/* Source Info */}
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur rounded px-3 py-1.5 text-xs text-slate-400">
                    SRC: {selectedSource.id.toUpperCase()} | FPS: 30 | 1080p
                </div>

                {/* Crosshair Center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-8 h-8 border border-slate-500 rounded-full" />
                    <div className="absolute w-0.5 h-4 bg-slate-500" />
                    <div className="absolute w-4 h-0.5 bg-slate-500" />
                </div>
            </div>
        </div>
    );
};

export default VideoFeed;
