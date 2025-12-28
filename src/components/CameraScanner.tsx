import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Image as ImageIcon } from 'lucide-react';
import type { AnalysisData } from './AnalysisResult';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface CameraScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (data: AnalysisData) => void;
}

// Mock Data for "Bournvita" / Generic Biscuit based on file names seen in public dir
const MOCK_ANALYSIS: AnalysisData = {
    intent: "Checking if this is actually healthy for kids",
    productName: "Chocolate Health Drink / Biscuit",
    insights: [
        {
            type: 'matter',
            title: "Why it matters",
            description: "You're likely looking for a growth supplement, but this product relies heavily on sugar for taste, which correlates with energy spikes rather than sustained nutrition.",
            icon: AlertCircle,
            color: "orange"
        },
        {
            type: 'tradeoff',
            title: "The Tradeoff",
            description: "Contains fortified vitamins (Iron, Vitamin D), BUT the sugar content (nearly 40%) outweighs the micronutrient benefits for daily consumption.",
            icon: CheckCircle2,
            color: "blue"
        },
        {
            type: 'uncertainty',
            title: "What we don't know",
            description: "The label mentions 'Natural Colors' but doesn't specify the source. Long-term impact of the specific flavor additives is not well-documented in this region.",
            icon: HelpCircle,
            color: "purple"
        }
    ],
    summary: "While marketed as a health booster, the ingredient profile resembles a confectionary product. Proceed with moderation if sugar intake is a concern."
};

export const CameraScanner: React.FC<CameraScannerProps> = ({ isOpen, onClose, onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            setIsCapturing(false);
        }

        return () => {
            stopCamera();
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

    const handleCapture = () => {
        setIsCapturing(true);
        // Simulate processing delay
        setTimeout(() => {
            setIsCapturing(false);
            onScan(MOCK_ANALYSIS);
            onClose();
        }, 1000);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsCapturing(true);
            // Simulate processing delay for upload
            setTimeout(() => {
                setIsCapturing(false);
                onScan(MOCK_ANALYSIS);
                onClose();
            }, 1000);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black">
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
                    {/* No title as per clean UI request */}
                    <div className="w-10 h-10 md:w-12 md:h-12" /> {/* Spacer */}
                </div>

                {/* Camera View */}
                <div className="flex-1 relative overflow-hidden bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Clean View: No overlays, no grids, no animations as requested */}
                </div>

                {/* Bottom Controls */}
                <div className="relative bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-6 pb-6 md:pb-8">
                    <div className="flex items-center justify-center gap-8 md:gap-12 max-w-2xl mx-auto">
                        {/* Flash Button */}
                        <button
                            onClick={() => setFlashEnabled(!flashEnabled)}
                            className={`flex flex-col items-center gap-2 transition-all ${flashEnabled ? 'text-accent' : 'text-white/60'}`}
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <Zap className="w-5 h-5 md:w-6 md:h-6" fill={flashEnabled ? 'currentColor' : 'none'} />
                            </div>
                            <span className="text-xs md:text-sm">Flash</span>
                        </button>

                        {/* Capture Button */}
                        <button
                            onClick={handleCapture}
                            disabled={isCapturing}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-all relative group ${isCapturing ? 'opacity-50 scale-95' : ''}`}
                        >
                            <div className={`absolute inset-2 rounded-full bg-white group-hover:scale-95 transition-transform ${isCapturing ? 'scale-75' : ''}`}></div>
                        </button>

                        {/* Upload Button */}
                        <button
                            onClick={handleUploadClick}
                            disabled={isCapturing}
                            className="flex flex-col items-center gap-2 transition-all text-white/60 hover:text-white"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <ImageIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-xs md:text-sm">Upload</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
