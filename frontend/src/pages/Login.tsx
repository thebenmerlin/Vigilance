import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Shield, Lock, User, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const login = useAppStore(state => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Login failed');
            }

            login(data.data.user, data.data.token);
            navigate('/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '100% 100%, 40px 40px, 40px 40px'
             }}></div>

             <div className="relative z-10 bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                 <div className="flex flex-col items-center mb-8">
                      <div className="bg-red-600 p-3 rounded-lg shadow-lg shadow-red-600/20 mb-4">
                           <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Vigilance</h1>
                      <p className="text-slate-400 text-sm mt-1">Command Center Authentication</p>
                 </div>

                 {error && (
                     <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium">
                         {error}
                     </div>
                 )}

                 <form onSubmit={handleLogin} className="space-y-5">
                     <div className="space-y-2">
                         <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operator ID</label>
                         <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <User className="w-5 h-5 text-slate-500" />
                              </div>
                              <input
                                  type="text"
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                  placeholder="Enter username"
                                  required
                              />
                         </div>
                     </div>

                     <div className="space-y-2">
                         <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passcode</label>
                         <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Lock className="w-5 h-5 text-slate-500" />
                              </div>
                              <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                                  placeholder="Enter password"
                                  required
                              />
                         </div>
                     </div>

                     <button
                         type="submit"
                         disabled={loading}
                         className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SECURE LOGIN'}
                     </button>
                 </form>

                 <div className="mt-8 text-center border-t border-slate-800 pt-6">
                     <p className="text-xs text-slate-500 font-mono">
                         UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
                         <br/>
                         ALL ACTIVITY IS LOGGED AND MONITORED
                     </p>
                 </div>
             </div>
        </div>
    );
};

export default Login;