import { useState, useRef, useEffect } from 'react';
import { Camera, ArrowUp, Sparkles, Scan, Mic, Eye } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { type AnalysisData } from './AnalysisResult';
import { startListening, stopListening, isSpeechSupported } from '../services/speech';

interface HomepageProps {
    onAnalysisComplete: (data: AnalysisData) => void;
}

export const Homepage = ({ onAnalysisComplete }: HomepageProps) => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [startInLiveMode, setStartInLiveMode] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isListening) {
            startListening(
                (transcript, isFinal) => {
                    if (isFinal) {
                        setTextInput((prev) => {
                            const separator = prev.length > 0 ? ' ' : '';
                            return prev + separator + transcript;
                        });
                        setInterimText('');
                    } else {
                        setInterimText(transcript);
                    }
                },
                () => {
                    setIsListening(false);
                    setInterimText('');
                },
                (error) => {
                    console.error("Voice input error:", error);
                    setIsListening(false);
                    setInterimText('');
                    if (error === 'not-allowed') {
                        alert("Microphone access denied. Please enable permissions.");
                    } else if (error !== 'no-speech') {
                        alert(`Voice Error: ${error}`);
                    }
                }
            );
        } else {
            stopListening();
            setInterimText('');
        }

        return () => {
            stopListening();
        };
    }, [isListening]);

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
        setStartInLiveMode(false); // Reset
        if (dataOrFile instanceof File) {
            handleAnalysis(dataOrFile);
        } else {
            onAnalysisComplete(dataOrFile);
        }
    };

    const handleNormalScanClick = () => {
        setStartInLiveMode(false);
        setIsScannerOpen(true);
    };

    const handleLiveVisionClick = () => {
        setStartInLiveMode(true);
        setIsScannerOpen(true);
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
        const fullText = (textInput + (interimText ? ' ' + interimText : '')).trim();
        if (fullText) {
            const mockData: AnalysisData = {
                intent: 'moderation',
                intentLabel: 'Analysis',
                productName: fullText,
                primaryInsight: 'Text analysis is currently a **preview feature**. Please upload an image for full **ingredient analysis**.',
                summaryChips: [
                    { label: 'Text Search', color: 'amber', emoji: '🔍' },
                    { label: 'Limited Data', color: 'red', emoji: '⚠️' },
                    { label: 'Try Image', color: 'green', emoji: '📸' }
                ],
                whyItMatters: 'Image analysis allows us to read the exact ingredient list on the package.',
                suggestedQuestions: []
            };
            onAnalysisComplete(mockData);
            setTextInput('');
            setInterimText('');
        }
    };

    const toggleVoice = () => {
        if (!isListening) {
            if (!isSpeechSupported()) {
                alert("Voice typing is not supported in this browser. Please use Chrome, Edge, or Safari.");
                return;
            }
        }
        setIsListening(!isListening);
    };

    return (
        <div className="relative flex flex-col h-full w-full bg-background text-white overflow-hidden selection:bg-emerald-500/30">
            {/* Camera Scanner Modal */}
            {isScannerOpen && (
                <CameraScanner
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onScan={handleScan}
                    initialLiveMode={startInLiveMode}
                />
            )}

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
            <div className="relative z-10 flex-1 flex flex-col items-center pt-2 md:pt-16 px-4 w-full overflow-hidden">
                <div className="w-full max-w-md md:max-w-3xl flex flex-col items-center h-full pb-2 md:pb-6">

                    {/* 1. Hero Section - Presence */}
                    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 animate-fade-in z-10 shrink-0 mb-6 md:mb-12">
                        <div className="space-y-1 md:space-y-6 max-w-2xl mx-auto">
                            <div className="relative">
                                <h1 className="relative text-2xl md:text-5xl font-light tracking-wide text-white/95">
                                    Clarity before you choose.
                                </h1>
                            </div>
                            <p className="text-white/70 text-xs md:text-base font-light leading-relaxed max-w-md mx-auto tracking-wide">
                                I help you understand what’s really in your food.
                            </p>
                        </div>
                    </div>

                    {/* Desktop Layout Split */}
                    <div className="w-full flex-1 md:flex-none flex flex-col justify-center md:grid md:grid-cols-2 gap-4 md:gap-6 min-h-0">
                        {/* 3. Primary Action - Check a Product */}
                        <button
                            onClick={handleNormalScanClick}
                            className="w-full shrink-0 h-28 md:h-32 bg-white/5 border border-emerald-500/20 rounded-3xl p-4 md:p-5 text-left hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 group animate-fade-in flex flex-row items-center gap-4 min-h-0 relative overflow-hidden"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {/* Subtle glow */}
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start justify-between shrink-0 w-auto">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                                    <Scan className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 animate-pulse duration-[3000ms]" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl md:text-2xl font-medium text-white mb-1">Check a product</h3>
                                    <ArrowUp className="w-6 h-6 rotate-45 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-white/40 text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">Scan, type, or show ingredients</p>
                            </div>
                        </button>

                        {/* 1. New Live Vision Card */}
                        <button
                            onClick={handleLiveVisionClick}
                            className="w-full shrink-0 h-28 md:h-32 bg-white/5 border border-emerald-500/20 rounded-3xl p-4 md:p-5 text-left hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 group animate-fade-in flex flex-row items-center gap-4 relative overflow-hidden min-h-0"
                            style={{ animationDelay: '0.3s' }}
                        >
                            {/* Subtle emerald glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

                            <div className="flex items-start justify-between shrink-0 w-auto">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative border border-emerald-500/20">
                                    <Eye className="w-8 h-8 md:w-10 md:h-10 text-emerald-100 animate-pulse duration-[3000ms]" />
                                </div>
                            </div>
                            <div className="relative flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                                <div className="flex flex-row items-center gap-3">
                                    <h3 className="text-xl md:text-2xl font-medium text-white">Live Vision</h3>
                                    <div className="opacity-80 text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-1 rounded translate-y-[1px]">
                                        Real-time AI
                                    </div>
                                </div>
                                <p className="text-white/40 text-sm md:text-base leading-tight overflow-hidden text-ellipsis block">Let me watch and guide</p>
                            </div>
                        </button>
                    </div>
                    {/* 5. Suggested Chips */}
                    <div className="flex flex-wrap justify-center gap-2 mt-auto md:mt-12 mb-2 md:mb-4 animate-fade-in shrink-0" style={{ animationDelay: '0.4s' }}>
                        {[
                            "Is this safe?",
                            "Palm oil?",
                            "Better option?"
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

                </div>
            </div >

            {/* 7. Bottom Interaction Bar - Fixed at bottom of flex column */}
            <div className="z-20 w-full p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent flex-none pb-[env(safe-area-inset-bottom,20px)]">
                <div className="max-w-md md:max-w-3xl mx-auto mb-4 md:mb-0">
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
                            value={textInput + (interimText ? (textInput.length > 0 ? ' ' : '') + interimText : '')}
                            onChange={(e) => {
                                setTextInput(e.target.value);
                                setInterimText('');
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                            placeholder={isListening ? "Listening..." : "Ask ClarioAI or scan..."}
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/30 h-full py-2"
                        />

                        {/* Mic / Send */}
                        <button
                            onClick={() => textInput ? handleTextSubmit() : toggleVoice()}
                            className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/10 text-red-500' : (textInput ? 'bg-emerald-500 text-white' : 'hover:bg-white/10 text-white/50 hover:text-white')}`}
                        >
                            {textInput ? (
                                <ArrowUp className="w-5 h-5" />
                            ) : (
                                isListening ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                        <rect x="6" y="6" width="12" height="12" rx="2" />
                                    </svg>
                                ) : (
                                    <Mic className="w-5 h-5" />
                                )
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
