import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { AnalysisData } from './AnalysisResult';

interface CameraScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (data: AnalysisData | File) => void;
    initialLiveMode?: boolean;
}

// Mock Data for "Bournvita" / Generic Biscuit based on file names seen in public dir
const MOCK_ANALYSIS: AnalysisData = {
    intent: "processed-concern",
    intentLabel: "Processed Food Concern",
    productName: "Chocolate Health Drink",
    primaryInsight: "This product is marketed as a health booster, but it contains **nearly 40% sugar**. While it has **fortified vitamins** like Iron and Vitamin D, the sugar level makes it better suited as an **occasional option**, not a daily nutrition choice.",
    summaryChips: [
        { label: 'High sugar', color: 'red', emoji: '🔴' },
        { label: 'Fortified vitamins', color: 'green', emoji: '🟢' },
        { label: 'Use occasionally', color: 'amber', emoji: '🟡' }
    ],
    whyItMatters: "Regular consumption of high-sugar products can create habits around sweet tastes and may affect your child's relationship with food over time.",
    uncertaintyNote: "The label mentions 'Natural Colors' but doesn't specify the source. Long-term impact of the specific flavor additives is not well-documented.",
    summary: "While marketed as a health booster, the ingredient profile resembles a confectionary product. Proceed with moderation if sugar intake is a concern."
};

export const CameraScanner: React.FC<CameraScannerProps> = ({ isOpen, onClose, onScan, initialLiveMode = false }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    // Live Mode State
    const [isLiveMode, setIsLiveMode] = useState(initialLiveMode);
    const isLiveModeRef = useRef(initialLiveMode); // Ref to track live mode for callbacks
    const [lastSpoken, setLastSpoken] = useState<{ text: string, sender: 'user' | 'ai' } | null>(null);
    const lastSpokenRef = useRef<string>(''); // Ref to track latest value in intervals
    const analysisInterval = useRef<any>(null);
    const isAISpeaking = useRef(false);

    useEffect(() => {
        isLiveModeRef.current = isLiveMode; // Sync ref
        if (isLiveMode) {
            startLiveAnalysis();
        } else {
            stopLiveAnalysis();
        }
    }, [isLiveMode]);

    useEffect(() => {
        if (isOpen) {
            setIsLiveMode(initialLiveMode);
            startCamera();
        } else {
            stopCamera();
            stopLiveAnalysis(); // This handles logical cleanup
            // Immediate synchronous cancel for UI responsiveness
            window.speechSynthesis?.cancel();
            setIsCapturing(false);
            setIsLiveMode(false);
        }

        return () => {
            stopCamera();
            stopLiveAnalysis();
            window.speechSynthesis?.cancel();
        };
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureFrameAsFile = (): File | null => {
        if (!videoRef.current) return null;

        const canvas = document.createElement('canvas');
        // Capture at lower resolution for speed/tokens
        const scale = 0.5;
        canvas.width = videoRef.current.videoWidth * scale;
        canvas.height = videoRef.current.videoHeight * scale;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            const byteString = atob(dataUrl.split(',')[1]);
            const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new File([ab], "live-capture.jpg", { type: mimeString });
        }
        return null;
    };

    const startLiveAnalysis = async () => {
        const { startListening, detectLanguage } = await import('../services/speech');

        // Start listening
        startListening(
            async (transcript, isFinal) => {
                // Visualize what the user is saying immediately
                setLastSpoken({ text: transcript, sender: 'user' });
                lastSpokenRef.current = transcript;

                // Only analyze if the user has finished a sentence AND AI isn't currently talking
                if (isFinal && !isAISpeaking.current) {
                    const file = captureFrameAsFile();
                    if (file) {
                        try {
                            const { aiService } = await import('../services/ai');
                            const { speak } = await import('../services/speech');

                            // Pause passive loop essentially by resetting intent? 
                            // Actually just analyze.
                            const responseText = await aiService.analyzeStreamFrame(file, transcript);

                            if (responseText) {
                                // Don't show text yet - wait for speech to start for sync
                                // setLastSpoken({ text: responseText, sender: 'ai' }); // REMOVED
                                lastSpokenRef.current = responseText;

                                const langKey = detectLanguage(responseText);

                                // Show text immediately (Fail-safe)
                                setLastSpoken({ text: responseText, sender: 'ai' });
                                lastSpokenRef.current = responseText;

                                speak(
                                    responseText,
                                    langKey,
                                    () => { // onStart
                                        isAISpeaking.current = true;
                                        // Safety valve: Force reset after 15s in case onEnd never fires
                                        setTimeout(() => {
                                            if (isAISpeaking.current) {
                                                console.warn("Force resetting AI speech state");
                                                isAISpeaking.current = false;
                                            }
                                        }, 15000);
                                    },
                                    () => { // onEnd
                                        isAISpeaking.current = false;
                                    }
                                );
                            }
                        } catch (e) {
                            console.error("Live analysis error", e);
                        }
                    }
                }
            },
            () => {
                // onStop: Auto-restart if we are still in live mode
                if (isLiveModeRef.current) {
                    console.log("Speech recognition stopped, restarting...");
                    startLiveAnalysis();
                }
            },
            (err) => {
                console.warn("Speech error, restarting...", err);
                if (isLiveModeRef.current) {
                    // Small delay to prevent thrashing loop on hard errors
                    setTimeout(() => startLiveAnalysis(), 1000);
                }
            }
        );

        // Keep a passive background loop for "Show and Tell" (every 5s)
        if (!analysisInterval.current) {
            analysisInterval.current = setInterval(async () => {
                // Don't interrupt if AI is speaking or if we just spoke recently
                if (isAISpeaking.current) return;

                const file = captureFrameAsFile();
                if (file) {
                    try {
                        const { aiService } = await import('../services/ai');
                        const { speak } = await import('../services/speech');

                        const responseText = await aiService.analyzeStreamFrame(file);

                        // Only speak if it's new information to avoid repetition
                        if (responseText && responseText !== lastSpokenRef.current && !isAISpeaking.current) {
                            // Show text immediately (Fail-safe)
                            setLastSpoken({ text: responseText, sender: 'ai' });
                            lastSpokenRef.current = responseText;

                            const langKey = "en-IN"; // Default for passive
                            speak(
                                responseText,
                                langKey,
                                () => {
                                    isAISpeaking.current = true;
                                },
                                () => {
                                    isAISpeaking.current = false;
                                }
                            );
                        }
                    } catch (e) {
                        console.error("Passive analysis error", e);
                    }
                }
            }, 5000);
        }
    };

    const stopLiveAnalysis = async () => {
        const { stopListening } = await import('../services/speech');
        stopListening();

        if (analysisInterval.current) {
            clearInterval(analysisInterval.current);
            analysisInterval.current = null;
        }
        window.speechSynthesis?.cancel();
        isAISpeaking.current = false;
    };

    const handleCapture = () => {
        if (!videoRef.current) return;

        setIsCapturing(true);
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                    onScan(file);
                    setTimeout(() => {
                        setIsCapturing(false);
                        onClose();
                    }, 500); // Small delay for visual feedback
                } else {
                    setIsCapturing(false);
                    // Fallback to mock if capture fails for some reason
                    onScan(MOCK_ANALYSIS);
                    onClose();
                }
            }, 'image/jpeg', 0.8);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onScan(file);
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black h-[100dvh] w-full">
            <div className="w-full h-full bg-black flex flex-col">
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Header */}
                <div className="relative flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent z-10">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                        <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </button>

                    {/* Live Mode Indicator (Only visible in Live Mode) */}
                    {isLiveMode && (
                        <div
                            className="px-4 py-2 rounded-full text-sm font-bold tracking-wide border bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        >
                            LIVE VISION ON
                        </div>
                    )}
                </div>

                {/* Camera View */}
                <div className="flex-1 relative overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Live Feedback Overlay */}
                    {isLiveMode && (
                        <div className="absolute inset-0 border-[6px] border-emerald-500/30 pointer-events-none">
                            <div className="absolute bottom-10 left-0 right-0 p-6 text-center pb-[calc(2.5rem+env(safe-area-inset-bottom,20px))]">
                                <span className={`inline-block px-4 py-3 backdrop-blur-md rounded-2xl text-lg font-medium transition-all max-w-[90%] ${lastSpoken?.sender === 'user'
                                    ? 'bg-black/60 text-white/90 border border-white/20'
                                    : 'bg-emerald-950/80 text-emerald-100 border border-emerald-500/30'
                                    }`}>
                                    {lastSpoken ? (
                                        <>
                                            <span className="opacity-50 text-xs uppercase tracking-wider block mb-1">
                                                {lastSpoken.sender === 'user' ? 'You' : 'Clario AI'}
                                            </span>
                                            {lastSpoken.text}
                                        </>
                                    ) : (
                                        "Listening..."
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Controls */}
                <div className="relative bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,20px))] md:pb-8">
                    <div className="flex items-center justify-center gap-8 md:gap-12 max-w-2xl mx-auto">
                        {/* Capture Button (Hidden or Disabled in Live Mode to emphasize hands-free) */}
                        {!isLiveMode && (
                            <button
                                onClick={handleCapture}
                                disabled={isCapturing}
                                className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-all relative group ${isCapturing ? 'opacity-50 scale-95' : ''}`}
                            >
                                <div className={`absolute inset-2 rounded-full bg-white group-hover:scale-95 transition-transform ${isCapturing ? 'scale-75' : ''}`}></div>
                            </button>
                        )}
                        {isLiveMode && (
                            <div className="text-white/50 text-sm font-medium animate-pulse">
                                Point camera at food for instant advice
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
