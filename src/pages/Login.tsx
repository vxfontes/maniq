import { useState, useEffect } from 'react';
import { useAuth } from '../hooks';
import GoogleIcon from '../assets/google-icon.svg';

export default function Login() {
    const { signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            await signInWithGoogle();
        } catch (error) {
            setError('Erro ao fazer login. Tente novamente.');
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-w-screen relative overflow-hidden">
            <div 
                className="absolute inset-0 transition-all duration-1000 ease-out"
                style={{
                    background: `
                        radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                            rgba(34, 211, 238, 0.15) 0%, 
                            transparent 50%),
                        radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
                            rgba(147, 51, 234, 0.1) 0%, 
                            transparent 50%),
                        linear-gradient(135deg, 
                            #0f172a 0%, 
                            #1e293b 25%, 
                            #334155 50%, 
                            #1e293b 75%, 
                            #0f172a 100%)
                    `
                }}
            />

            {/* Partículas flutuantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20 animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Conteúdo principal */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    {/* Header com animação */}
                    <div className="text-center mb-12 animate-fade-in-up">
                        <div className="relative mb-6">
                            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                                ManiFodase
                            </h1>
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl -z-10 rounded-lg"></div>
                        </div>
                        <p className="text-gray-300 text-lg font-light tracking-wide">
                            Transforme suas unhas em arte
                        </p>
                        <div className="mt-4 w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
                    </div>

                    {/* Card principal */}
                    <div 
                        className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-cyan-500/20"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            transform: isHovered ? 'translateY(-5px)' : 'translateY(0px)',
                        }}
                    >
                        {/* Efeito de brilho no hover */}
                        <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/10 via-transparent to-purple-400/10"></div>
                        </div>

                        <div className="relative space-y-6">
                            {/* Mensagem de erro */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-300 text-sm text-center backdrop-blur-sm animate-fade-in-up">
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                </div>
                            )}

                            {/* Botão principal */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="group relative w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold py-3 px-4 sm:py-4 sm:px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50 overflow-hidden"
                            >
                                {/* Efeito shimmer */}
                                <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent skew-y-12 group-hover:animate-pulse"></div>
                                
                                <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                                    {loading ? (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                                            <span className="text-sm sm:text-base">Entrando...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-1.5 sm:p-2 bg-white/20 rounded-full">
                                                <img src={GoogleIcon} alt="Google" className="w-4 h-4 sm:w-5 sm:h-5 brightness-0 invert" />
                                            </div>
                                            <span className="text-sm sm:text-lg whitespace-nowrap">Continuar com Google</span>
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-pulse"></div>
                                        </>
                                    )}
                                </div>
                            </button>

                            {/* Disclaimer */}
                            <div className="text-center text-xs text-gray-500 leading-relaxed">
                                Ao continuar, você aceita nossos{' '}
                                <button className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                                    Termos de Uso
                                </button>{' '}
                                e{' '}
                                <button className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                                    Política de Privacidade
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
