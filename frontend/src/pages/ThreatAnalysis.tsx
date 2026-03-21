import React, { useEffect, useState, useMemo, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Target, Activity, MapPin, Eye, ShieldAlert, Cpu } from 'lucide-react';
import { Threat } from '../types';

interface GraphNode {
    id: string;
    label: string;
    group: string;
    color: string;
    val: number;
    threat?: Threat;
}

interface GraphLink {
    source: string;
    target: string;
    type: string;
}

const ThreatAnalysis: React.FC = () => {
    const [threats, setThreats] = useState<Threat[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const graphRef = useRef<any>(null);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/threats');
                if (!res.ok) throw new Error('Failed to fetch threats');
                const data = await res.json();
                setThreats(data.data || []);
            } catch (err) {
                console.error('Error fetching threats graph data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchThreats();
    }, []);

    const graphData = useMemo(() => {
        const nodes: GraphNode[] = [
            { id: 'HQ', label: 'Command Center', group: 'base', color: '#10B981', val: 15 } // Green base
        ];
        const links: GraphLink[] = [];

        // Add unique sectors as nodes
        const sectors = Array.from(new Set(threats.map(t => t.location?.sector || 'Unknown')));
        sectors.forEach(sector => {
            nodes.push({ id: `Sector_${sector}`, label: `Sector ${sector}`, group: 'sector', color: '#3B82F6', val: 10 });
            links.push({ source: 'HQ', target: `Sector_${sector}`, type: 'monitors' });
        });

        // Add threats and link to sectors
        threats.forEach(t => {
            const sectorNodeId = `Sector_${t.location?.sector || 'Unknown'}`;
            const threatNodeId = `Threat_${t.id}`;
            const isHighThreat = t.level >= 4;

            nodes.push({
                id: threatNodeId,
                label: t.classification ? t.classification.toUpperCase() : 'UNKNOWN',
                group: 'threat',
                color: isHighThreat ? '#EF4444' : '#F59E0B',
                val: isHighThreat ? 8 : 5,
                threat: t
            });
            links.push({ source: sectorNodeId, target: threatNodeId, type: 'contains' });
        });

        return { nodes, links };
    }, [threats]);

    const handleNodeClick = (node: any) => {
        setSelectedNode(node);
        if (graphRef.current) {
             graphRef.current.centerAt(node.x, node.y, 1000);
             graphRef.current.zoom(4, 1000);
        }
    };

    if (loading) return <div className="text-white">Loading Graph Intel...</div>;

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden relative shadow-lg">
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-4 py-2 rounded-md border border-slate-700 text-sm font-mono text-slate-300">
                    <div className="flex items-center gap-2 mb-1"><Cpu className="w-4 h-4 text-emerald-400"/> NEURAL GRAPH NET</div>
                    <div>Nodes: {graphData.nodes.length} | Links: {graphData.links.length}</div>
                </div>

                <ForceGraph2D
                    ref={graphRef}
                    graphData={graphData}
                    nodeLabel="label"
                    nodeColor="color"
                    nodeRelSize={6}
                    linkColor={() => 'rgba(255,255,255,0.2)'}
                    linkWidth={1.5}
                    onNodeClick={handleNodeClick}
                    backgroundColor="#000000"
                    width={800}
                    height={800}
                />
            </div>

            <div className="w-full lg:w-96 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg h-full">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                        <Target className="w-6 h-6 text-indigo-400" />
                        Entity Details
                    </h2>

                    {!selectedNode ? (
                         <div className="text-slate-500 flex flex-col items-center justify-center h-48 text-center space-y-4">
                             <Eye className="w-12 h-12 opacity-50" />
                             <p>Select a node on the graph to view intelligence details.</p>
                         </div>
                    ) : (
                         <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                             <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm text-slate-400 font-mono tracking-wider">{selectedNode.group.toUpperCase()}</div>
                                    <div className="text-2xl font-bold text-white">{selectedNode.label}</div>
                                </div>
                                <div className={`w-3 h-3 rounded-full mt-2`} style={{backgroundColor: selectedNode.color, boxShadow: `0 0 10px ${selectedNode.color}`}} />
                             </div>

                             {selectedNode.threat && (
                                 <div className="bg-slate-800 rounded-lg p-4 space-y-4 border border-slate-700">
                                     <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                                         <span className="text-slate-400 text-sm">Threat Level</span>
                                         <span className={`font-bold ${selectedNode.threat.level >= 4 ? 'text-red-400' : 'text-amber-400'}`}>Level {selectedNode.threat.level}</span>
                                     </div>
                                     <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                                         <span className="text-slate-400 text-sm">Confidence</span>
                                         <span className="text-white font-mono">{selectedNode.threat.confidence}%</span>
                                     </div>
                                     <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                                         <span className="text-slate-400 text-sm">First Detected</span>
                                         <span className="text-white text-sm">{new Date(selectedNode.threat.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).replace(',','') + ' IST'}</span>
                                     </div>
                                     <div className="flex items-start gap-2 pt-2">
                                         <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                                         <span className="text-sm text-slate-300">
                                            Sector {selectedNode.threat.location?.sector || 'Unknown'}
                                            <br/>
                                            <span className="text-xs text-slate-500 font-mono">LAT: {selectedNode.threat.location?.lat} LNG: {selectedNode.threat.location?.lng}</span>
                                         </span>
                                     </div>
                                 </div>
                             )}

                            {selectedNode.group === 'sector' && (
                                <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-blue-400" />
                                    <span className="text-slate-300 text-sm">Monitoring sector actively. {threats.filter(t => `Sector_${t.location?.sector}` === selectedNode.id).length} active threats tracked in this zone.</span>
                                </div>
                            )}

                            {selectedNode.threat && selectedNode.threat.level >= 4 && (
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-colors">
                                    <ShieldAlert className="w-5 h-5" />
                                    INITIATE COUNTERMEASURES
                                </button>
                            )}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThreatAnalysis;