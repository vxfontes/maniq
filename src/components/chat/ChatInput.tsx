import React, { useState } from 'react';
import { Input } from '../ui';
import sendIcon from '../../assets/buttonsend.svg';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={disabled}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    className="bg-cyan-500 text-gray-900 rounded-full p-3 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                >
                    <img src={sendIcon} alt="Enviar" className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
