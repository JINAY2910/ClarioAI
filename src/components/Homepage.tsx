import { useState, useRef } from 'react';
import { Camera, ArrowUp, Sparkles, ScanLine, Mic } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { type AnalysisData } from './AnalysisResult';

interface HomepageProps {
    onAnalysisComplete: (data: AnalysisData) => void;
}

export const Homepage = ({ onAnalysisComplete }: HomepageProps) => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAnalysis = async (file: File) => {
        try {
            setIsAnalyzing(true);
            const { aiService } = await import('../services/ai');
            const data = await aiService.analyzeImage(file);
            onAnalysisComplete(data);
        } catch (error) {
            console.error(error);
            alert('Failed to analyze image. Please ensure you have configured your API key.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleScan = (dataOrFile: AnalysisData | File) => {
        setIsScannerOpen(false);
        if (dataOrFile instanceof File) {
            handleAnalysis(dataOrFile);
        } else {
            onAnalysisComplete(dataOrFile);
        }
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleAnalysis(file);
        }
    };

    const handleTextSubmit = async () => {
        if (textInput.trim()) {
            const mockData: AnalysisData = {
                intent: 'moderation',
                intentLabel: 'Analysis',
                productName: textInput,
                primaryInsight: 'Text analysis is currently a **preview feature**. Please upload an image for full **ingredient analysis**.',
                summaryChips: [
                    { label: 'Text Search', color: 'amber', emoji: '🔍' },
                    { label: 'Limited Data', color: 'red', emoji: '⚠️' },
                    { label: 'Try Image', color: 'green', emoji: '📸' }
                ],
                whyItMatters: 'Image analysis allows us to read the exact ingredient list on the package.',
                summary: 'Please upload an image for a complete analysis.'
            };
            onAnalysisComplete(mockData);
            setTextInput('');
        }
    };

    return (
        <div className="relative flex flex-col h-full w-full bg-background text-white overflow-hidden selection:bg-emerald-500/30">
            {/* Background Texture/Gradient */}


            {/* Camera Scanner Modal */}
            <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScan} />

            {/* Loading Overlay */}
            {isAnalyzing && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center flex-col gap-6 animate-fade-in">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-t-2 border-l-2 border-emerald-400/50 animate-spin" />
                        <div className="absolute inset-0 rounded-full border-r-2 border-b-2 border-emerald-400/20 animate-spin-reverse" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-white/80 font-light text-lg tracking-wide animate-pulse">Analyzing ingredients...</p>
                </div>
            )}

            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Main Content Scroll Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center pt-8 md:pt-16 px-6 w-full overflow-y-auto scrollbar-hide">
                <div className="w-full max-w-md md:max-w-3xl flex flex-col items-center pb-6">

                    {/* 1. Hero Section - Presence */}
                    <div className="flex flex-col items-center text-center space-y-8 mb-12 animate-fade-in z-10">

                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="relative">

                                <h1 className="relative text-3xl md:text-5xl font-light tracking-wide text-white/95">
                                    Clarity before you choose.
                                </h1>
                            </div>
                            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto tracking-wide">
                                I help you understand what’s really in your food.
                            </p>
                        </div>
                    </div>

                    {/* 2. AI "Alive" State */}
                    <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-white/70 tracking-wide">AI Co-Pilot Active</span>
                        </div>
                    </div>

                    {/* Desktop Layout Split */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-6">
                        {/* 3. Primary Action - Decision Moment */}
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-left hover:bg-white/10 hover:border-white/20 transition-all duration-300 group mb-3 md:mb-0 animate-fade-in h-auto min-h-[140px] md:h-full flex flex-row md:flex-col md:justify-between items-center md:items-start gap-4 md:gap-0"
                            style={{ animationDelay: '0.2s' }}
                        >
                            <div className="flex items-start justify-between shrink-0 w-auto md:w-full">
                                <div className="w-20 h-20 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <ScanLine className="w-10 h-10 md:w-8 md:h-8 text-emerald-400" />
                                </div>
                                <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity text-white/30">
                                    <ArrowUp className="w-6 h-6 rotate-45" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-lg font-medium text-white mb-1 md:mb-1">Check a product</h3>
                                <p className="text-white/40 text-base md:text-sm whitespace-nowrap">Scan, type, or show ingredients</p>
                            </div>
                        </button>

                        {/* 4. Live AI Preview */}
                        <div className="w-full bg-neutral-900/50 border border-white/5 rounded-3xl p-4 md:p-6 mb-3 md:mb-0 animate-fade-in h-auto md:h-full flex flex-col justify-center" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Example Insight</span>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed mb-3 md:mb-4">
                                "This snack is high in sugar and contains palm oil, which may not align with a heart-healthy diet. It’s okay occasionally."
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['High sugar', 'Processed oils', 'Occasional use'].map((tag, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] text-white/60">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5. Suggested Chips */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-12 mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        {[
                            "Is this okay for diabetics?",
                            "Why does palm oil matter?",
                            "Show a better option"
                        ].map((suggestion, i) => (
                            <button
                                key={i}
                                onClick={() => setTextInput(suggestion)}
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs text-white/50 hover:bg-white/10 hover:text-white hover:border-white/10 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    {/* 6. Minimal Philosophy */}
                    <div className="flex items-center justify-center gap-6 text-[10px] tracking-widest uppercase text-white/20 animate-fade-in min-h-[20px]" style={{ animationDelay: '0.5s' }}>
                        <span>No Data Dumps</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>Always Clear</span>
                    </div>

                </div>
            </div>

            {/* 7. Bottom Interaction Bar - Fixed at bottom of flex column */}
            <div className="z-20 w-full p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent flex-none">
                <div className="max-w-md md:max-w-3xl mx-auto">
                    <div className="relative flex items-center gap-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl shadow-black/50">
                        {/* Camera Trigger */}
                        <button
                            onClick={handleUpload}
                            className="p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        >
                            <Camera className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                            placeholder="Ask ClarioAI or scan..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/30 h-full py-2"
                        />

                        {/* Mic / Send */}
                        <button
                            onClick={() => textInput ? handleTextSubmit() : null}
                            className={`p-3 rounded-full transition-all duration-300 ${textInput ? 'bg-emerald-500 text-white' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
                        >
                            {textInput ? <ArrowUp className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
