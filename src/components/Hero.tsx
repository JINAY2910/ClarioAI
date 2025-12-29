import { useState, useRef } from 'react';
import { Upload, Keyboard, Mic, Scan } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { type AnalysisData } from './AnalysisResult';

interface HeroProps {
    onAnalysisComplete: (data: AnalysisData) => void;
}

export const Hero = ({ onAnalysisComplete }: HeroProps) => {
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

    const handleVoiceInput = () => {
        console.log('Voice input clicked');
    };

    const handleTextSubmit = async () => {
        if (textInput.trim()) {
            // For now, text search remains mock or we could implement a text-only Gemini call
            // But the user focused on Image upload. We'll keep the mock for text for stability unless requested.
            // Actually, let's keep the mock generator for TEXT input as fallback/demo
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
        <div className="relative flex flex-col h-screen w-full bg-black px-4 md:px-6">
            {/* Camera Scanner Modal */}
            <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScan} />

            {/* Loading Overlay */}
            {isAnalyzing && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col gap-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
                    <p className="text-white/80 font-medium animate-pulse">Analyzing ingredients...</p>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Section 1: Empty (Top Spacer) - 20% */}
            <div className="flex-[2]" />

            {/* Section 2: Intro - 15% */}
            <div className="flex-[1.5] flex items-center justify-center">
                <div className="text-center space-y-2 animate-fade-in max-w-2xl">
                    <div className="flex items-center justify-center gap-2">
                        <img src="/logo.png" alt="ClarioAI Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain" />
                        <h1 className="text-2xl md:text-4xl font-bold text-white">ClarioAI</h1>
                    </div>
                    <p className="text-sm md:text-base text-white/60">
                        Scan, upload, or search any product for instant health insights.
                    </p>
                </div>
            </div>

            {/* Section 3: Empty (Middle Spacer) - 10% */}
            <div className="flex-[1]" />

            {/* Section 4: Input Section - 35% */}
            <div className="flex-[3.5] flex items-center justify-center">
                <div className="w-full max-w-2xl space-y-4 md:space-y-6">
                    {/* Text Input */}
                    <div className="relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 hover:border-white/20 transition-all duration-300">
                        <Keyboard className="w-5 h-5 text-white/60 flex-shrink-0" />
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                            placeholder="Type a product name..."
                            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-white placeholder-white/40 focus:outline-none min-w-0"
                        />
                    </div>

                    {/* Action Buttons Grid - Scan in Center */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {/* Upload Button - Left */}
                        <button
                            onClick={handleUpload}
                            disabled={isAnalyzing}
                            className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <Upload className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-white">Upload</span>
                        </button>

                        {/* Scan Button - Center */}
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            disabled={isAnalyzing}
                            className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                <Scan className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-white">Scan</span>
                        </button>

                        {/* Voice Button - Right */}
                        <button
                            onClick={handleVoiceInput}
                            disabled={isAnalyzing}
                            className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                                <Mic className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-white">Voice</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 5: Empty (Bottom Spacer) - 20% */}
            <div className="flex-[2]" />
        </div>
    );
};
