import { useState } from 'react';
import { Send, Image as ImageIcon, Search, Zap, Mic, Camera, Pizza, Coffee, Smartphone } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { AnalysisResult, type AnalysisData } from './AnalysisResult';

export const Hero = () => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

    const handleScan = (data: AnalysisData) => {
        setAnalysisData(data);
        setIsScannerOpen(false);
    };

    if (analysisData) {
        return (
            <div className="relative min-h-screen w-full bg-black overflow-y-auto">
                {/* Re-use Galaxy Background for consistency */}
                <div className="fixed inset-0 pointer-events-none z-0 bg-black overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] opacity-20 animate-rotate-slow">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-blue-900/20 to-transparent blur-3xl rounded-full" />
                    </div>
                </div>

                <div className="relative z-10 pt-10">
                    <AnalysisResult data={analysisData} onReset={() => setAnalysisData(null)} />
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
            {/* Galaxy Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-black overflow-hidden">
                {/* Rotating Galaxy Container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] opacity-40 animate-rotate-slow">
                    {/* Spiral Arms / Gradient Blobs */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-blue-900/20 to-transparent blur-3xl rounded-full" />
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/30 via-transparent to-transparent blur-2xl rounded-full transform rotate-45" />
                    <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent blur-2xl rounded-full" />
                </div>

                {/* Stars/Particles Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-white rounded-full animate-pulse opacity-80" style={{ animationDuration: '3s' }} />
                    <div className="absolute top-[80%] left-[20%] w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse opacity-60" style={{ animationDuration: '4s' }} />
                    <div className="absolute top-[15%] right-[25%] w-1 h-1 bg-white rounded-full animate-pulse opacity-70" style={{ animationDuration: '2.5s' }} />
                    <div className="absolute top-[60%] right-[10%] w-2 h-2 bg-purple-200 rounded-full animate-pulse opacity-50" style={{ animationDuration: '5s' }} />
                    <div className="absolute bottom-[30%] left-[50%] w-1 h-1 bg-white rounded-full animate-pulse opacity-90" style={{ animationDuration: '3.5s' }} />
                </div>

                {/* Floating Elements (Food/Tech) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[15%] left-[15%] opacity-20 animate-float" style={{ animationDelay: '0s' }}>
                        <Pizza className="w-12 h-12 text-orange-400 rotate-12" />
                    </div>
                    <div className="absolute top-[25%] right-[20%] opacity-20 animate-float" style={{ animationDelay: '2s' }}>
                        <Smartphone className="w-10 h-10 text-blue-400 -rotate-12" />
                    </div>
                    <div className="absolute bottom-[20%] left-[25%] opacity-20 animate-float" style={{ animationDelay: '1s' }}>
                        <Coffee className="w-10 h-10 text-brown-400 rotate-6" />
                    </div>
                </div>
            </div>

            {/* Main Content Area (Centered) */}
            <div className="z-10 flex flex-col items-center space-y-10 fade-in-up mb-20 -mt-20">
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6 animate-fade-in">
                    <img
                        src="/logo.png"
                        alt="ClarioAI"
                        className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                    />
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        ClarioAI
                    </h1>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 group">
                        <Search className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-secondary group-hover:text-white">DeepSearch</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                        <ImageIcon className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-secondary group-hover:text-white">Create Image</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 group">
                        <Zap className="w-4 h-4 text-green-500 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-secondary group-hover:text-white">Analyze Data</span>
                    </button>
                </div>
            </div>

            {/* Camera Scanner Modal */}
            <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScan} />

            {/* Fixed Bottom Search Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-20 flex justify-center bg-gradient-to-t from-black via-black/80 to-transparent pb-8 md:pb-10">
                <div className="w-full max-w-3xl">
                    <div className="relative flex items-center gap-3 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 shadow-2xl hover:border-white/20 transition-all duration-300 ring-1 ring-white/5">
                        {/* Camera Button - Left */}
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-secondary hover:text-white transition-all duration-200"
                            aria-label="Open Camera"
                        >
                            <Camera className="w-5 h-5" />
                        </button>

                        {/* Text Input */}
                        <input
                            type="text"
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-white placeholder-gray-500 focus:outline-none"
                        />

                        {/* Right Side Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-secondary hover:text-white transition-all duration-200"
                                aria-label="Voice input"
                            >
                                <Mic className="w-5 h-5" />
                            </button>

                            <button
                                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-secondary hover:text-white transition-all duration-200"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Info - Moved up slightly or hidden */}
            <div className="absolute bottom-24 md:bottom-28 text-center w-full pointer-events-none">
                <p className="text-[10px] text-white/20">ClarioAI Model 2.0</p>
            </div>
        </div>
    );
};
