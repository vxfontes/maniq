import { useState } from 'react';
import { useAuth } from '../../hooks';
import { Button, UserAvatar } from '../ui';

interface ChatHeaderProps {
    messageCount: number;
    onClearHistory: () => void;
    hasMessages: boolean;
    onToggleMobileMenu?: () => void;
    isMobileMenuOpen?: boolean;
}

export function ChatHeader({ 
    messageCount, 
    onClearHistory, 
    hasMessages, 
    onToggleMobileMenu,
    isMobileMenuOpen 
}: ChatHeaderProps) {
    const { user, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            setShowUserMenu(false);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className="bg-gray-800 p-4 shadow-md border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                {/* Menu Hambúrguer para Mobile */}
                {user && onToggleMobileMenu && (
                    <button
                        onClick={onToggleMobileMenu}
                        className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        aria-label="Abrir menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                )}
                
                <h1 className="text-xl font-bold text-cyan-400">ManiFodase</h1>
            </div>
            
            <div className="flex items-center gap-3">
                {hasMessages && (
                    <span className="text-sm text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-full hidden sm:block">
                        {messageCount} mensagens
                    </span>
                )}
                
                {hasMessages && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onClearHistory}
                        title="Limpar histórico da conversa"
                        className="hidden sm:block"
                    >
                        Limpar
                    </Button>
                )}

                {user && (
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 hover:bg-gray-700 rounded-lg p-2 transition-colors"
                        >
                            <UserAvatar 
                                src={user.photoURL} 
                                alt={user.displayName || user.email}
                                size="sm"
                            />
                            <span className="text-sm text-gray-300 hidden md:block">
                                {user.displayName || user.email}
                            </span>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg border border-gray-600 z-50">
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-600">
                                        {user.email}
                                    </div>
                                    {hasMessages && (
                                        <button
                                            onClick={() => {
                                                onClearHistory();
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors sm:hidden"
                                        >
                                            Limpar Histórico
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 transition-colors"
                                    >
                                        Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
