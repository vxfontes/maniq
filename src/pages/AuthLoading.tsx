import { useState, useEffect } from 'react';

export default function AuthLoading() {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [, setDots] = useState(['', '', '']);

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

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                const newDots = [...prev];
                const activeIndex = newDots.findIndex(dot => dot === '');
                if (activeIndex !== -1) {
                    newDots[activeIndex] = '•';
                } else {
                    return ['', '', ''];
                }
                return newDots;
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

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

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-8 animate-fade-in-up">
                    <div className="relative">
                        <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                            ManiFodase
                        </h1>
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-2xl -z-10 rounded-lg animate-pulse"></div>
                    </div>

                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full animate-spin"></div>
                            <div className="absolute top-2 left-2 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-b-purple-400 border-l-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
