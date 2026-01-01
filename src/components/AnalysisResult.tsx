import React, { useState } from 'react';
import { Sparkles, ChevronDown, AlertCircle, Info } from 'lucide-react';

export interface AnalysisData {
    intent: 'moderation' | 'general-health' | 'processed-concern';
    intentLabel: string;
    productName: string;
    primaryInsight: string;
    summaryChips: {
        label: string;
        color: 'green' | 'amber' | 'red';
        emoji: string;
    }[];
    whyItMatters: string;
    uncertaintyNote?: string;
    summary?: string;
}

interface AnalysisResultProps {
    data: AnalysisData;
    onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
    const [isIngredientExpanded, setIsIngredientExpanded] = useState(false);
    const [isHealthierOptionExpanded, setIsHealthierOptionExpanded] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

    const getIntentStyle = () => {
        switch (data.intent) {
            case 'general-health':
                return { color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/20', shadow: 'shadow-glow-green', icon: Sparkles };
            case 'moderation':
                return { color: 'text-amber-400', gradient: 'from-amber-500/20 to-orange-500/5', border: 'border-amber-500/20', shadow: 'shadow-none', icon: Info };
            case 'processed-concern':
                return { color: 'text-red-400', gradient: 'from-red-500/20 to-rose-500/5', border: 'border-red-500/20', shadow: 'shadow-none', icon: AlertCircle };
            default:
                return { color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/20', shadow: 'shadow-glow-green', icon: Sparkles };
        }
    };

    const intentStyle = getIntentStyle();
    const IntentIcon = intentStyle.icon;

    const processInsight = (text: string) => {
        return text
            .replace(/\*\*very high in added sugar\*\*/gi, '<strong class="font-bold text-red-400 drop-shadow-sm">very high in added sugar</strong>')
            .replace(/\*\*nearly 40% sugar\*\*/gi, '<strong class="font-bold text-red-400 drop-shadow-sm">nearly 40% sugar</strong>')
            .replace(/\*\*high in added sugar\*\*/gi, '<strong class="font-bold text-red-400 drop-shadow-sm">high in added sugar</strong>')
            .replace(/\*\*fortified vitamins\*\*/gi, '<strong class="font-bold text-emerald-400 drop-shadow-sm">fortified vitamins</strong>')
            .replace(/\*\*occasional option\*\*/gi, '<strong class="font-bold text-amber-300 drop-shadow-sm">occasional option</strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    };

    return (
        <div className="relative w-full">
            <div className="relative z-10 px-4 md:px-6 pb-8 pt-20 md:pt-32">
                {/* Header */}
                {/* Header Removed as per user request */}

                {/* Hero Card */}
                <div className={`relative overflow-hidden rounded-[32px] p-1 bg-gradient-to-b from-white/10 to-transparent mb-8 transition-all duration-500 hover:scale-[1.01]`}>
                    <div className={`relative bg-[#0F1211] rounded-[30px] p-6 border ${intentStyle.border}`}>
                        {/* Glow effect */}
                        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${intentStyle.color.split('-')[1]}-500/20 rounded-full blur-[60px]`} />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-full bg-white/5 text-${intentStyle.color.split('-')[1]}-400`}>
                                    <IntentIcon size={18} />
                                </div>
                                <span className="text-xs font-bold tracking-wider text-white/50 uppercase">Analysis Outcome</span>
                            </div>

                            <h2 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${intentStyle.color === 'text-emerald-400' ? 'from-emerald-400 to-teal-200' : intentStyle.color === 'text-amber-400' ? 'from-amber-400 to-orange-200' : 'from-red-400 to-rose-300'} mb-2`}>
                                {data.intentLabel}
                            </h2>
                            <p className="text-sm text-white/50 font-medium">Based on your scan</p>
                        </div>
                    </div>
                </div>

                {/* Insight Text */}
                <div className="mb-8 px-2">
                    <div
                        className="text-white/90 text-lg md:text-xl font-light leading-relaxed tracking-wide"
                        dangerouslySetInnerHTML={{
                            __html: processInsight(data.primaryInsight)
                        }}
                    />
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2.5 mb-10">
                    {data.summaryChips.map((chip, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2.5 rounded-2xl text-[13px] font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 ${chip.color === 'green' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                                chip.color === 'amber' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                                    'bg-red-500/10 text-red-300 border border-red-500/20'
                                }`}
                        >
                            <span className="mr-2 opacity-80">{chip.emoji}</span>
                            {chip.label}
                        </div>
                    ))}
                </div>

                {/* Why This Matters */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-[24px] p-6 mb-6 hover:bg-white/[0.05] transition-colors duration-300">
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Why this matters</h3>
                    <p className="text-[15px] font-light text-white/80 leading-7">{data.whyItMatters}</p>
                </div>

                {/* Uncertainty Note */}
                {data.uncertaintyNote && (
                    <div className="bg-amber-500/[0.05] border border-amber-500/20 rounded-[24px] p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <AlertCircle size={40} className="text-amber-500" />
                        </div>
                        <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            Something to note
                        </h3>
                        <p className="text-sm text-white/70 leading-relaxed pr-4">
                            {data.uncertaintyNote}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                    {/* Explain Ingredient */}
                    <div className={`border transition-all duration-300 rounded-[20px] overflow-hidden ${isIngredientExpanded ? 'border-blue-500/30 bg-blue-500/[0.02]' : 'border-white/5 bg-white/[0.02]'}`}>
                        <button
                            onClick={() => {
                                setIsIngredientExpanded(!isIngredientExpanded);
                                if (!isIngredientExpanded) setSelectedIngredient(null);
                            }}
                            className="w-full py-4 px-5 flex items-center justify-between text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isIngredientExpanded ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'}`}>?</span>
                                Explain an ingredient
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isIngredientExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isIngredientExpanded && (
                            <div className="px-5 pb-5 pt-1 animate-fade-in">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['Natural Colors', 'Added Sugar', 'Palm Oil'].map((ingredient) => (
                                        <button
                                            key={ingredient}
                                            onClick={() => setSelectedIngredient(ingredient)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${selectedIngredient === ingredient
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {ingredient}
                                        </button>
                                    ))}
                                </div>
                                {selectedIngredient && (
                                    <div className="bg-black/20 rounded-xl p-4 text-sm text-white/80 leading-relaxed border border-white/5">
                                        <p>{
                                            selectedIngredient === 'Natural Colors' ? "Derived from natural sources but often processed. The exact source isn't always clear." :
                                                selectedIngredient === 'Added Sugar' ? "Sugar added during processing. It adds empty calories and spikes blood sugar." :
                                                    "A vegetable oil high in saturated fats. Often associated with environmental concerns."
                                        }</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Healthier Option */}
                    <div className={`border transition-all duration-300 rounded-[20px] overflow-hidden ${isHealthierOptionExpanded ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-white/5 bg-white/[0.02]'}`}>
                        <button
                            onClick={() => setIsHealthierOptionExpanded(!isHealthierOptionExpanded)}
                            className="w-full py-4 px-5 flex items-center justify-between text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isHealthierOptionExpanded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                                    <Sparkles size={12} />
                                </span>
                                Compare healthier option
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHealthierOptionExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isHealthierOptionExpanded && (
                            <div className="px-5 pb-5 pt-1 animate-fade-in">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                    <p className="text-sm text-emerald-200">
                                        Try a <span className="font-bold text-white">Whole Grain Bar</span> instead.
                                    </p>
                                    <div className="mt-3 flex gap-4 text-xs text-emerald-200/60">
                                        <div>
                                            <span className="block text-emerald-400 font-bold text-lg">-60%</span>
                                            Sugar
                                        </div>
                                        <div>
                                            <span className="block text-emerald-400 font-bold text-lg">+4g</span>
                                            Fiber
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

