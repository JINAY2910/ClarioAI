import { useState, useRef } from 'react';
import { Upload, Keyboard, Mic, Scan, Sparkles } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { type AnalysisData } from './AnalysisResult';
import { AlertTriangle, Leaf, HelpCircle } from 'lucide-react';

interface HeroProps {
    onAnalysisComplete: (data: AnalysisData) => void;
}

export const Hero = ({ onAnalysisComplete }: HeroProps) => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [textInput, setTextInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock analysis data generator
    const generateMockAnalysis = (productName: string): AnalysisData => {
        return {
            intent: 'Health-conscious consumer seeking nutritional information',
            productName: productName,
            insights: [
                {
                    type: 'matter',
                    title: 'High in Added Sugars',
                    description: 'Contains 18g of sugar per serving, which is 36% of the recommended daily intake.',
                    icon: AlertTriangle,
                    color: 'red'
                },
                {
                    type: 'tradeoff',
                    title: 'Good Source of Fiber',
                    description: 'Provides 12g of dietary fiber, supporting digestive health.',
                    icon: Leaf,
                    color: 'green'
                },
                {
                    type: 'uncertainty',
                    title: 'Contains Artificial Ingredients',
                    description: 'Some preservatives may cause sensitivity in certain individuals.',
                    icon: HelpCircle,
                    color: 'yellow'
                }
            ],
            summary: 'While this product offers good fiber content, the high sugar levels may be a concern for those monitoring their sugar intake. Consider alternatives with lower sugar content.'
        };
    };

    const handleScan = (data: AnalysisData) => {
        setIsScannerOpen(false);
        onAnalysisComplete(data);
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Generate mock analysis based on uploaded file
            const mockData = generateMockAnalysis(`Uploaded Product: ${file.name}`);
            onAnalysisComplete(mockData);
        }
    };

    const handleVoiceInput = () => {
        console.log('Voice input clicked');
    };

    const handleTextSubmit = () => {
        if (textInput.trim()) {
            const mockData = generateMockAnalysis(textInput);
            onAnalysisComplete(mockData);
            setTextInput('');
        }
    };

    return (
        <div className="relative flex flex-col h-screen w-full bg-black px-4 md:px-6">
            {/* Camera Scanner Modal */}
            <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleScan} />

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
                        <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-green-400" />
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
                            className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <Upload className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-white">Upload</span>
                        </button>

                        {/* Scan Button - Center */}
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-300 hover:scale-105 group"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                <Scan className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-white">Scan</span>
                        </button>

                        {/* Voice Button - Right */}
                        <button
                            onClick={handleVoiceInput}
                            className="flex flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
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
