import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { storageService, aiService } from '../services';
import { useAuth } from './useAuth';

export function useChat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastMessageIndex, setLastMessageIndex] = useState(-1); // Índice da última mensagem antes de carregar/iniciar

    // Carrega mensagens na inicialização
    useEffect(() => {
        if (!user) {
            // Usuário não logado - carrega do localStorage
            const savedMessages = storageService.loadMessages();
            if (savedMessages.length > 0) {
                setMessages(savedMessages);
                setLastMessageIndex(savedMessages.length - 1); // Todas as mensagens existentes não devem ter typewriter
            }
        }
        // Para usuários logados, as mensagens são carregadas quando uma sessão é selecionada
    }, [user]);

    useEffect(() => {
        if (messages.length > 0) {
            storageService.saveMessages(messages, user);
        }
    }, [messages, user]);

    const sendMessage = useCallback(async (content: string): Promise<void> => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: content.trim() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const allMessages = [...messages, userMessage];
            const response = await aiService.getChatCompletion(allMessages);
            
            const assistantMessage: Message = { 
                role: 'assistant', 
                content: response 
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            // Não atualizar lastMessageIndex aqui - novas mensagens devem ter typewriter
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            const errorMessage: Message = { 
                role: 'assistant', 
                content: 'Desculpe, ocorreu um erro ao me comunicar com a IA. Por favor, tente novamente.' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    const clearHistory = useCallback(() => {
        setMessages([]);
        setLastMessageIndex(-1);
        storageService.clearMessages();
    }, []);

    const startNewChat = useCallback(() => {
        setMessages([]);
        setLastMessageIndex(-1); // Reset para chat novo
        storageService.startNewChat();
    }, []);

    const loadChatSession = useCallback(async (chatId: string) => {
        if (!user) return;
        
        try {
            const sessionMessages = await storageService.loadChatSession(chatId, user);
            setMessages(sessionMessages);
            setLastMessageIndex(sessionMessages.length - 1); // Mensagens carregadas não devem ter typewriter
        } catch (error) {
            console.error('Erro ao carregar sessão de chat:', error);
        }
    }, [user]);

    const getUserMessageCount = useCallback(() => {
        return messages.filter(m => m.role === 'user').length;
    }, [messages]);

    const shouldMessageTypewrite = useCallback((messageIndex: number, message: Message) => {
        // Apenas mensagens da IA que são novas (índice maior que lastMessageIndex) devem usar typewriter
        return message.role === 'assistant' && messageIndex > lastMessageIndex;
    }, [lastMessageIndex]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearHistory,
        startNewChat,
        loadChatSession,
        getUserMessageCount,
        shouldMessageTypewrite,
        hasMessages: messages.length > 0
    };
}
