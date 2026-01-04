import React from 'react';

import { startListening, stopListening, isSpeechSupported } from '../services/speech';

interface InputProps {
    onSend?: (text: string, file?: File) => void;
    allowAttachments?: boolean;
}

export const Input: React.FC<InputProps> = ({ onSend, allowAttachments = false }) => {
    const [text, setText] = React.useState('');
    const [interimText, setInterimText] = React.useState('');
    const [isListening, setIsListening] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isListening) {
            startListening(
                (transcript, isFinal) => {
                    if (isFinal) {
                        setText((prev) => {
                            const separator = prev.length > 0 ? ' ' : '';
                            return prev + separator + transcript;
                        });
                        setInterimText('');
                    } else {
                        setInterimText(transcript);
                    }
                },
                () => {
                    // onStop callback (e.g. mic permission denied or user stopped speaking long enough)
                    setIsListening(false);
                    setInterimText('');
                },
                (error) => {
                    // onError callback
                    console.error("Voice input error:", error);
                    setIsListening(false);
                    setInterimText('');
                    if (error === 'not-allowed') {
                        alert("Microphone access denied. Please enable permissions.");
                    } else if (error === 'no-speech') {
                        // Ignore no-speech, just stop listening usually or stay listening?
                        // usually browser stops, so our onStop handles the state reset.
                    } else {
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

    const handleSend = () => {
        const fullText = (text + (interimText ? ' ' + interimText : '')).trim();
        if (fullText) {
            onSend?.(fullText);
            setText('');
            setInterimText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('File selected:', file);
            // In a real app, we'd probably show a preview or attach it to state
            // For now, let's just simulate sending it
            onSend?.(`[Attached: ${file.name}]`, file);
        }
    };

    const toggleVoice = () => {
        if (!isListening) {
            // Check support before starting
            if (!isSpeechSupported()) {
                alert("Voice typing is not supported in this browser. Please use Chrome, Edge, or Safari.");
                return;
            }
        }
        setIsListening(!isListening);
    };

    return (
        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-full p-2 pl-5 gap-3 mt-auto w-full transition-all duration-300 hover:bg-white/[0.05]">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Attachment Button */}
            {allowAttachments && (
                <button
                    className="p-2 text-white/40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 bg-white/5 border border-transparent hover:bg-white/10 hover:text-white hover:border-white/10"
                    onClick={handleFileClick}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            )}

            <input
                type="text"
                value={text + (interimText ? (text ? ' ' : '') + interimText : '')}
                onChange={(e) => {
                    setText(e.target.value);
                    setInterimText('');
                }}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask AI or scan..."}
                className="flex-1 bg-transparent border-none text-white text-base outline-none min-w-0 pl-1 placeholder:text-white/30"
            />

            <div className="flex gap-2">
                {/* Voice/Stop Button */}
                <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border border-transparent ${isListening
                        ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
                        : 'text-white/40 bg-transparent hover:bg-white/10 hover:text-white'
                        }`}
                >
                    {isListening ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <rect x="6" y="6" width="12" height="12" rx="2" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                    )}
                </button>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border border-transparent transition-all duration-200 ${text.trim()
                        ? 'bg-white text-black cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95'
                        : 'bg-white/5 text-background cursor-default opacity-50'
                        }`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
