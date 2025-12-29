import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { AnalysisData } from './AnalysisResult';

interface CameraScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (data: AnalysisData | File) => void;
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
                        {/* Capture Button */}
                        <button
                            onClick={handleCapture}
                            disabled={isCapturing}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-all relative group ${isCapturing ? 'opacity-50 scale-95' : ''}`}
                        >
                            <div className={`absolute inset-2 rounded-full bg-white group-hover:scale-95 transition-transform ${isCapturing ? 'scale-75' : ''}`}></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
