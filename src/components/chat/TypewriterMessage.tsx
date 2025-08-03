import { useTypewriter } from '../../hooks';
import { CHAT_CONSTANTS } from '../../constants';

interface TypewriterMessageProps {
    content: string;
}

export function TypewriterMessage({ content }: TypewriterMessageProps) {
    const { displayedText, finishedTyping, suggestions } = useTypewriter(content);

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
