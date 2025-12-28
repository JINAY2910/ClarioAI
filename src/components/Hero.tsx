import { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Search, Zap, Mic } from 'lucide-react';

export const Hero = () => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

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

    return (
        <div className="relative flex flex-col items-center justify-center min-h-full w-full max-w-4xl mx-auto px-4">
            {/* Background Effects */}
            <div id="star-container" className="fixed inset-0 pointer-events-none z-0" />

            {/* Content */}
            <div className="z-10 flex flex-col items-center w-full space-y-12 fade-in-up">

                {/* Logo Section */}
                <div className="flex flex-col items-center gap-6 animate-fade-in">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <img
                            src="/clarioAI.png"
                            alt="ClarioAI"
                            className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                        />
                    </div>
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

                {/* Search Input */}
                <div className={`
             relative w-full max-w-2xl transition-all duration-300 transform
             ${isFocused ? 'scale-105' : 'scale-100'}
        `}>
                    <div className={`
              absolute -inset-0.5 bg-gradient-to-r from-accent via-purple-500 to-accent rounded-2xl blur opacity-20 transition duration-500
              ${isFocused ? 'opacity-40' : 'opacity-20'}
          `}></div>
                    <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="pl-4">
                            <button className="p-2 rounded-full hover:bg-white/10 text-secondary transition-colors">
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Ask Clario anything..."
                            className="w-full bg-transparent border-none px-4 py-6 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                        />
                        <div className="pr-4">
                            <button
                                className={`
                  p-2 rounded-xl transition-all duration-200
                  ${inputValue ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/5 text-gray-500 hover:bg-white/10'}
                `}
                            >
                                <Send className="w-5 h-5" />
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
