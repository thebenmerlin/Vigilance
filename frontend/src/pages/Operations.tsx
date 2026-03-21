import React from 'react';
import { Shield, Map, Radio, Database } from 'lucide-react';

const Operations: React.FC = () => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-8 h-8 text-blue-500" />
                        Operations Center
                    </h1>
                    <p className="text-slate-400 mt-1">Multi-domain command execution and mission planning.</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Left Panel - Live Missions */}
                 <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg flex flex-col">
                      <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                          <h2 className="text-lg font-bold text-white flex items-center gap-2">
                              <Map className="w-5 h-5 text-indigo-400" />
                              Active Missions
                          </h2>
                      </div>
                      <div className="p-4 flex-1 space-y-3 overflow-y-auto">
                           {[
                               { id: 'OP-ECHO-1', status: 'IN PROGRESS', type: 'Reconnaissance', location: 'Sector Delta' },
                               { id: 'OP-ECHO-2', status: 'PLANNING', type: 'Asset Extraction', location: 'Sector Alpha Grid 9' },
                               { id: 'OP-ECHO-3', status: 'STANDBY', type: 'Perimeter Sweep', location: 'Sector Bravo' },
                           ].map((op, idx) => (
                               <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                   <div className="flex justify-between items-start mb-2">
                                       <span className="text-white font-bold">{op.id}</span>
                                       <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                           op.status === 'IN PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                           op.status === 'PLANNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                           'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                       }`}>{op.status}</span>
                                   </div>
                                   <div className="text-slate-400 text-sm mb-1">{op.type}</div>
                                   <div className="text-slate-500 text-xs font-mono">{op.location}</div>
                               </div>
                           ))}
                      </div>
                 </div>

                 {/* Middle Panel - Operations Map Placeholder */}
                 <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-xl shadow-lg relative overflow-hidden flex flex-col items-center justify-center">
                      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur px-3 py-1.5 rounded border border-slate-700 text-sm font-mono text-slate-300 shadow flex items-center gap-2">
                          <Radio className="w-4 h-4 text-emerald-400 animate-pulse"/> TACTICAL MAP FEED LIVE
                      </div>

                      {/* Stylized Map Background */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
                      }}></div>

                      <div className="text-center space-y-4 z-10 max-w-sm">
                           <Database className="w-16 h-16 text-slate-600 mx-auto" />
                           <h3 className="text-xl font-bold text-white">GIS Map Integration Required</h3>
                           <p className="text-slate-400 text-sm">Tactical geospatial layers are currently unavailable. Connect to the military GIS server to render live terrain and unit markers.</p>
                           <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors mt-2">
                               Connect GIS Source
                           </button>
                      </div>
                 </div>
            </div>
        </div>
    );
};

export default Operations;