import React, { useEffect, useState } from 'react';
import { Cpu, Server, Wifi, Battery, Activity, HardDrive } from 'lucide-react';
import { Sensor } from '../types';

const Systems: React.FC = () => {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/sensors');
                if (!res.ok) throw new Error('Failed to fetch sensors');
                const data = await res.json();
                setSensors(data.data || []);
            } catch (err) {
                console.error('Error fetching sensors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSensors();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'degraded': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'offline': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'maintenance': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-sky-500" />
                        System Status
                    </h1>
                    <p className="text-slate-400 mt-1">Global hardware, sensor grid, and server infrastructure health.</p>
                </div>
                <div className="flex gap-4">
                     <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow">
                          <Server className="w-5 h-5 text-indigo-400" />
                          <div>
                              <div className="text-xs text-slate-500 font-mono">CORE UPTIME</div>
                              <div className="font-bold text-white text-sm">99.98%</div>
                          </div>
                     </div>
                     <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 shadow">
                          <Activity className="w-5 h-5 text-emerald-400" />
                          <div>
                              <div className="text-xs text-slate-500 font-mono">LATENCY</div>
                              <div className="font-bold text-white text-sm">24ms</div>
                          </div>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Infrastructure Details */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-4">
                        <HardDrive className="w-6 h-6 text-slate-400" />
                        Command Center Infrastructure
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                             <div className="flex flex-col">
                                 <span className="text-white font-medium flex items-center gap-2"><Server className="w-4 h-4 text-indigo-400"/> Postgres/TimescaleDB</span>
                                 <span className="text-slate-400 text-sm">Telemetry & Events</span>
                             </div>
                             <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                             <div className="flex flex-col">
                                 <span className="text-white font-medium flex items-center gap-2"><Server className="w-4 h-4 text-indigo-400"/> Neo4j Graph DB</span>
                                 <span className="text-slate-400 text-sm">Entity Relationships</span>
                             </div>
                             <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                             <div className="flex flex-col">
                                 <span className="text-white font-medium flex items-center gap-2"><Server className="w-4 h-4 text-indigo-400"/> Redis</span>
                                 <span className="text-slate-400 text-sm">Pub/Sub Cache</span>
                             </div>
                             <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20">ONLINE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                             <div className="flex flex-col">
                                 <span className="text-white font-medium flex items-center gap-2"><Cpu className="w-4 h-4 text-amber-400"/> Vanguard ML Node</span>
                                 <span className="text-slate-400 text-sm">AI Classification Service</span>
                             </div>
                             <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">DEGRADED</span>
                        </div>
                    </div>
                </div>

                {/* Sensor Grid */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg flex flex-col">
                     <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                         <h2 className="text-xl font-bold text-white flex items-center gap-2">
                             <Wifi className="w-6 h-6 text-sky-400" />
                             Sensor Grid Array
                         </h2>
                         <span className="text-slate-400 text-sm">{sensors.length} Active Nodes</span>
                     </div>
                     <div className="flex-1 p-4 overflow-y-auto max-h-[600px] space-y-3">
                         {loading ? (
                             <div className="text-slate-500 text-center py-10">Fetching sensor grid...</div>
                         ) : sensors.map(sensor => (
                             <div key={sensor.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                  <div>
                                      <div className="text-white font-medium flex items-center gap-2">
                                           {sensor.name}
                                           <span className="text-xs font-mono text-slate-500 bg-black px-2 py-0.5 rounded">{sensor.type.toUpperCase()}</span>
                                      </div>
                                      <div className="text-sm text-slate-400 mt-1 font-mono">Sector {sensor.sector} | ID: {sensor.id}</div>
                                  </div>

                                  <div className="flex flex-wrap md:flex-nowrap gap-3 items-center">
                                       <div className="flex items-center gap-1 text-slate-400 text-sm bg-black/50 px-3 py-1.5 rounded-md">
                                            <Wifi className={`w-4 h-4 ${sensor.signalStrength > 80 ? 'text-green-400' : sensor.signalStrength > 30 ? 'text-yellow-400' : 'text-red-400'}`} />
                                            {sensor.signalStrength}%
                                       </div>
                                       <div className="flex items-center gap-1 text-slate-400 text-sm bg-black/50 px-3 py-1.5 rounded-md">
                                            <Battery className="w-4 h-4 text-emerald-400" />
                                            100%
                                       </div>
                                       <div className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono border uppercase ${getStatusColor(sensor.status)}`}>
                                            {sensor.status}
                                       </div>
                                  </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Systems;