import { useEffect, useState } from 'react';
import { Send, Image as ImageIcon, Search, Zap, Mic } from 'lucide-react';
import { CameraScanner } from './CameraScanner';

export const Hero = () => {
    const [scanText, setScanText] = useState('Tap');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // Simple starfield effect
    useEffect(() => {
        const createStar = () => {
            const star = document.createElement('div');
            star.className = 'fixed rounded-full bg-white animate-pulse-slow';
            star.style.width = Math.random() * 2 + 'px';
            star.style.height = star.style.width;
            star.style.top = Math.random() * 100 + 'vh';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.opacity = Math.random() * 0.5 + '';
            star.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.getElementById('star-container')?.appendChild(star);
        };

        const container = document.getElementById('star-container');
        if (container) container.innerHTML = '';

        for (let i = 0; i < 50; i++) {
            createStar();
        }
    }, []);

    // Typewriter effect
    useEffect(() => {
        const texts = ['Tap', 'Scan & Buy'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                setScanText(currentText.substring(0, charIndex - 1));
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500);
                    return;
                }
            } else {
                setScanText(currentText.substring(0, charIndex + 1));
                charIndex++;

                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            }

            setTimeout(type, isDeleting ? 50 : 100);
        };

        const timer = setTimeout(type, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-full w-full max-w-4xl mx-auto px-4">
            {/* Background Effects */}
            <div id="star-container" className="fixed inset-0 pointer-events-none z-0" />

            {/* Content */}
            <div className="z-10 flex flex-col items-center w-full space-y-12 fade-in-up">

                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6 animate-fade-in">
                    <img
                        src="/logo.png"
                        alt="ClarioAI"
                        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                    />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        ClarioAI
                    </h1>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 group">
                        <Search className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-secondary group-hover:text-white">DeepSearch</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group">
                        <ImageIcon className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-secondary group-hover:text-white">Create Image</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300 group">
                        <Zap className="w-4 h-4 text-green-500 group-hover:text-white transition-colors" />
                        <span className="text-sm font-medium text-secondary group-hover:text-white">Analyze Data</span>
                    </button>
                </div>

                {/* Scanner Interface - Smartphone Style */}
                <div className="relative w-full max-w-xl mb-8 md:mb-12 px-4 md:px-0">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="relative w-full group cursor-pointer"
                    >
                        {/* Main Card - Smartphone Shape */}
                        <div className="relative card-slot-shape overflow-hidden">
                            {/* Gradient Background - Blue fading to Black */}
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-blue-950/70 to-black"></div>

                            <div className="relative px-3 py-6 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 lg:py-16">
                                {/* Blue Indicator Bars - Left Edge */}
                                <div className="hidden sm:flex absolute left-4 sm:left-6 md:left-8 lg:left-10 top-[55%] -translate-y-1/2 flex-col gap-1.5 sm:gap-2.5 md:gap-3">
                                    <div className="w-2 h-6 sm:w-3.5 sm:h-11 md:w-4 md:h-12 lg:w-5 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm sm:rounded-md"></div>
                                    <div className="w-2 h-5 sm:w-3.5 sm:h-8 md:w-4 md:h-9 lg:w-5 lg:h-11 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm sm:rounded-md"></div>
                                    <div className="w-2 h-5 sm:w-3.5 sm:h-9 md:w-4 md:h-10 lg:w-5 lg:h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm sm:rounded-md"></div>
                                </div>

                                {/* Blue Indicator Bars - Right Edge */}
                                <div className="hidden sm:flex absolute right-4 sm:right-6 md:right-8 lg:right-10 top-[55%] -translate-y-1/2 flex-col gap-1.5 sm:gap-2.5 md:gap-3">
                                    <div className="w-2 h-6 sm:w-3.5 sm:h-11 md:w-4 md:h-12 lg:w-5 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm sm:rounded-md"></div>
                                    <div className="w-2 h-5 sm:w-3.5 sm:h-8 md:w-4 md:h-9 lg:w-5 lg:h-11 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm sm:rounded-md"></div>
                                    <div className="w-2 h-5 sm:w-3.5 sm:h-9 md:w-4 md:h-10 lg:w-5 lg:h-12 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm sm:rounded-md"></div>
                                </div>

                                {/* Center Dark Button */}
                                <div className="relative mx-auto max-w-[240px] sm:max-w-xs md:max-w-sm">
                                    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] px-5 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-14 lg:py-7 border border-gray-800/50 shadow-2xl">
                                        <div className="flex items-center justify-center">
                                            {/* Text with Typing Animation */}
                                            <div className="relative">
                                                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide typing-text">
                                                    {scanText}
                                                </span>
                                                {/* Typing Cursor */}
                                                <span className="typing-cursor text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 ml-1">|</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Camera Scanner Modal */}
                <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

                {/* ChatGPT-Style Input Box */}
                <div className="relative w-full max-w-3xl">
                    <div className="relative flex items-center gap-3 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 shadow-2xl hover:border-white/20 transition-all duration-300">
                        {/* Plus Button - Left */}
                        <button
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-secondary hover:text-white transition-all duration-200"
                            aria-label="Add attachment"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        {/* Text Input */}
                        <input
                            type="text"
                            placeholder="Ask anything"
                            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-white placeholder-gray-500 focus:outline-none"
                        />

                        {/* Right Side Buttons */}
                        <div className="flex items-center gap-2">
                            {/* Voice Button */}
                            <button
                                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-secondary hover:text-white transition-all duration-200"
                                aria-label="Voice input"
                            >
                                <Mic className="w-5 h-5" />
                            </button>

                            {/* Send Button */}
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

            {/* Footer Info */}
            <div className="absolute bottom-8 text-center">
                <p className="text-xs text-white/20">ClarioAI Model 2.0 • Designed for Excellence</p>
            </div>
        </div>
    );
};
