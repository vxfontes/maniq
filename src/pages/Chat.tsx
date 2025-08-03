import { useState, useEffect, useRef } from "react";
import { getGroqChatCompletion } from "../api/ia";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function TypewriterMessage({ content }: { content: string }) {
    const [displayedText, setDisplayedText] = useState('');
    const [finishedTyping, setFinishedTyping] = useState(false);

    const razaoMatch = content.match(/<razao>([\s\S]*?)<\/razao>/)?.[1]?.trim() || '';
    const sugestoes = [...content.matchAll(/<item>(.*?)<\/item>/g)].map(([, item]) => item.trim());

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(razaoMatch.slice(0, i + 1));
            i++;
            if (i >= razaoMatch.length) {
                clearInterval(interval);
                setFinishedTyping(true);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [razaoMatch]);

    return (
        <div className="space-y-3">
            <p className="text-base text-white whitespace-pre-wrap">{displayedText}</p>
            {finishedTyping && sugestoes.length > 0 && (
                <div className="space-y-2 mt-2">
                    {sugestoes.map((item, idx) => (
                        <div
                            key={idx}
                            style={{ animationDelay: `${idx * 150}ms` }}
                            className="bg-cyan-800/30 border border-cyan-600 rounded-xl px-4 py-2 text-white shadow-sm animate-fade-in-up opacity-0"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Efeito para rolar para a última mensagem
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Chama a função da API Groq
            const completion = await getGroqChatCompletion(input);
            const assistantMessage = completion.choices[0]?.message;

            if (assistantMessage && assistantMessage.content) {
                setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage.content ?? '' }]);
            } else {
                throw new Error("Resposta da API inválida.");
            }
        } catch (error) {
            console.error("Erro ao buscar resposta da API:", error);
            const errorMessage: Message = { role: 'assistant', content: 'Desculpe, ocorreu um erro ao me comunicar com a IA. Por favor, tente novamente.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] w-screen bg-gray-900 text-white font-sans">
            <div className="bg-gray-800 p-4 shadow-md border-b border-gray-700">
                <h1 className="text-xl font-bold text-center text-cyan-400">ManiFodase</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-gray-900 font-bold text-sm flex-shrink-0">IA</div>
                        )}

                        <div
                            className={`max-w-lg lg:max-w-2xl rounded-2xl px-4 py-3 shadow-lg ${msg.role === 'user'
                                ? 'bg-blue-600 rounded-br-none'
                                : 'bg-gray-700 rounded-bl-none'
                                }`}
                        >
                            {msg.role === 'assistant' ? (
                                <TypewriterMessage content={msg.content} />
                            ) : (
                                <p className="text-base">{msg.content}</p>
                            )}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">Eu</div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-gray-900 font-bold text-sm flex-shrink-0">IA</div>
                        <div className="bg-gray-700 rounded-2xl px-4 py-3 shadow-lg flex items-center space-x-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-cyan-500 text-gray-900 rounded-full p-3 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};