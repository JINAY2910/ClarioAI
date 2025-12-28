import React from 'react';
import { ArrowLeft, Info, CheckCircle2, Award, Leaf as LeafIcon, Users, Star } from 'lucide-react';

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
    // Mock data for enhanced visuals
    const healthScore = 72;
    const nutritionData = [
        { label: 'Protein', value: 8, max: 20, color: 'blue' },
        { label: 'Fiber', value: 12, max: 25, color: 'green' },
        { label: 'Sugar', value: 18, max: 25, color: 'red' },
        { label: 'Sodium', value: 15, max: 20, color: 'orange' },
    ];

    const alternatives = [
        { name: 'Organic Alternative A', score: 85, price: '+$2.50' },
        { name: 'Budget Option B', score: 68, price: '-$1.20' },
        { name: 'Premium Choice C', score: 92, price: '+$4.00' },
    ];

    const ingredients = [
        { name: 'Whole Wheat Flour', status: 'good' },
        { name: 'Organic Cane Sugar', status: 'moderate' },
        { name: 'Palm Oil', status: 'concern' },
        { name: 'Natural Flavors', status: 'moderate' },
        { name: 'Vitamin B12', status: 'good' },
        { name: 'Preservative E211', status: 'concern' },
    ];

    const certifications = [
        { name: 'USDA Organic', verified: true },
        { name: 'Non-GMO Project', verified: true },
        { name: 'Fair Trade', verified: false },
        { name: 'Gluten-Free', verified: false },
    ];

    const environmentalImpact = {
        carbonFootprint: 'Medium',
        waterUsage: 'Low',
        packaging: 'Recyclable',
        score: 68
    };

    const userReviews = [
        { rating: 4.5, count: 1234, highlight: 'Great taste, but a bit sweet' },
        { rating: 4.0, count: 892, highlight: 'Good value for money' },
        { rating: 3.5, count: 456, highlight: 'Packaging could be better' },
    ];

    return (
        <div className="relative min-h-full w-full bg-black">
            {/* Scrollable Content */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-32 md:pb-36">
                {/* Header with Back Button */}
                <div className="mb-6 md:mb-8">
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">Back to Home</span>
                    </button>
                </div>

                {/* Intent & Product Header */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6 backdrop-blur-xl">
                    <span className="text-xs font-medium text-accent uppercase tracking-wider">Inferred Intent</span>
                    <h2 className="text-xl md:text-3xl font-bold text-white mt-2 mb-3">{data.intent}</h2>
                    <p className="text-white/60 text-base md:text-lg">
                        Analyzing <span className="text-white font-medium">{data.productName}</span>
                    </p>
                </div>

                {/* Health Score Card */}
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-white mb-1">Overall Health Score</h3>
                            <p className="text-xs md:text-sm text-white/60">Based on nutritional analysis and ingredient quality</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 md:w-20 md:h-20">
                                <svg className="transform -rotate-90 w-full h-full">
                                    <circle cx="50%" cy="50%" r="30" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="30"
                                        stroke="#10b981"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray={`${healthScore * 1.88} 188`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl md:text-2xl font-bold text-white">{healthScore}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nutrition Breakdown */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-white mb-4">Nutritional Breakdown</h3>
                    <div className="space-y-3 md:space-y-4">
                        {nutritionData.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-1 md:mb-2">
                                    <span className="text-xs md:text-sm text-white/80">{item.label}</span>
                                    <span className="text-xs md:text-sm text-white/60">{item.value}g / {item.max}g</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full bg-${item.color}-500`}
                                        style={{ width: `${(item.value / item.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ingredients List */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-white mb-4">Ingredients Analysis</h3>
                    <div className="space-y-2">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-lg">
                                <span className="text-sm md:text-base text-white">{ingredient.name}</span>
                                <span className={`text-xs md:text-sm px-2 py-1 rounded-full ${ingredient.status === 'good' ? 'bg-green-500/20 text-green-400' :
                                    ingredient.status === 'concern' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {ingredient.status === 'good' ? '✓ Good' : ingredient.status === 'concern' ? '⚠ Concern' : '○ Moderate'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-base md:text-lg font-semibold text-white">Certifications</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {certifications.map((cert, index) => (
                            <div key={index} className={`p-3 rounded-xl border ${cert.verified ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {cert.verified ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0" />
                                    )}
                                    <span className="text-xs md:text-sm text-white">{cert.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <LeafIcon className="w-5 h-5 text-green-400" />
                        <h3 className="text-base md:text-lg font-semibold text-white">Environmental Impact</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-white/60 mb-1">Carbon Footprint</p>
                            <p className="text-sm md:text-base font-semibold text-white">{environmentalImpact.carbonFootprint}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-white/60 mb-1">Water Usage</p>
                            <p className="text-sm md:text-base font-semibold text-white">{environmentalImpact.waterUsage}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-white/60 mb-1">Packaging</p>
                            <p className="text-sm md:text-base font-semibold text-white">{environmentalImpact.packaging}</p>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-white/60 mb-1">Eco Score</p>
                            <p className="text-sm md:text-base font-semibold text-green-400">{environmentalImpact.score}/100</p>
                        </div>
                    </div>
                </div>

                {/* Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                    {data.insights.map((insight, index) => (
                        <div
                            key={index}
                            className={`bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:bg-white/10 transition-colors duration-300 ${index === 0 ? 'md:col-span-2' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3 md:gap-4">
                                <div className={`p-2 md:p-3 rounded-full bg-${insight.color}-500/20 text-${insight.color}-400 flex-shrink-0`}>
                                    <insight.icon className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">{insight.title}</h3>
                                    <p className="text-sm md:text-base text-white/70 leading-relaxed">{insight.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Reviews Summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h3 className="text-base md:text-lg font-semibold text-white">User Reviews</h3>
                    </div>
                    <div className="space-y-3">
                        {userReviews.map((review, index) => (
                            <div key={index} className="p-3 bg-white/5 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold text-white">{review.rating}</span>
                                    </div>
                                    <span className="text-xs text-white/60">{review.count} reviews</span>
                                </div>
                                <p className="text-sm text-white/70">"{review.highlight}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alternative Suggestions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-white mb-4">Better Alternatives</h3>
                    <div className="space-y-3">
                        {alternatives.map((alt, index) => (
                            <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {alt.score >= 80 ? (
                                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                                    ) : (
                                        <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm md:text-base text-white font-medium truncate">{alt.name}</p>
                                        <p className="text-xs md:text-sm text-white/60">Score: {alt.score}/100</p>
                                    </div>
                                </div>
                                <span className={`text-xs md:text-sm font-medium flex-shrink-0 ml-2 ${alt.price.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                                    {alt.price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Reasoning Summary */}
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs md:text-sm font-medium text-blue-300">AI Reasoning</span>
                    </div>
                    <p className="text-sm md:text-lg text-white/90 italic leading-relaxed">"{data.summary}"</p>
                </div>
            </div>
        </div>
    );
};
