/**
 * =============================================================================
 * VIGILANCE DASHBOARD - VanguardAI Component
 * =============================================================================
 *
 * Floating, terminal-like Operational Copilot.
 * Simulates a conversational AI interface for tactical queries.
 *
 * =============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Send, Cpu, Loader } from 'lucide-react';

interface VanguardAIProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
    isTyping?: boolean;
}

// Simulated AI responses based on keywords
const DEMO_RESPONSES: Record<string, string> = {
    'anomaly': "Analyzing anomaly density... Northern Ridge sector shows a 42% increase in electromagnetic interference over the last 4 hours. Correlating with recent unidentified vehicular movement.",
    'intercept': "Drafting intercept protocol. Recommended action: Dispatch Drone Swarm Alpha from Outpost 9. Estimated Time to Intercept (ETI) is 4m 12s. Awaiting authorization to execute.",
    'status': "All primary systems are nominal. Radar-02 in Sector Charlie is showing degraded performance (Signal/Noise ratio below threshold). Maintenance team alerted.",
    'default': "Query received. Processing tactical data streams. Standby...",
};

const VanguardAI: React.FC<VanguardAIProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            sender: 'ai',
            text: 'VANGUARD AI INITIALIZED. Awaiting tactical query...',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate AI thinking
        const thinkingId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: thinkingId,
            sender: 'ai',
            text: '',
            timestamp: new Date(),
            isTyping: true
        }]);

        // Generate response
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let responseText = DEMO_RESPONSES.default;

            for (const key in DEMO_RESPONSES) {
                if (lowerInput.includes(key)) {
                    responseText = DEMO_RESPONSES[key];
                    break;
                }
            }

            setMessages(prev => prev.map(msg =>
                msg.id === thinkingId
                    ? { ...msg, text: responseText, isTyping: false }
                    : msg
            ));
        }, 1500); // 1.5s simulated delay
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-[9999] overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between cursor-default">
                <div className="flex items-center space-x-2">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-mono text-sm font-semibold text-white tracking-wider">VANGUARD_AI // COPILOT</h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] rounded-lg px-3 py-2 text-sm font-mono
                            ${msg.sender === 'user'
                                ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30'
                                : 'bg-slate-800/80 text-green-400 border border-slate-700'
                            }
                        `}>
                            {msg.sender === 'ai' && (
                                <div className="flex items-center space-x-2 mb-1 opacity-50">
                                    <Cpu className="w-3 h-3" />
                                    <span className="text-[10px] tracking-widest">SYS.REP</span>
                                </div>
                            )}

                            {msg.isTyping ? (
                                <div className="flex items-center space-x-2">
                                    <Loader className="w-4 h-4 animate-spin text-green-500" />
                                    <span className="animate-pulse">PROCESSING...</span>
                                </div>
                            ) : (
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-800 border-t border-slate-700">
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-green-500 font-mono text-sm">{'>'}</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter command or query..."
                        className="w-full bg-slate-900 text-green-400 font-mono text-sm border border-slate-700 rounded-lg py-2 pl-8 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 p-1.5 text-slate-400 hover:text-indigo-400 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VanguardAI;
