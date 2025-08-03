export function ChatWelcome() {
    return (
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
    );
}
