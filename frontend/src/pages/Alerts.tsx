import React from 'react';
import AlertsFeed from '../components/AlertsFeed';
import { useAlerts } from '../hooks/useAlerts';
import { Bell, Filter, Search } from 'lucide-react';

const Alerts: React.FC = () => {
    const { alerts, acknowledgeAlert } = useAlerts({ maxAlerts: 100 });

    const criticalCount = alerts.filter(a => a.priority === 'critical').length;
    const highCount = alerts.filter(a => a.priority === 'high').length;
    const mediumCount = alerts.filter(a => a.priority === 'medium').length;

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Bell className="w-8 h-8 text-red-500" />
                        Incidents & Alerts
                    </h1>
                    <p className="text-slate-400 mt-1">Global event log and actionable intelligence alerts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3 py-2 text-slate-300 w-64">
                        <Search className="w-4 h-4 mr-2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search alerts..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-500"
                        />
                    </div>
                    <button className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
                        <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Alerts</div>
                        <div className="text-3xl font-bold text-white">{alerts.length}</div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 border-l-4 border-l-red-500 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
                        <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Critical</div>
                        <div className="text-3xl font-bold text-red-400">{criticalCount}</div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 border-l-4 border-l-orange-500 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
                        <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">High</div>
                        <div className="text-3xl font-bold text-orange-400">{highCount}</div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 border-l-4 border-l-yellow-500 rounded-xl p-5 flex items-center justify-between shadow-lg">
                    <div>
                        <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Medium</div>
                        <div className="text-3xl font-bold text-yellow-400">{mediumCount}</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[500px] border border-slate-700 rounded-xl bg-slate-900 overflow-hidden shadow-2xl relative">
                {/* Embedded Alerts Feed Component */}
                <div className="absolute inset-0">
                    <AlertsFeed />
                </div>
            </div>
        </div>
    );
};

export default Alerts;