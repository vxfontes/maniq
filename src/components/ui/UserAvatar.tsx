interface UserAvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ src, alt = 'User', size = 'md' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-600`}>
            {src ? (
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                            (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                        }
                    }}
                />
            ) : null}
            <div 
                className={`w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold ${src ? 'hidden' : 'flex'}`}
            >
                {getInitials(alt)}
            </div>
        </div>
    );
}
