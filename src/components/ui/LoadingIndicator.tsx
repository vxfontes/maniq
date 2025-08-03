export function LoadingIndicator() {
    return (
        <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
        </div>
    );
}

interface LoadingMessageProps {
    hasContext: boolean;
}

export function LoadingMessage({ hasContext }: LoadingMessageProps) {
    return (
        <div className="bg-gray-700 rounded-2xl px-4 py-3 shadow-lg">
            <LoadingIndicator />
            {hasContext && (
                <p className="text-xs text-cyan-300 mt-2">
                    Analisando contexto da conversa...
                </p>
            )}
        </div>
    );
}
