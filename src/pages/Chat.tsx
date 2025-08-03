import { useState, useEffect, useRef } from "react";
import { getGroqChatCompletion } from "../api/ia";
import sendIcon from '../asset/buttonsend.svg';
import type { Message } from "../interface/message";

function TypewriterMessage({ content }: { content: string }) {
    const [displayedText, setDisplayedText] = useState('');
    const [finishedTyping, setFinishedTyping] = useState(false);

    const razaoMatch = content.match(/<razao>([\s\S]*?)<\/razao>/)?.[1]?.trim() || '';
    const sugestaoMatch = content.match(/<sugestao>([\s\S]*?)<\/sugestao>/)?.[1] || '';
    const sugestoes = [...sugestaoMatch.matchAll(/<item>(.*?)<\/item>/g)].map(([, item]) => item.trim());

    // Se não houver tags, mostra o conteúdo completo
    const textToDisplay = razaoMatch || content;

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(textToDisplay.slice(0, i + 1));
            i++;
            if (i >= textToDisplay.length) {
                clearInterval(interval);
                setFinishedTyping(true);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [textToDisplay]);

    return (
        <div className="space-y-3">
            <p className="text-base text-white whitespace-pre-wrap">{displayedText}</p>
            {finishedTyping && sugestoes.length > 0 && (
                <div className="space-y-2 mt-4">
                    <p className="text-sm text-cyan-300 font-medium">Sugestões:</p>
                    {sugestoes.map((item, idx) => (
                        <div
                            key={idx}
                            style={{ animationDelay: `${idx * 150}ms` }}
                            className="bg-cyan-800/30 border border-cyan-600 rounded-xl px-4 py-3 text-white shadow-sm animate-fade-in-up opacity-0"
                        >
                            <span className="text-cyan-200">•</span> {item}
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

    useEffect(() => {
        const savedMessages = localStorage.getItem('manifodase-chat-history');
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Erro ao carregar histórico:', error);
            }
        }
    }, []);

    // salva no localStorage sempre que as mensagens mudarem
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('manifodase-chat-history', JSON.stringify(messages));
        }
    }, [messages]);

    // rolar para a última mensagem
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem('manifodase-chat-history');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // histórico + nova mensagem
            const allMessages = [...messages, userMessage].map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            }));
            
            const completion = await getGroqChatCompletion(allMessages);
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
            <div className="bg-gray-800 p-4 shadow-md border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-cyan-400">ManiFodase</h1>
                <div className="flex items-center gap-3">
                    {messages.length > 0 && (
                        <span className="text-sm text-cyan-300 bg-cyan-900/30 px-3 py-1 rounded-full">
                            Contexto: {messages.filter(m => m.role === 'user').length} mensagens
                        </span>
                    )}
                    {messages.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="text-sm text-gray-300 hover:text-red-400 bg-gray-700 hover:bg-red-900/30 px-3 py-1 rounded-full transition duration-200"
                            title="Limpar histórico da conversa"
                        >
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center space-y-4 max-w-md">
                            <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-2xl font-bold text-gray-900">IA</span>
                            </div>
                            <h2 className="text-xl font-semibold text-cyan-400">Olá! Sou a manifodase.</h2>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Me conte sobre seu humor da semana e seus compromissos para que eu possa sugerir 
                                a esmaltação perfeita para você! Podemos conversar sobre isso para dar sugestões cada vez mais personalizadas.
                            </p>
                        </div>
                    </div>
                )}
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
                        <div className="bg-gray-700 rounded-2xl px-4 py-3 shadow-lg">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                            {messages.length > 0 && (
                                <p className="text-xs text-cyan-300 mt-2">
                                    Analisando contexto da conversa...
                                </p>
                            )}
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
                        <img src={sendIcon} alt="Enviar" />
                    </button>
                </form>
            </div>
        </div>
    );
};