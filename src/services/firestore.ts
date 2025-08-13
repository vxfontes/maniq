import { 
    collection, 
    doc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    limit,
    serverTimestamp,
    type Timestamp 
} from 'firebase/firestore';
import { db } from '../api/key';
import type { ChatSession, ChatMessage } from '../types';

export class FirestoreService {
    private static instance: FirestoreService;
    private readonly chatsCollection = 'chats';

    private constructor() {}

    static getInstance(): FirestoreService {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService();
        }
        return FirestoreService.instance;
    }

    /**
     * Converte Timestamp do Firebase para Date
     */
    private timestampToDate(timestamp: Timestamp | Date): Date {
        if (timestamp instanceof Date) {
            return timestamp;
        }
        return timestamp.toDate();
    }

    /**
     * Salva uma nova sessão de chat
     */
    async saveChat(userId: string, messages: ChatMessage[], title?: string): Promise<string> {
        try {
            const chatTitle = title || this.generateChatTitle(messages);
            const docRef = await addDoc(collection(db, this.chatsCollection), {
                userId,
                title: chatTitle,
                messages,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error('Erro ao salvar chat:', error);
            throw error;
        }
    }

    /**
     * Atualiza uma sessão de chat existente
     */
    async updateChat(chatId: string, messages: ChatMessage[], title?: string): Promise<void> {
        try {
            const docRef = doc(db, this.chatsCollection, chatId);
            const updateData: {
                messages: ChatMessage[];
                updatedAt: ReturnType<typeof serverTimestamp>;
                title?: string;
            } = {
                messages,
                updatedAt: serverTimestamp(),
            };

            if (title) {
                updateData.title = title;
            }

            await updateDoc(docRef, updateData);
        } catch (error) {
            console.error('Erro ao atualizar chat:', error);
            throw error;
        }
    }

    /**
     * Carrega todos os chats de um usuário
     */
    async getUserChats(userId: string): Promise<ChatSession[]> {
        try {
            const q = query(
                collection(db, this.chatsCollection),
                where('userId', '==', userId),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            const chats: ChatSession[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                chats.push({
                    id: doc.id,
                    userId: data.userId,
                    title: data.title,
                    messages: data.messages || [],
                    createdAt: this.timestampToDate(data.createdAt),
                    updatedAt: this.timestampToDate(data.updatedAt),
                });
            });

            chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

            return chats;
        } catch (error) {
            console.error('Erro ao carregar chats do usuário:', error);
            throw error;
        }
    }

    /**
     * Deleta uma sessão de chat
     */
    async deleteChat(chatId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, this.chatsCollection, chatId));
        } catch (error) {
            console.error('Erro ao deletar chat:', error);
            throw error;
        }
    }

    /**
     * Gera um título baseado na primeira mensagem do usuário
     */
    private generateChatTitle(messages: ChatMessage[]): string {
        const firstUserMessage = messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            const title = firstUserMessage.content.substring(0, 50);
            return title.length > 50 ? title + '...' : title;
        }
        return 'Nova conversa';
    }
}

export const firestoreService = FirestoreService.getInstance();
