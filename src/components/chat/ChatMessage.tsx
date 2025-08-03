import type { Message } from '../../types';
import { Avatar } from '../ui';
import { TypewriterMessage } from './TypewriterMessage';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <Avatar type="ai" />}

            <div
                className={`max-w-lg lg:max-w-2xl rounded-2xl px-4 py-3 shadow-lg ${
                    isUser
                        ? 'bg-blue-600 rounded-br-none'
                        : 'bg-gray-700 rounded-bl-none'
                }`}
            >
                {message.role === 'assistant' ? (
                    <TypewriterMessage content={message.content} />
                ) : (
                    <p className="text-base text-white">{message.content}</p>
                )}
            </div>

            {isUser && <Avatar type="user" />}
        </div>
    );
}
