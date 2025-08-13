import type { Message } from '../types';
import type { AuthUser, ChatMessage } from '../types/auth';
import { CHAT_CONSTANTS } from '../constants';
import { firestoreService } from './firestore';

export class StorageService {
    private static instance: StorageService;
    private readonly storageKey = CHAT_CONSTANTS.STORAGE_KEY;
    private currentChatId: string | null = null;

    private constructor() {}

    static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    /**
     * Define o ID da sessão de chat atual
     */
    setCurrentChatId(chatId: string | null): void {
        this.currentChatId = chatId;
    }

    /**
     * Obtém o ID da sessão de chat atual
     */
    getCurrentChatId(): string | null {
        return this.currentChatId;
    }

    /**
     * Converte Message para ChatMessage
     */
    private messagesToChatMessages(messages: Message[]): ChatMessage[] {
        return messages.map(msg => ({
            ...msg,
            timestamp: new Date()
        }));
    }

    /**
     * Converte ChatMessage para Message
     */
    private chatMessagesToMessages(chatMessages: ChatMessage[]): Message[] {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return chatMessages.map(({ timestamp, ...msg }) => msg);
    }

    /**
     * Salva as mensagens (localStorage ou Firebase)
     */
    async saveMessages(messages: Message[], user?: AuthUser | null): Promise<string | void> {
        try {
            if (user) {
                // Usuário logado - usar Firebase
                const chatMessages = this.messagesToChatMessages(messages);
                
                if (this.currentChatId) {
                    // Atualizar chat existente
                    await firestoreService.updateChat(this.currentChatId, chatMessages);
                    return this.currentChatId;
                } else {
                    // Criar novo chat
                    const chatId = await firestoreService.saveChat(user.uid, chatMessages);
                    this.currentChatId = chatId;
                    return chatId;
                }
            } else {
                // Usuário não logado - usar localStorage
                if (messages.length > 0) {
                    localStorage.setItem(this.storageKey, JSON.stringify(messages));
                }
            }
        } catch (error) {
            console.error('Erro ao salvar mensagens:', error);
            // Fallback para localStorage em caso de erro
            if (messages.length > 0) {
                localStorage.setItem(this.storageKey, JSON.stringify(messages));
            }
        }
    }

    /**
     * Carrega as mensagens do localStorage
     */
    loadMessages(): Message[] {
        try {
            const savedMessages = localStorage.getItem(this.storageKey);
            if (savedMessages) {
                return JSON.parse(savedMessages);
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens do localStorage:', error);
        }
        return [];
    }

    /**
     * Carrega uma sessão de chat específica do Firebase
     */
    async loadChatSession(chatId: string, user: AuthUser): Promise<Message[]> {
        try {
            const chats = await firestoreService.getUserChats(user.uid);
            const chat = chats.find(c => c.id === chatId);
            
            if (chat) {
                this.currentChatId = chatId;
                return this.chatMessagesToMessages(chat.messages);
            }
        } catch (error) {
            console.error('Erro ao carregar sessão de chat:', error);
        }
        return [];
    }

    /**
     * Obtém o histórico de chats do usuário
     */
    async getUserChatHistory(user: AuthUser) {
        try {
            return await firestoreService.getUserChats(user.uid);
        } catch (error) {
            console.error('Erro ao carregar histórico de chats:', error);
            return [];
        }
    }

    /**
     * Remove todas as mensagens (localStorage e reseta sessão atual)
     */
    clearMessages(): void {
        try {
            localStorage.removeItem(this.storageKey);
            this.currentChatId = null;
        } catch (error) {
            console.error('Erro ao limpar mensagens do localStorage:', error);
        }
    }

    /**
     * Deleta uma sessão de chat específica
     */
    async deleteChatSession(chatId: string): Promise<void> {
        try {
            await firestoreService.deleteChat(chatId);
            if (this.currentChatId === chatId) {
                this.currentChatId = null;
            }
        } catch (error) {
            console.error('Erro ao deletar sessão de chat:', error);
            throw error;
        }
    }

    /**
     * Inicia uma nova sessão de chat
     */
    startNewChat(): void {
        this.currentChatId = null;
    }
}

export const storageService = StorageService.getInstance();
