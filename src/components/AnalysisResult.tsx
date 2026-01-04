import React, { useState } from 'react';
import { Sparkles, ChevronDown, AlertCircle, Info, Brain, Scale, ShieldQuestion } from 'lucide-react';

export interface AnalysisData {
    intent: 'moderation' | 'general-health' | 'processed-concern';
    intentLabel: string;
    productName: string;
    primaryInsight: string;
    whyItMatters: string;
    tradeOffs?: string;
    uncertaintyNote?: string;
    summaryChips?: {
        label: string;
        color: string;
        emoji: string;
    }[];
    suggestedQuestions: string[];
    dataSource?: 'ocr' | 'external' | 'hybrid';
}

interface AnalysisResultProps {
    data: AnalysisData;
    onReset: () => void;
    onSuggestionClick?: (question: string) => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onSuggestionClick }) => {
    const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);
    const [isTradeoffExpanded, setIsTradeoffExpanded] = useState(false);

    const getIntentStyle = () => {
        switch (data.intent) {
            case 'general-health':
                return {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                    icon: Sparkles,
                    gradient: 'from-emerald-500/20 to-teal-500/5'
                };
            case 'moderation':
                return {
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20',
                    icon: Info,
                    gradient: 'from-amber-500/20 to-orange-500/5'
                };
            case 'processed-concern':
                return {
                    color: 'text-rose-400',
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/20',
                    icon: AlertCircle,
                    gradient: 'from-rose-500/20 to-pink-500/5'
                };
            default:
                return {
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                    icon: Sparkles,
                    gradient: 'from-emerald-500/20 to-teal-500/5'
                };
        }
    };

    const style = getIntentStyle();
    const IntentIcon = style.icon;

    // Helper to bold markdown-like text
    const formatText = (text: string) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    };

    return (
        <div className="relative w-full px-5 pt-20 pb-4">

            {/* 1. Summary Card (Co-Pilot Insight) */}
            <div className={`relative overflow-hidden rounded-[24px] p-6 mb-6 border ${style.border} bg-gradient-to-br ${style.gradient}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${style.bg} ${style.color}`}>
                            <IntentIcon size={18} />
                        </div>
                        <div>
                            <span className={`text-xs font-bold tracking-wider uppercase ${style.color}`}>
                                {data.intentLabel}
                            </span>
                            <h2 className="text-white text-lg md:text-xl font-bold leading-tight mt-1">
                                {data.productName}
                            </h2>
                        </div>
                    </div>

                    {data.dataSource === 'external' && (
                        <div className="flex flex-col items-end shrink-0 ml-2">
                            <div className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-emerald-200 flex items-center gap-1.5 font-medium whitespace-nowrap">
                                <Brain size={12} />
                                OpenFoodFacts
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className="text-lg md:text-xl font-medium text-white/90 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatText(data.primaryInsight) }}
                />
            </div>

            {/* 2. Reasoning Engine (Why it matters) */}
            <div className="mb-4">
                <button
                    onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                    className="flex items-center gap-2 mb-3 text-white/50 hover:text-white/80 transition-colors"
                >
                    <Brain size={14} />
                    <span className="text-xs font-bold tracking-widest uppercase">The Reasoning</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isThinkingExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isThinkingExpanded && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-[20px] p-5 animate-slide-down">
                        <p className="text-[15px] font-light text-white/80 leading-7">
                            {data.whyItMatters}
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Trade-offs (If applicable) */}
            {data.tradeOffs && (
                <div className="mb-6">
                    <button
                        onClick={() => setIsTradeoffExpanded(!isTradeoffExpanded)}
                        className="flex items-center gap-2 mb-3 text-white/50 hover:text-white/80 transition-colors"
                    >
                        <Scale size={14} />
                        <span className="text-xs font-bold tracking-widest uppercase">Trade-offs</span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isTradeoffExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isTradeoffExpanded && (
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-[20px] p-5 animate-slide-down">
                            <p className="text-[15px] font-light text-white/80 leading-7">
                                {data.tradeOffs}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* 4. Uncertainty Note */}
            {data.uncertaintyNote && (
                <div className="mb-8 bg-amber-500/[0.05] border border-amber-500/20 rounded-[20px] p-5 flex gap-3">
                    <ShieldQuestion className="text-amber-400 shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-bold text-amber-400 mb-1">Uncertainty Note</h4>
                        <p className="text-sm text-white/70 leading-relaxed">
                            {data.uncertaintyNote}
                        </p>
                    </div>
                </div>
            )}

            {/* 5. Suggested Questions (Chips) */}
            {data.suggestedQuestions && data.suggestedQuestions.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 ml-1">
                        Explore Further
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                        {data.suggestedQuestions.map((question, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSuggestionClick?.(question)}
                                className="px-4 py-2.5 rounded-xl text-[13px] bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 text-left active:scale-95"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
