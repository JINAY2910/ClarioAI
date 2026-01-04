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

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = lang;

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

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null;
            doSpeak();
        };
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
        onError?.("Speech recognition not supported");
        return;
    }

    // Clean up existing instance
    if (recognition) {
        try {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.stop();
        } catch (e) { /* ignore */ }
        recognition = null;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

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

        // Send results to UI
        const fullText = finalTranscript + interimTranscript;
        if (fullText) {
            onResult(fullText, !!finalTranscript);
        }
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        onError?.(event.error);
    };

    recognition.onend = () => {
        console.log("Speech recognition ended");
        onStop?.();
    };

    try {
        recognition.start();
        console.log("Speech recognition started");
    } catch (e: any) {
        console.error("Failed to start recognition", e);
        if (e?.name === 'InvalidStateError' || e?.message?.includes('already started')) {
            console.log("Recognition already active");
            return;
        }
        onError?.("Failed to start recording");
    }
};

export const stopListening = () => {
    if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try {
            recognition.stop();
        } catch (e) {
            // ignore
        }
        recognition = null;
    }
};

export const detectLanguage = (text: string): string => {
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasGujarati = /[\u0A80-\u0AFF]/.test(text);

    if (hasGujarati) return 'gu-IN';
    if (hasDevanagari) return 'hi-IN';
    return 'en-IN';
};
