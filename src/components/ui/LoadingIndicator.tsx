interface LoadingIndicatorProps {
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingIndicator({ size = 'md' }: LoadingIndicatorProps) {
    const sizeClasses = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3'
    };

    return (
        <div className="flex items-center space-x-2">
            <span className={`${sizeClasses[size]} bg-cyan-400 rounded-full animate-pulse delay-0`}></span>
            <span className={`${sizeClasses[size]} bg-cyan-400 rounded-full animate-pulse delay-150`}></span>
            <span className={`${sizeClasses[size]} bg-cyan-400 rounded-full animate-pulse delay-300`}></span>
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
