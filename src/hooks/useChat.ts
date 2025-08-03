import { useState, useEffect, useCallback } from 'react';
import type { Message } from '../types';
import { storageService, aiService } from '../services';

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Carrega mensagens do localStorage na inicialização
    useEffect(() => {
        const savedMessages = storageService.loadMessages();
        if (savedMessages.length > 0) {
            setMessages(savedMessages);
        }
    }, []);

    // Salva mensagens no localStorage sempre que mudarem
    useEffect(() => {
        if (messages.length > 0) {
            storageService.saveMessages(messages);
        }
    }, [messages]);

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
        storageService.clearMessages();
    }, []);

    const getUserMessageCount = useCallback(() => {
        return messages.filter(m => m.role === 'user').length;
    }, [messages]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearHistory,
        getUserMessageCount,
        hasMessages: messages.length > 0
    };
}
