import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { storageService } from '../../services';
import type { ChatSession } from '../../types';
import { LoadingIndicator, Button } from '../ui';

interface ChatHistoryProps {
    onSelectChat: (chatId: string) => void;
    onStartNewChat: () => void;
    currentChatId?: string | null;
    isMobile?: boolean;
    onCloseMobile?: () => void;
    refreshTrigger?: number;
}

export function ChatHistory({ 
    onSelectChat, 
    onStartNewChat, 
    currentChatId, 
    isMobile = false,
    onCloseMobile,
    refreshTrigger = 0
}: ChatHistoryProps) {
    const { user } = useAuth();
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Se é um refresh (não o carregamento inicial), mostrar indicador
                if (refreshTrigger > 0) {
                    setIsRefreshing(true);
                } else {
                    setLoading(true);
                }
                
                const history = await storageService.getUserChatHistory(user);
                setChatHistory(history);
            } catch (error) {
                console.error('Erro ao carregar histórico:', error);
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        };

        loadHistory();
    }, [user, refreshTrigger]); // Adicionado refreshTrigger como dependência

    const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        
        if (confirm('Tem certeza que deseja deletar esta conversa?')) {
            try {
                await storageService.deleteChatSession(chatId);
                setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
                
                if (currentChatId === chatId) {
                    onStartNewChat();
                }
            } catch (error) {
                console.error('Erro ao deletar chat:', error);
            }
        }
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return 'Hoje';
        } else if (days === 1) {
            return 'Ontem';
        } else if (days < 7) {
            return `${days} dias atrás`;
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    };

    if (!user) {
        return null;
    }

    const sidebarClasses = isMobile 
        ? "w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full"
        : "w-80 bg-gray-800 border-r border-gray-700 flex flex-col";

    return (
        <div className={sidebarClasses}>
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <Button
                    onClick={onStartNewChat}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    Nova Conversa
                </Button>
                
                {/* Indicador de refresh */}
                {isRefreshing && (
                    <div className="ml-3 p-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                    </div>
                )}
                
                {/* Botão de fechar para mobile */}
                {isMobile && onCloseMobile && (
                    <button
                        onClick={onCloseMobile}
                        className="ml-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="Fechar menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-4 flex justify-center">
                        <LoadingIndicator />
                    </div>
                ) : chatHistory.length === 0 ? (
                    <div className="p-4 text-gray-400 text-center text-sm">
                        Nenhuma conversa ainda
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {chatHistory.map((chat, index) => {
                            // Destacar a conversa atual (recém-criada) com animação
                            const isCurrentChat = currentChatId === chat.id;
                            const isNewChat = index === 0 && refreshTrigger > 0 && isCurrentChat;
                            
                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-700 transition-colors group ${
                                        isCurrentChat ? 'bg-gray-700' : ''
                                    } ${isNewChat ? 'animate-fade-in-up ring-2 ring-cyan-500 ring-opacity-50' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-sm font-medium truncate">
                                                {chat.title}
                                            </h4>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {formatDate(chat.updatedAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDeleteChat(chat.id, e)}
                                            className={`text-gray-400 hover:text-red-400 transition-all ml-2 p-1 rounded-md hover:bg-gray-600 ${
                                                isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                            title="Deletar conversa"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v1H4V5zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                    clipRule="evenodd"
                                                />
                                                <path d="M5 11a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM5 15a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
