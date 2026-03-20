import React from 'react';
import { Shield, ShieldAlert, BadgeInfo, Building2, MapPin, User, PhoneCall, Radio } from 'lucide-react';

const Personnel: React.FC = () => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <User className="w-8 h-8 text-teal-500" />
                        Personnel & Assets
                    </h1>
                    <p className="text-slate-400 mt-1">Live tracking and roster management for active units.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Deployment Stats */}
                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg text-center">
                      <div className="bg-teal-500/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border border-teal-500/20">
                          <Shield className="w-8 h-8 text-teal-400" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">247</div>
                      <div className="text-slate-400 font-medium tracking-wider text-sm uppercase">Total Deployed</div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg text-center">
                      <div className="bg-blue-500/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                          <Building2 className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">42</div>
                      <div className="text-slate-400 font-medium tracking-wider text-sm uppercase">Base Staff</div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg text-center">
                      <div className="bg-orange-500/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border border-orange-500/20">
                          <ShieldAlert className="w-8 h-8 text-orange-400" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">12</div>
                      <div className="text-slate-400 font-medium tracking-wider text-sm uppercase">QRF Squads</div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg text-center">
                      <div className="bg-purple-500/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
                          <Radio className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="text-4xl font-bold text-white mb-2">100%</div>
                      <div className="text-slate-400 font-medium tracking-wider text-sm uppercase">Comm Uptime</div>
                 </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl shadow-lg flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <BadgeInfo className="w-5 h-5 text-teal-400" />
                        Active Patrol Roster
                    </h2>
                    <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md border border-slate-600 shadow">Filter: ALL SQUADS</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Unit / Call Sign</th>
                                <th className="p-4 font-medium">Commander</th>
                                <th className="p-4 font-medium">Sector Location</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-800/50">
                            {[
                                { squad: 'Alpha-1', lead: 'Sgt. J. Miller', loc: 'Sector Alpha Grid 4A', status: 'PATROL' },
                                { squad: 'Bravo-2', lead: 'Cpt. S. Rogers', loc: 'Sector Bravo Perimeter', status: 'QRF STANDBY' },
                                { squad: 'Charlie-1', lead: 'Lt. K. Thorne', loc: 'Sector Charlie Checkpoint', status: 'ENGAGED' },
                                { squad: 'Delta-3', lead: 'Sgt. M. Vance', loc: 'Base Perimeter North', status: 'PATROL' },
                                { squad: 'Echo-9', lead: 'Cpl. T. Rike', loc: 'Sector Delta Recon', status: 'OFFLINE' },
                            ].map((unit, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-bold text-white">{unit.squad}</td>
                                    <td className="p-4 text-slate-300 flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-500"/> {unit.lead}
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono">
                                        <div className="flex items-center gap-2">
                                             <MapPin className="w-4 h-4 text-indigo-400"/> {unit.loc}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold border ${
                                            unit.status === 'PATROL' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            unit.status === 'QRF STANDBY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            unit.status === 'ENGAGED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                            {unit.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 transition-colors" title="Hail Comm">
                                            <PhoneCall className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Personnel;