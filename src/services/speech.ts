export const speak = (
    text: string,
    lang: string = 'en-US',
    onStart?: () => void,
    onEnd?: () => void
) => {
    if (!window.speechSynthesis) {
        console.warn("Text-to-speech not supported");
        onEnd?.();
        return;
    }

    // Cancel any currently playing speech to avoid queueing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = lang;

    // Helper to execute verify and speak
    const doSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const preferredVoice = voices.find(v =>
                v.lang.startsWith(lang.split('-')[0]) &&
                (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("India"))
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
        }

        try {
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.error("Speak failed", e);
            onEnd?.();
        }
    };

    // Retry getting voices if empty (common Chrome bug)
    if (window.speechSynthesis.getVoices().length === 0) {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null; // Remove listener
            doSpeak();
        };
        // Fallback if event never fires
        setTimeout(() => {
            if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                doSpeak();
            }
        }, 1000);
        return;
    }

    doSpeak();

    utterance.onstart = () => {
        onStart?.();
    };

    utterance.onend = () => {
        onEnd?.();
    };

    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        onEnd?.();
    };


};

let recognition: any = null;

export const isSpeechSupported = () => {
    // @ts-ignore
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const startListening = (
    onResult: (text: string, isFinal: boolean) => void,
    onStop?: () => void,
    onError?: (error: string) => void
) => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        onError?.("Speech recognition not supported");
        return;
    }

    if (recognition) {
        recognition.onend = null; // Prevent previous instance from triggering callbacks
        recognition.stop();
        recognition = null;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Enable real-time results
    recognition.lang = 'en-IN'; // Good for Hinglish/Indian accents

    recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript || interimTranscript) {
            onResult(finalTranscript || interimTranscript, !!finalTranscript);
        }
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        onError?.(event.error);
    };

    recognition.onend = () => {
        onStop?.();
    };

    try {
        recognition.start();
    } catch (e) {
        console.error("Failed to start recognition", e);
        onError?.("Failed to start recording");
    }
};

export const stopListening = () => {
    if (recognition) {
        recognition.onend = null;
        recognition.stop();
        recognition = null;
    }
};

export const detectLanguage = (text: string): string => {
    // Simple heuristic: Devanagari range for Hindi/Marathi/Gujarati-ish (broadly)
    // Gujarati range: 0x0A80–0x0AFF
    // Devanagari: 0x0900–0x097F
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasGujarati = /[\u0A80-\u0AFF]/.test(text);

    if (hasGujarati) return 'gu-IN';
    if (hasDevanagari) return 'hi-IN';
    return 'en-IN';
};
