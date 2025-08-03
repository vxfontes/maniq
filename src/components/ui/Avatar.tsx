interface AvatarProps {
    type: 'ai' | 'user';
    size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ type, size = 'md' }: AvatarProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const typeConfig = {
        ai: {
            bg: 'bg-cyan-500',
            text: 'text-gray-900',
            label: 'IA'
        },
        user: {
            bg: 'bg-blue-600',
            text: 'text-white',
            label: 'Eu'
        }
    };

    const config = typeConfig[type];
    const classes = `${sizeClasses[size]} rounded-full ${config.bg} flex items-center justify-center ${config.text} font-bold flex-shrink-0`;

    return (
        <div className={classes}>
            {config.label}
        </div>
    );
}
