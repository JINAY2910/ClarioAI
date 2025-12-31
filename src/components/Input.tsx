import React from 'react';

import { startListening, stopListening, isSpeechSupported } from '../services/speech';

interface InputProps {
    onSend?: (text: string, file?: File) => void;
}

export const Input: React.FC<InputProps> = ({ onSend }) => {
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
        <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 8px 8px 20px',
            gap: '12px',
            marginTop: 'auto'
        }}>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* Attachment Button */}
            <button style={{
                padding: '8px',
                color: 'var(--color-text-dim)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'rgba(255,255,255,0.05)',
                border: 'none'
            }}
                onClick={handleFileClick}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'var(--color-text)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = 'var(--color-text-dim)';
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            <input
                type="text"
                value={text + (interimText ? (text ? ' ' : '') + interimText : '')}
                onChange={(e) => {
                    setText(e.target.value);
                    setInterimText(''); // Clear interim if user manually types, though unusual scenario
                }}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Ask AI or scan..."}
                style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text)',
                    fontSize: '16px',
                    outline: 'none',
                    minWidth: 0,
                    paddingLeft: '4px'
                }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
                {/* Voice/Stop Button */}
                <button
                    onClick={toggleVoice}
                    style={{
                        padding: '8px',
                        color: isListening ? '#ef4444' : 'var(--color-text-dim)', // Red when listening
                        borderRadius: '50%',
                        display: 'flex',
                        background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
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
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: text.trim() ? 'var(--color-text)' : 'var(--color-text-dim)', // Active state
                        color: 'var(--color-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: text.trim() ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                        opacity: text.trim() ? 1 : 0.5
                    }}
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
