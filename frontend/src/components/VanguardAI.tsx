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
import { fetchWithAuth } from '../store';
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

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        const thinkingId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: thinkingId,
            sender: 'ai',
            text: '',
            timestamp: new Date(),
            isTyping: true
        }]);

        try {
            const response = await fetchWithAuth('/api/ml/chat', {
                method: 'POST',
                body: JSON.stringify({
                    session_id: 'default',
                    message: userMsg.text,
                    context: { active_sector: 'All' }
                })
            });

            if (!response.ok) throw new Error('Failed to connect to ML Copilot');

            const data = await response.json();

            setMessages(prev => prev.map(msg =>
                msg.id === thinkingId
                    ? { ...msg, text: data.response, isTyping: false }
                    : msg
            ));

        } catch (error: any) {
            setMessages(prev => prev.map(msg =>
                msg.id === thinkingId
                    ? { ...msg, text: `ERR_CONNECTION_FAILED: ${error.message}`, isTyping: false }
                    : msg
            ));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-[9999] overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
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
