export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    input: string;
}

export interface SuggestionItem {
    id: string;
    content: string;
}

export interface ParsedResponse {
    reasoning: string;
    suggestions: SuggestionItem[];
}
