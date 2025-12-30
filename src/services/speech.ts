export const speak = (text: string, lang: string = 'en-US') => {
    if (!window.speechSynthesis) {
        console.warn("Text-to-speech not supported");
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = lang;

    const voices = window.speechSynthesis.getVoices();
    // Try to find a voice that matches the requested language
    // prioritizing Google/Microsoft natural voices
    const preferredVoice = voices.find(v =>
        v.lang.startsWith(lang.split('-')[0]) &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("India"))
    );

    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
};

let recognition: any = null;

export const startListening = (onResult: (text: string) => void) => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Good for Hinglish/Indian accents

    recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript.trim()) {
            onResult(transcript.trim());
        }
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
    };

    recognition.start();
};

export const stopListening = () => {
    if (recognition) {
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
