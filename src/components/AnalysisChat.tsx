import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, type AnalysisData } from './AnalysisResult';
import { Input } from './Input';
import { Bot, User, Sparkles } from 'lucide-react';

interface AnalysisChatProps {
    data: AnalysisData;
    onReset: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export const AnalysisChat: React.FC<AnalysisChatProps> = ({ data, onReset }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        setTimeout(scrollToBottom, 50); // Small delay to allow layout update
    }, [messages]);

    const handleSend = async (text: string) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateMockResponse(text),
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 2000);
    };

    const generateMockResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('sugar')) {
            return "The sugar content is high (approx. 40%), which is the main concern here. This accounts for a large portion of the daily recommended limit. Would you like a low-sugar recommendation?";
        }
        return "That's a great question. Based on the ingredients, Clario suggests looking at the overall balance. Is there a specific ingredient you want to know more about?";
    };

    return (
        <div className="flex flex-col h-full w-full bg-black relative overflow-hidden font-sans text-primary selection:bg-emerald-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth">
                <div className="max-w-xl mx-auto w-full">
                    {/* 1. Analysis Result (Context) */}
                    <AnalysisResult data={data} onReset={onReset} />

                    {/* 2. Chat Section */}
                    {messages.length > 0 && (
                        <div className="px-6 fade-in duration-700">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Discussion</span>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-md shadow-lg ${msg.role === 'assistant'
                                            ? 'bg-gradient-to-tr from-emerald-500/20 to-blue-600/20 border border-white/10 text-emerald-400'
                                            : 'bg-white/5 border border-white/5 text-white/80'
                                            }`}>
                                            {msg.role === 'assistant' ? <Sparkles size={14} fill="currentColor" className="opacity-80" /> : <User size={14} />}
                                        </div>

                                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm backdrop-blur-md transition-all duration-300 ${msg.role === 'assistant'
                                                ? 'bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl rounded-tl-none text-white/90'
                                                : 'bg-white text-black font-medium rounded-2xl rounded-tr-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-white/20 mt-1.5 px-1 font-medium tracking-wide">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex gap-3 animate-pulse">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                                            <Bot size={14} className="text-white/40" />
                                        </div>
                                        <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Floating Input Dock */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pb-2 pt-24 px-4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                <div className="max-w-xl mx-auto w-full pointer-events-auto">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[28px] p-1.5 shadow-2xl shadow-black/50 ring-1 ring-white/5 transform transition-all hover:bg-white/[0.12] hover:scale-[1.01]">
                        <Input onSend={handleSend} />
                    </div>

                    <button
                        onClick={onReset}
                        className="w-full text-center mt-2 text-[11px] font-semibold tracking-widest text-white/30 hover:text-white/60 transition-colors uppercase py-1 cursor-pointer"
                    >
                        Start New Scan
                    </button>
                </div>
            </div>
        </div>
    );
};
