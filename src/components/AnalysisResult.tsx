import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
    const [isIngredientExpanded, setIsIngredientExpanded] = useState(false);
    const [isHealthierOptionExpanded, setIsHealthierOptionExpanded] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
    // Determine intent color and emoji
    const getIntentStyle = () => {
        switch (data.intent) {
            case 'general-health':
                return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '🟢' };
            case 'moderation':
                return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', emoji: '🟡' };
            case 'processed-concern':
                return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', emoji: '🔴' };
            default:
                return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '🟢' };
        }
    };

    const intentStyle = getIntentStyle();

    const getChipStyle = (color: 'green' | 'amber' | 'red') => {
        switch (color) {
            case 'green':
                return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
            case 'amber':
                return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'red':
                return 'bg-red-500/25 text-red-300 border-red-500/40';
        }
    };

    // Process primary insight to add color-coded emphasis
    const processInsight = (text: string) => {
        return text
            .replace(/\*\*very high in added sugar\*\*/gi, '<strong class="font-semibold text-red-400">very high in added sugar</strong>')
            .replace(/\*\*nearly 40% sugar\*\*/gi, '<strong class="font-semibold text-red-400">nearly 40% sugar</strong>')
            .replace(/\*\*high in added sugar\*\*/gi, '<strong class="font-semibold text-red-400">high in added sugar</strong>')
            .replace(/\*\*fortified vitamins\*\*/gi, '<strong class="font-semibold text-emerald-400">fortified vitamins</strong>')
            .replace(/\*\*occasional option\*\*/gi, '<strong class="font-semibold text-amber-300">occasional option</strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    };

    return (
        <div className="relative min-h-screen w-full bg-[#0b0f0e] overflow-y-auto">
            <div className="relative z-10 w-full max-w-2xl mx-auto px-5 py-8 pb-24">
                {/* Minimal Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[#f5f5f5] tracking-tight">Clario</h1>
                    <p className="text-xs text-[#f5f5f5]/50 mt-1">Food clarity, instantly</p>
                </div>

                {/* Inferred Intent Card */}
                <div className={`${intentStyle.bg} border ${intentStyle.border} rounded-2xl p-4 mb-6`}>
                    <p className="text-xs text-[#f5f5f5]/60 mb-2 font-medium">What Clario focused on</p>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{intentStyle.emoji}</span>
                        <h2 className={`text-lg font-bold ${intentStyle.color}`}>{data.intentLabel}</h2>
                    </div>
                    <p className="text-xs text-[#f5f5f5]/50">Based on the ingredients scanned</p>
                </div>

                {/* Primary Insight */}
                <div className="mb-6">
                    <div
                        className="text-[#f5f5f5] text-lg leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: processInsight(data.primaryInsight)
                        }}
                    />
                </div>

                {/* Color-Coded Summary Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {data.summaryChips.map((chip, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${getChipStyle(chip.color)}`}
                        >
                            <span className="mr-1">{chip.emoji}</span>
                            {chip.label}
                        </div>
                    ))}
                </div>

                {/* Why This Matters Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                    <h3 className="text-sm font-semibold text-[#f5f5f5] mb-3">Why this matters</h3>
                    <p className="text-sm text-[#f5f5f5]/70 leading-relaxed">{data.whyItMatters}</p>
                </div>

                {/* Secondary Insight - Something to be aware of */}
                {data.uncertaintyNote && (
                    <div className="bg-white/5 border-l-4 border-amber-500/60 rounded-2xl p-5 mb-6">
                        <div className="flex items-start gap-3 mb-2">
                            <span className="text-lg">🟡</span>
                            <h3 className="text-base font-semibold text-amber-300">Something to be aware of</h3>
                        </div>
                        <p className="text-sm text-[#f5f5f5]/80 leading-relaxed pl-8">
                            The label mentions "Natural Colors", but the source isn't specified.
                            There isn't enough clear research to fully understand the long-term effects of some flavor additives.
                        </p>
                    </div>
                )}

                {/* Optional Follow-up Actions - Always Visible */}
                <div className="flex flex-col gap-3">
                    {/* Explain an ingredient - Accordion */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                        <button
                            onClick={() => {
                                setIsIngredientExpanded(!isIngredientExpanded);
                                if (!isIngredientExpanded) {
                                    setSelectedIngredient(null);
                                }
                            }}
                            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 flex items-center justify-between text-sm text-[#f5f5f5]/70 hover:text-[#f5f5f5] transition-all duration-200"
                        >
                            <span>Explain an ingredient</span>
                            {isIngredientExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {isIngredientExpanded && (
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-t border-blue-500/20 p-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-semibold text-blue-300">Select an ingredient</h3>
                                </div>

                                {/* Ingredient Chips */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['Natural Colors', 'Added Sugar', 'Palm Oil'].map((ingredient) => (
                                        <button
                                            key={ingredient}
                                            onClick={() => setSelectedIngredient(ingredient)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedIngredient === ingredient
                                                ? 'bg-blue-500/30 text-blue-200 border-2 border-blue-400/50'
                                                : 'bg-white/10 text-[#f5f5f5]/70 border border-white/20 hover:bg-white/20'
                                                }`}
                                        >
                                            {ingredient}
                                        </button>
                                    ))}
                                </div>

                                {/* Ingredient Explanation */}
                                {selectedIngredient && (
                                    <div className="bg-white/5 rounded-xl p-4 animate-fade-in">
                                        <p className="text-base font-semibold text-white mb-2">{selectedIngredient}</p>
                                        {selectedIngredient === 'Natural Colors' && (
                                            <>
                                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                                    A broad term for color additives derived from natural sources.
                                                </p>
                                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                                    Because the source isn't specified, it's unclear how consistent or well-studied the additive is.
                                                </p>
                                                <p className="text-sm text-amber-300/80 leading-relaxed">
                                                    This is why Clario flagged it as something to be aware of.
                                                </p>
                                            </>
                                        )}
                                        {selectedIngredient === 'Added Sugar' && (
                                            <>
                                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                                    Sugar added during processing to enhance taste and palatability.
                                                </p>
                                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                                    High amounts can lead to energy spikes and may affect long-term health patterns.
                                                </p>
                                                <p className="text-sm text-red-300/80 leading-relaxed">
                                                    This is why Clario highlighted the high sugar content as a primary concern.
                                                </p>
                                            </>
                                        )}
                                        {selectedIngredient === 'Palm Oil' && (
                                            <>
                                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                                    A vegetable oil commonly used for texture and shelf stability.
                                                </p>
                                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                                    While not inherently harmful, it's often highly processed and may be used in place of healthier fats.
                                                </p>
                                                <p className="text-sm text-amber-300/80 leading-relaxed">
                                                    Clario notes this as part of the overall processing level.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Compare a healthier option - Accordion */}
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setIsHealthierOptionExpanded(!isHealthierOptionExpanded)}
                            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 flex items-center justify-between text-sm text-[#f5f5f5]/70 hover:text-[#f5f5f5] transition-all duration-200"
                        >
                            <span>Compare a healthier option</span>
                            {isHealthierOptionExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>

                        {isHealthierOptionExpanded && (
                            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-t border-emerald-500/20 p-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                    <h3 className="text-sm font-semibold text-emerald-300">Better Choice</h3>
                                </div>
                                <p className="text-sm text-[#f5f5f5]/70 leading-relaxed mb-2">
                                    A similar product with <strong className="text-emerald-400">lower added sugar</strong> and <strong className="text-emerald-400">more whole ingredients</strong> would better support daily nutrition.
                                </p>
                                <p className="text-sm text-[#f5f5f5]/60 leading-relaxed">
                                    Look for options where sugar isn't the first ingredient.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
