import React, { useState } from 'react';
import VideoFeed from '../components/VideoFeed';
import { Camera, Radio, Grid3X3, Maximize, AlertCircle } from 'lucide-react';

const Surveillance: React.FC = () => {
    const [layout, setLayout] = useState<'2x2' | '1x1' | '3x3'>('2x2');

    const renderFeeds = () => {
        const count = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 9;
        const heights = layout === '1x1' ? 'h-[70vh]' : layout === '2x2' ? 'h-72' : 'h-48';

        return Array.from({ length: count }).map((_, idx) => (
            <VideoFeed key={idx} height={heights} showControls={true} />
        ));
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                        <Radio className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Global Surveillance Network</h1>
                        <p className="text-slate-400 text-sm">Real-time spectral and optical feeds from field assets</p>
                    </div>
                </div>

                <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => setLayout('1x1')}
                        className={`p-2 rounded-md transition-colors ${layout === '1x1' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        title="Focus Mode"
                    >
                        <Maximize className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLayout('2x2')}
                        className={`p-2 rounded-md transition-colors ${layout === '2x2' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        title="Quad Grid"
                    >
                        <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLayout('3x3')}
                        className={`p-2 rounded-md transition-colors ${layout === '3x3' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        title="9x9 Grid"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className={`grid gap-4 flex-1 ${layout === '1x1' ? 'grid-cols-1' : layout === '2x2' ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-3 lg:grid-cols-3'}`}>
                {renderFeeds()}
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between shadow-lg text-sm">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-slate-300">System Online</span>
                    </div>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <span className="text-slate-400 font-mono">ENCRYPTION: AES-256</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span>Drone-02 is currently offline</span>
                </div>
            </div>
        </div>
    );
};

export default Surveillance;