import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Grid3x3 } from 'lucide-react';

interface CameraScannerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ isOpen, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [gridEnabled, setGridEnabled] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
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
        console.log('Capturing image...');
        // Add capture logic here
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black">
            <div className="w-full h-full bg-black flex flex-col">
                {/* Header */}
                <div className="relative flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent z-10">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                        <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </button>
                    <span className="text-white font-medium text-base md:text-lg">Scan</span>
                    <div className="w-10 h-10 md:w-12 md:h-12" /> {/* Spacer */}
                </div>

                {/* Camera View */}
                <div className="flex-1 relative overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Grid Overlay */}
                    {gridEnabled && (
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="border border-white/20" />
                            ))}
                        </div>
                    )}

                    {/* Scanning Frame */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[85%] md:w-[70%] max-w-md aspect-[3/2]">
                            {/* Animated corners */}
                            <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-l-4 border-t-4 border-accent rounded-tl-2xl animate-pulse"></div>
                            <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-r-4 border-t-4 border-accent rounded-tr-2xl animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-l-4 border-b-4 border-accent rounded-bl-2xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-r-4 border-b-4 border-accent rounded-br-2xl animate-pulse"></div>

                            {/* Scanning line */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-scan shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
                            </div>

                            {/* Center guideline */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-0.5 bg-accent/30"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="relative bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-6 pb-6 md:pb-8">
                    {/* All Control Buttons in One Row */}
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
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-all relative group"
                        >
                            <div className="absolute inset-2 rounded-full bg-white group-hover:scale-95 transition-transform"></div>
                        </button>

                        {/* Grid Button */}
                        <button
                            onClick={() => setGridEnabled(!gridEnabled)}
                            className={`flex flex-col items-center gap-2 transition-all ${gridEnabled ? 'text-accent' : 'text-white/60'}`}
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <Grid3x3 className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="text-xs md:text-sm">Grid</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
