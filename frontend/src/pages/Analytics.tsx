import React from 'react';
import PredictionChart from '../components/PredictionChart';
import { BarChart3, Database, LineChart, Shield, ShieldCheck, Target, Zap } from 'lucide-react';

const Analytics: React.FC = () => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-500" />
                        Intelligence Analytics
                    </h1>
                    <p className="text-slate-400 mt-1">Predictive threat modeling and multi-domain analysis dashboards.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Database className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 {/* Top Level Metric Cards */}
                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg flex items-start gap-4">
                     <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                         <Target className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                         <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Identified Targets</div>
                         <div className="text-3xl font-bold text-white">1,204</div>
                         <div className="text-xs text-green-400 mt-1 flex items-center gap-1">+4% this week</div>
                     </div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg flex items-start gap-4">
                     <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                         <ShieldCheck className="w-6 h-6 text-emerald-400" />
                     </div>
                     <div>
                         <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Intercepts</div>
                         <div className="text-3xl font-bold text-white">84</div>
                         <div className="text-xs text-green-400 mt-1 flex items-center gap-1">+12% this week</div>
                     </div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg flex items-start gap-4">
                     <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                         <Zap className="w-6 h-6 text-amber-400" />
                     </div>
                     <div>
                         <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Anomalies Detected</div>
                         <div className="text-3xl font-bold text-white">412</div>
                         <div className="text-xs text-red-400 mt-1 flex items-center gap-1">+2% this week</div>
                     </div>
                 </div>

                 <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-lg flex items-start gap-4">
                     <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                         <LineChart className="w-6 h-6 text-purple-400" />
                     </div>
                     <div>
                         <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Model Accuracy</div>
                         <div className="text-3xl font-bold text-white">96.8%</div>
                         <div className="text-xs text-green-400 mt-1 flex items-center gap-1">+0.4% from last update</div>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg relative overflow-hidden flex flex-col">
                     <div className="p-5 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                         <h2 className="text-lg font-bold text-white flex items-center gap-2">
                             <Shield className="w-5 h-5 text-indigo-400" />
                             Sector Threat Predictions
                         </h2>
                         <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded border border-indigo-500/20 font-mono">LIVE AI FEED</span>
                     </div>
                     <div className="p-4 flex-1 min-h-[400px]">
                         <PredictionChart />
                     </div>
                </div>

                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg relative overflow-hidden flex flex-col">
                     <div className="p-5 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                         <h2 className="text-lg font-bold text-white flex items-center gap-2">
                             <Target className="w-5 h-5 text-emerald-400" />
                             Classification Matrix
                         </h2>
                     </div>
                     <div className="p-8 flex-1 min-h-[400px] flex items-center justify-center">
                         <div className="grid grid-cols-2 gap-4 w-full h-full text-center">
                             <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-center gap-2">
                                 <div className="text-slate-400 font-medium">VEHICLE</div>
                                 <div className="text-4xl font-bold text-white">35%</div>
                                 <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                     <div className="bg-blue-500 h-full w-[35%]"></div>
                                 </div>
                             </div>
                             <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-center gap-2">
                                 <div className="text-slate-400 font-medium">PERSONNEL</div>
                                 <div className="text-4xl font-bold text-white">45%</div>
                                 <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                     <div className="bg-amber-500 h-full w-[45%]"></div>
                                 </div>
                             </div>
                             <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-center gap-2">
                                 <div className="text-slate-400 font-medium">AERIAL</div>
                                 <div className="text-4xl font-bold text-white">12%</div>
                                 <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                     <div className="bg-purple-500 h-full w-[12%]"></div>
                                 </div>
                             </div>
                             <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col justify-center gap-2">
                                 <div className="text-slate-400 font-medium">UNKNOWN</div>
                                 <div className="text-4xl font-bold text-white">8%</div>
                                 <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                     <div className="bg-red-500 h-full w-[8%]"></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;