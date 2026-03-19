/**
 * =============================================================================
 * VIGILANCE DASHBOARD - NexusGraph Component
 * =============================================================================
 *
 * Real-time Entity Link Analysis (Knowledge Graph).
 * Visualizes hidden relationships between detected entities using force-directed graph.
 *
 * Features:
 * - Nodes for distinct entities (personnel, vehicles, sensors, threats)
 * - Edges for relationships (movement vectors, communications, proximate sightings)
 * - Palantir-style dark aesthetic with glowing links
 * - Interactive zooming, panning, and node dragging
 *
 * =============================================================================
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Network, Maximize2, RefreshCw } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Node {
    id: string;
    group: number;
    label: string;
    val: number; // Size
    status?: 'benign' | 'suspicious' | 'threat';
    type?: 'personnel' | 'vehicle' | 'sensor' | 'location';
}

interface Link {
    source: string;
    target: string;
    value: number; // Weight/thickness
    type?: 'movement' | 'communication' | 'proximity';
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface NexusGraphProps {
    height?: number;
    showControls?: boolean;
}

// =============================================================================
// DEMO DATA
// =============================================================================

const DEMO_GRAPH_DATA: GraphData = {
    nodes: [
        { id: 'cam-01', group: 1, label: 'Camera 01 (Alpha)', val: 20, type: 'sensor' },
        { id: 'cam-02', group: 1, label: 'Camera 02 (Alpha)', val: 20, type: 'sensor' },
        { id: 'rad-01', group: 1, label: 'Radar 01 (Bravo)', val: 20, type: 'sensor' },

        { id: 'veh-trk-1', group: 2, label: 'Unidentified Truck', val: 15, status: 'suspicious', type: 'vehicle' },
        { id: 'veh-suv-2', group: 2, label: 'Convoy SUV', val: 15, status: 'threat', type: 'vehicle' },

        { id: 'per-grp-A', group: 3, label: 'Personnel Group A', val: 12, status: 'threat', type: 'personnel' },
        { id: 'per-ind-1', group: 3, label: 'Lone Individual', val: 10, status: 'suspicious', type: 'personnel' },
        { id: 'per-patrol-1', group: 3, label: 'Friendly Patrol', val: 12, status: 'benign', type: 'personnel' },

        { id: 'loc-outpost-9', group: 4, label: 'Outpost 9', val: 25, type: 'location' },
        { id: 'loc-ridge-n', group: 4, label: 'Northern Ridge', val: 15, type: 'location' },
    ],
    links: [
        // Sensor detections
        { source: 'cam-01', target: 'veh-trk-1', value: 2, type: 'proximity' },
        { source: 'cam-02', target: 'per-grp-A', value: 3, type: 'proximity' },
        { source: 'rad-01', target: 'veh-suv-2', value: 4, type: 'proximity' },

        // Entity relationships (inferred)
        { source: 'veh-trk-1', target: 'per-ind-1', value: 1, type: 'movement' },
        { source: 'veh-suv-2', target: 'per-grp-A', value: 5, type: 'communication' },

        // Location context
        { source: 'per-patrol-1', target: 'loc-outpost-9', value: 2, type: 'proximity' },
        { source: 'veh-suv-2', target: 'loc-ridge-n', value: 3, type: 'movement' },
        { source: 'per-grp-A', target: 'loc-ridge-n', value: 2, type: 'movement' }
    ]
};

// =============================================================================
// COMPONENT
// =============================================================================

const NexusGraph: React.FC<NexusGraphProps> = ({
    height = 400,
    showControls = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const graphRef = useRef<any>();
    const [dimensions, setDimensions] = useState({ width: 800, height: height });
    const [hoverNode, setHoverNode] = useState<Node | null>(null);

    // Auto-resize graph to container width
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width } = entries[0].contentRect;
            setDimensions({ width, height });
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [height]);

    // Graph styling helpers
    const getNodeColor = (node: Node) => {
        if (node.type === 'sensor') return '#3B82F6'; // Blue
        if (node.type === 'location') return '#6B7280'; // Gray

        if (node.status === 'threat') return '#EF4444'; // Red
        if (node.status === 'suspicious') return '#F59E0B'; // Yellow
        return '#10B981'; // Green (Benign)
    };

    const getLinkColor = (link: Link) => {
        if (link.type === 'movement') return 'rgba(239, 68, 68, 0.6)'; // Red-ish
        if (link.type === 'communication') return 'rgba(59, 130, 246, 0.6)'; // Blue-ish
        return 'rgba(156, 163, 175, 0.4)'; // Gray for proximity
    };

    // Custom node rendering for that Palantir feel
    const paintNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const { x, y, val } = node;
        const color = getNodeColor(node as Node);
        const radius = Math.sqrt(val) * 1.5;

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = `${color}33`; // 20% opacity
        ctx.fill();

        // Inner solid node
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();

        // Node Border
        ctx.lineWidth = 1 / globalScale;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Label if high enough scale or hovered
        const isHovered = hoverNode?.id === node.id;
        if (globalScale >= 2 || isHovered) {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Text background for readability
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; // slate-900 with opacity
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
            ctx.fillRect(x - bckgDimensions[0] / 2, y + radius + fontSize / 2, bckgDimensions[0], bckgDimensions[1]);

            ctx.fillStyle = isHovered ? '#ffffff' : '#e2e8f0';
            ctx.fillText(label, x, y + radius + fontSize);
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                    <Network className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-semibold text-white">Nexus Graph Analysis</h2>
                </div>

                {showControls && (
                    <div className="flex items-center space-x-2">
                         <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            onClick={() => {
                                if(graphRef.current) {
                                    graphRef.current.zoomToFit(400, 50);
                                }
                            }}
                            title="Center Graph"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Expand">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Graph Container */}
            <div ref={containerRef} className="relative flex-grow bg-slate-900" style={{ minHeight: height }}>
                {/* Background Grid Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <ForceGraph2D
                    ref={graphRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={DEMO_GRAPH_DATA}
                    nodeRelSize={6}
                    nodeCanvasObject={paintNode}
                    nodePointerAreaPaint={(node: any, color, ctx) => {
                        ctx.fillStyle = color;
                        const bckgDimensions = [Math.sqrt(node.val) * 1.5 * 2, Math.sqrt(node.val) * 1.5 * 2];
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
                    }}
                    linkColor={(link: any) => getLinkColor(link as Link)}
                    linkWidth={(link: any) => (link as Link).value}
                    linkDirectionalParticles={(link: any) => ((link as Link).type === 'movement' || (link as Link).type === 'communication') ? 2 : 0}
                    linkDirectionalParticleSpeed={(link: any) => (link as Link).value * 0.005}
                    linkDirectionalParticleWidth={3}
                    linkDirectionalParticleColor={() => '#ffffff'}
                    onNodeHover={(node: any) => setHoverNode(node as Node | null)}
                    onNodeClick={(node: any) => {
                        // Center on clicked node
                        if (graphRef.current) {
                            graphRef.current.centerAt(node.x, node.y, 1000);
                            graphRef.current.zoom(2, 1000);
                        }
                    }}
                    cooldownTicks={100}
                    d3AlphaDecay={0.02}
                    d3VelocityDecay={0.3}
                />

                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur rounded p-3 text-xs z-10 border border-slate-700">
                    <div className="font-medium text-white mb-2">Entity Ontology</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Sensors</div>
                        <div className="flex items-center"><span className="w-2 h-2 bg-gray-500 mr-2 rounded-sm"></span>Locations</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>Threats</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2 shadow-[0_0_5px_rgba(245,158,11,0.8)]"></span>Suspicious</div>
                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Benign</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-600 font-medium text-white mb-1">Relationships</div>
                     <div className="space-y-1 text-slate-300">
                        <div className="flex items-center">
                            <div className="w-4 h-0.5 bg-red-400 mr-2 opacity-60"></div> Movement
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-0.5 bg-blue-400 mr-2 opacity-60"></div> Comms
                        </div>
                    </div>
                </div>

                {/* Info Overlay for Hovered Node */}
                {hoverNode && (
                    <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-4 w-48 z-10 border border-slate-600 shadow-xl pointer-events-none">
                        <h3 className="font-medium text-white mb-1">{hoverNode.label}</h3>
                        <div className="space-y-1 text-xs text-slate-400">
                            <div className="flex justify-between">
                                <span>Type:</span>
                                <span className="text-white capitalize">{hoverNode.type}</span>
                            </div>
                            {hoverNode.status && (
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className={`capitalize ${
                                        hoverNode.status === 'threat' ? 'text-red-400' :
                                        hoverNode.status === 'suspicious' ? 'text-yellow-400' :
                                        'text-green-400'
                                    }`}>
                                        {hoverNode.status}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Weight:</span>
                                <span className="text-white">{hoverNode.val}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NexusGraph;
