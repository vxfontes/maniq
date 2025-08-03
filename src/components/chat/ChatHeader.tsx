import { Button } from '../ui';

interface ChatHeaderProps {
    messageCount: number;
    onClearHistory: () => void;
    hasMessages: boolean;
}

export function ChatHeader({ messageCount, onClearHistory, hasMessages }: ChatHeaderProps) {
    return (
        <div className="bg-gray-800 p-4 shadow-md border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-xl font-bold text-cyan-400">ManiFodase</h1>
            <div className="flex items-center gap-3">
                {hasMessages && (
                    <span className="text-sm text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-full">
                        {messageCount} mensagens
                    </span>
                )}
                {hasMessages && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onClearHistory}
                        title="Limpar histórico da conversa"
                    >
                        Limpar
                    </Button>
                )}
            </div>
        </div>
    );
}
