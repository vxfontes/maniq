import { useTypewriter } from '../../hooks';
import { CHAT_CONSTANTS } from '../../constants';
import { parseAIResponse } from '../../utils';

interface TypewriterMessageProps {
    content: string;
    shouldTypewrite?: boolean;
}

export function TypewriterMessage({ content, shouldTypewrite = true }: TypewriterMessageProps) {
    const { displayedText, finishedTyping, suggestions } = useTypewriter(content, shouldTypewrite);

    // Se não deve usar typewriter, mostra o conteúdo completo diretamente
    if (!shouldTypewrite) {
        const parsed = parseAIResponse(content);
        return (
            <div className="space-y-3">
                <p className="text-base text-white whitespace-pre-wrap">{parsed.reasoning}</p>
                {parsed.suggestions.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <p className="text-sm text-cyan-300 font-medium">Sugestões:</p>
                        {parsed.suggestions.map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="bg-cyan-800/30 border border-cyan-600 rounded-xl px-4 py-3 text-white shadow-sm"
                            >
                                <span className="text-cyan-200">•</span> {suggestion.content}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <p className="text-base text-white whitespace-pre-wrap">{displayedText}</p>
            {finishedTyping && suggestions.length > 0 && (
                <div className="space-y-2 mt-4">
                    <p className="text-sm text-cyan-300 font-medium">Sugestões:</p>
                    {suggestions.map((suggestion, idx) => (
                        <div
                            key={suggestion.id}
                            style={{ animationDelay: `${idx * CHAT_CONSTANTS.ANIMATION_DELAY}ms` }}
                            className="bg-cyan-800/30 border border-cyan-600 rounded-xl px-4 py-3 text-white shadow-sm animate-fade-in-up opacity-0"
                        >
                            <span className="text-cyan-200">•</span> {suggestion.content}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
