import { useChat, useAutoScroll } from '../hooks';
import { ChatHeader, ChatWelcome, ChatMessage, ChatLoading, ChatInput } from '../components/chat';

export default function Chat() {
    const { 
        messages, 
        isLoading, 
        sendMessage, 
        clearHistory, 
        getUserMessageCount, 
        hasMessages 
    } = useChat();
    
    const chatEndRef = useAutoScroll<HTMLDivElement>(messages);

    return (
        <div className="flex flex-col h-[100dvh] w-screen bg-gray-900 text-white font-sans">
            <ChatHeader 
                messageCount={getUserMessageCount()}
                onClearHistory={clearHistory}
                hasMessages={hasMessages}
            />

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {!hasMessages && <ChatWelcome />}
                
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
                
                {isLoading && <ChatLoading hasContext={hasMessages} />}
                
                <div ref={chatEndRef} />
            </div>

            <ChatInput 
                onSendMessage={sendMessage}
                disabled={isLoading}
            />
        </div>
    );
}
