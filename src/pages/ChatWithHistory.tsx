import { useState, useEffect } from 'react';
import { useChat, useAutoScroll, useAuth } from '../hooks';
import { ChatHeader, ChatWelcome, ChatMessage, ChatLoading, ChatInput, ChatHistory } from '../components/chat';
import { storageService } from '../services';

export default function ChatWithHistory() {
    const { user } = useAuth();
    const { 
        messages, 
        isLoading, 
        sendMessage, 
        clearHistory, 
        startNewChat,
        loadChatSession,
        getUserMessageCount, 
        hasMessages 
    } = useChat();
    
    const chatEndRef = useAutoScroll<HTMLDivElement>(messages);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [refreshHistory, setRefreshHistory] = useState(0);

    // Controlar scroll do body quando menu mobile está aberto
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mobile-menu-open');
        } else {
            document.body.classList.remove('mobile-menu-open');
        }

        // Cleanup ao desmontar o componente
        return () => {
            document.body.classList.remove('mobile-menu-open');
        };
    }, [isMobileMenuOpen]);

    const handleSelectChat = async (chatId: string) => {
        setCurrentChatId(chatId);
        await loadChatSession(chatId);
        setIsMobileMenuOpen(false); // Fechar menu móvel após selecionar chat
    };

    const handleStartNewChat = () => {
        setCurrentChatId(null);
        startNewChat();
        setIsMobileMenuOpen(false); // Fechar menu móvel ao iniciar novo chat
    };

    const handleClearHistory = () => {
        clearHistory();
        setCurrentChatId(null);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="flex h-[100dvh] w-screen bg-gray-900 text-white font-sans">
            {/* Desktop Sidebar */}
            {user && (
                <div className="hidden md:block">
                    <ChatHistory
                        onSelectChat={handleSelectChat}
                        onStartNewChat={handleStartNewChat}
                        currentChatId={currentChatId}
                        refreshTrigger={refreshHistory}
                    />
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Sidebar */}
            {user && (
                <div 
                    className={`
                        fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out md:hidden
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu de navegação"
                >
                    <ChatHistory
                        onSelectChat={handleSelectChat}
                        onStartNewChat={handleStartNewChat}
                        currentChatId={currentChatId}
                        isMobile={true}
                        onCloseMobile={() => setIsMobileMenuOpen(false)}
                        refreshTrigger={refreshHistory}
                    />
                </div>
            )}

            <div className="flex flex-col flex-1 min-w-0">
                <ChatHeader 
                    messageCount={getUserMessageCount()}
                    onClearHistory={handleClearHistory}
                    hasMessages={hasMessages}
                    onToggleMobileMenu={toggleMobileMenu}
                    isMobileMenuOpen={isMobileMenuOpen}
                />

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {!hasMessages && <ChatWelcome />}
                    
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                    
                    {isLoading && <ChatLoading hasContext={hasMessages} />}
                    
                    <div ref={chatEndRef} />
                </div>

                <ChatInput 
                    onSendMessage={async (content) => {
                        const wasNewChat = !currentChatId && messages.length === 0;
                        
                        await sendMessage(content);
                        
                        // Se era uma nova conversa e agora temos mensagens, atualizar histórico
                        if (user && wasNewChat) {
                            // Pequeno delay para garantir que o chat foi salvo
                            setTimeout(() => {
                                const newChatId = storageService.getCurrentChatId();
                                if (newChatId && newChatId !== currentChatId) {
                                    setCurrentChatId(newChatId);
                                    // Atualizar o histórico para mostrar a nova conversa
                                    setRefreshHistory(prev => prev + 1);
                                }
                            }, 500);
                        } else if (user && !currentChatId) {
                            // Para outros casos onde o chat ID pode ter mudado
                            const chatId = storageService.getCurrentChatId();
                            if (chatId !== currentChatId) {
                                setCurrentChatId(chatId);
                                setRefreshHistory(prev => prev + 1);
                            }
                        }
                    }}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}
