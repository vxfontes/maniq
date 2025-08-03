export const CHAT_CONSTANTS = {
    STORAGE_KEY: 'manifodase-chat-history',
    TYPEWRITER_SPEED: 20,
    ANIMATION_DELAY: 150,
    MAX_RETRIES: 3,
} as const;

export const UI_CONSTANTS = {
    SCROLL_BEHAVIOR: 'smooth' as const,
    AVATAR_LABELS: {
        AI: 'IA',
        USER: 'Eu',
    },
} as const;

export const API_CONSTANTS = {
    MODEL: 'meta-llama/llama-4-scout-17b-16e-instruct',
    TEMPERATURE: 0.5,
} as const;
