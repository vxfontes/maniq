import type { Message } from '../types';
import { CHAT_CONSTANTS } from '../constants';

export class StorageService {
    private static instance: StorageService;
    private readonly storageKey = CHAT_CONSTANTS.STORAGE_KEY;

    private constructor() {}

    static getInstance(): StorageService {
        if (!StorageService.instance) {
            StorageService.instance = new StorageService();
        }
        return StorageService.instance;
    }

    /**
     * Salva as mensagens no localStorage
     */
    saveMessages(messages: Message[]): void {
        try {
            if (messages.length > 0) {
                localStorage.setItem(this.storageKey, JSON.stringify(messages));
            }
        } catch (error) {
            console.error('Erro ao salvar mensagens no localStorage:', error);
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
     * Remove todas as mensagens do localStorage
     */
    clearMessages(): void {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Erro ao limpar mensagens do localStorage:', error);
        }
    }
}

export const storageService = StorageService.getInstance();
