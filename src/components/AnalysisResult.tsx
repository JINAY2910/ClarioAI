import React from 'react';
import { ArrowRight, X } from 'lucide-react';

export interface AnalysisData {
    intent: string;
    productName: string;
    insights: {
        type: 'matter' | 'tradeoff' | 'uncertainty';
        title: string;
        description: string;
        icon: React.ElementType;
        color: string;
    }[];
    summary: string;
}

interface AnalysisResultProps {
    data: AnalysisData;
    onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in pb-24">
            {/* Header / Intent */}
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 backdrop-blur-xl">
                <button
                    onClick={onReset}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">Inferred Intent</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{data.intent}</h2>
                    <p className="text-white/60 text-lg">Analyzing <span className="text-white font-medium">{data.productName}</span></p>
                </div>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors duration-300 ${index === 0 ? 'md:col-span-2' : ''}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full bg-${insight.color}-500/20 text-${insight.color}-400`}>
                                <insight.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                                <p className="text-white/70 leading-relaxed">{insight.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary / Reasoning Footer */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-sm font-medium text-blue-300">AI Reasoning</span>
                </div>
                <p className="text-lg text-white/90 italic">"{data.summary}"</p>
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-20 flex justify-center bg-gradient-to-t from-black via-black/90 to-transparent pb-8">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                >
                    Scan Another Product <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
