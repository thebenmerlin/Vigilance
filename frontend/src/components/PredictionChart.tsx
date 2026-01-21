/**
 * =============================================================================
 * VIGILANCE DASHBOARD - PredictionChart Component
 * =============================================================================
 * 
 * Line chart showing threat predictions over the next 24 hours.
 * Uses Recharts for rendering.
 * 
 * Features:
 * - 24-hour timeline
 * - Multiple sector lines
 * - Confidence intervals
 * - Interactive tooltips
 * - Risk threshold indicators
 * 
 * TODO: Connect to backend prediction API
 * =============================================================================
 */

import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PredictionChartProps {
    /** Chart height */
    height?: number;
    /** Show legend */
    showLegend?: boolean;
}

interface PredictionData {
    hour: string;
    time: string;
    sectorAlpha: number;
    sectorBravo: number;
    sectorCharlie: number;
    average: number;
}

interface PeakPrediction {
    sector: string;
    time: string;
    probability: number;
    color: string;
}

// =============================================================================
// DEMO DATA
// =============================================================================

/**
 * Generate demo prediction data for 24 hours
 * In production, this would come from the backend AI model
 */
const generateDemoData = (): PredictionData[] => {
    const data: PredictionData[] = [];
    const baseDate = new Date();

    for (let i = 0; i < 24; i++) {
        const time = new Date(baseDate.getTime() + i * 60 * 60 * 1000);
        const hour = time.getHours();

        // Simulate higher threats during night hours
        const nightMultiplier = (hour >= 22 || hour <= 5) ? 1.5 : 1;

        // Generate realistic-looking wave patterns
        const alphaBase = 30 + Math.sin(i / 3) * 15 + Math.random() * 10;
        const bravoBase = 25 + Math.sin((i + 2) / 4) * 20 + Math.random() * 10;
        const charlieBase = 20 + Math.cos(i / 5) * 10 + Math.random() * 8;

        data.push({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            time: time.toISOString(),
            sectorAlpha: Math.min(95, Math.max(10, alphaBase * nightMultiplier)),
            sectorBravo: Math.min(95, Math.max(10, bravoBase * nightMultiplier)),
            sectorCharlie: Math.min(95, Math.max(10, charlieBase * nightMultiplier)),
            average: 0, // Will calculate below
        });
    }

    // Calculate averages
    data.forEach((d) => {
        d.average = Math.round((d.sectorAlpha + d.sectorBravo + d.sectorCharlie) / 3);
    });

    return data;
};

const DEMO_DATA = generateDemoData();

/**
 * Find peak predictions
 */
const findPeaks = (data: PredictionData[]): PeakPrediction[] => {
    const peaks: PeakPrediction[] = [];

    // Find max for each sector
    let maxAlpha = { value: 0, hour: '' };
    let maxBravo = { value: 0, hour: '' };
    let maxCharlie = { value: 0, hour: '' };

    data.forEach((d) => {
        if (d.sectorAlpha > maxAlpha.value) maxAlpha = { value: d.sectorAlpha, hour: d.hour };
        if (d.sectorBravo > maxBravo.value) maxBravo = { value: d.sectorBravo, hour: d.hour };
        if (d.sectorCharlie > maxCharlie.value) maxCharlie = { value: d.sectorCharlie, hour: d.hour };
    });

    peaks.push({ sector: 'Alpha', time: maxAlpha.hour, probability: maxAlpha.value, color: '#EF4444' });
    peaks.push({ sector: 'Bravo', time: maxBravo.hour, probability: maxBravo.value, color: '#F59E0B' });
    peaks.push({ sector: 'Charlie', time: maxCharlie.hour, probability: maxCharlie.value, color: '#3B82F6' });

    return peaks;
};

const PEAK_PREDICTIONS = findPeaks(DEMO_DATA);

// =============================================================================
// COMPONENT
// =============================================================================

const PredictionChart: React.FC<PredictionChartProps> = ({
    height = 300,
    showLegend = true,
}) => {
    // ---------------------------------------------------------------------------
    // STATE
    // ---------------------------------------------------------------------------

    const [selectedSector, setSelectedSector] = useState<string | null>(null);

    // ---------------------------------------------------------------------------
    // CUSTOM TOOLTIP
    // ---------------------------------------------------------------------------

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload) return null;

        return (
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                <p className="text-white font-medium mb-2">{label} UTC</p>
                <div className="space-y-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between space-x-4 text-sm">
                            <div className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-slate-400">{entry.name}:</span>
                            </div>
                            <span className="font-mono text-white">{Math.round(entry.value)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">24-Hour Threat Prediction</h2>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>AI Model v2.1</span>
                    </div>
                </div>

                {/* Peak Predictions Summary */}
                <div className="mt-3 flex items-center space-x-4">
                    {PEAK_PREDICTIONS.map((peak) => (
                        <div
                            key={peak.sector}
                            className="flex items-center space-x-2 text-xs"
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: peak.color }}
                            />
                            <span className="text-slate-400">
                                {peak.sector}: <span className="text-white font-medium">{Math.round(peak.probability)}%</span> @ {peak.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="p-4">
                <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={DEMO_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        {/* Grid */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                            vertical={false}
                        />

                        {/* Axes */}
                        <XAxis
                            dataKey="hour"
                            stroke="#6B7280"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            tickLine={false}
                            interval={2}
                        />
                        <YAxis
                            stroke="#6B7280"
                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />

                        {/* Tooltip */}
                        <Tooltip content={<CustomTooltip />} />

                        {/* High Risk Threshold Line */}
                        <ReferenceLine
                            y={70}
                            stroke="#EF4444"
                            strokeDasharray="5 5"
                            label={{ value: 'High Risk', fill: '#EF4444', fontSize: 10, position: 'right' }}
                        />

                        {/* Sector Areas */}
                        <Area
                            type="monotone"
                            dataKey="sectorAlpha"
                            name="Sector Alpha"
                            stroke="#EF4444"
                            fill="#EF4444"
                            fillOpacity={0.1}
                            strokeWidth={selectedSector === 'alpha' || !selectedSector ? 2 : 1}
                            opacity={selectedSector === 'alpha' || !selectedSector ? 1 : 0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="sectorBravo"
                            name="Sector Bravo"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            fillOpacity={0.1}
                            strokeWidth={selectedSector === 'bravo' || !selectedSector ? 2 : 1}
                            opacity={selectedSector === 'bravo' || !selectedSector ? 1 : 0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="sectorCharlie"
                            name="Sector Charlie"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.1}
                            strokeWidth={selectedSector === 'charlie' || !selectedSector ? 2 : 1}
                            opacity={selectedSector === 'charlie' || !selectedSector ? 1 : 0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            {showLegend && (
                <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-center space-x-6">
                    {[
                        { key: 'alpha', label: 'Sector Alpha', color: '#EF4444' },
                        { key: 'bravo', label: 'Sector Bravo', color: '#F59E0B' },
                        { key: 'charlie', label: 'Sector Charlie', color: '#3B82F6' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setSelectedSector(
                                selectedSector === item.key ? null : item.key
                            )}
                            className={`
                flex items-center space-x-2 px-3 py-1 rounded-full text-sm
                transition-colors
                ${selectedSector === item.key
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }
              `}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PredictionChart;
