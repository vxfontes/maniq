import { useState, useEffect } from 'react';
import { parseAIResponse } from '../utils';
import { CHAT_CONSTANTS } from '../constants';
import type { ParsedResponse } from '../types';

export function useTypewriter(content: string) {
    const [displayedText, setDisplayedText] = useState('');
    const [finishedTyping, setFinishedTyping] = useState(false);
    const [parsedResponse, setParsedResponse] = useState<ParsedResponse | null>(null);

    useEffect(() => {
        // Reset estados quando o conteúdo muda
        setDisplayedText('');
        setFinishedTyping(false);
        
        // Parse da resposta da IA
        const parsed = parseAIResponse(content);
        setParsedResponse(parsed);

        // Texto para mostrar no typewriter
        const textToDisplay = parsed.reasoning;

        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(textToDisplay.slice(0, i + 1));
            i++;
            if (i >= textToDisplay.length) {
                clearInterval(interval);
                setFinishedTyping(true);
            }
        }, CHAT_CONSTANTS.TYPEWRITER_SPEED);

        return () => clearInterval(interval);
    }, [content]);

    return {
        displayedText,
        finishedTyping,
        suggestions: parsedResponse?.suggestions || []
    };
}
