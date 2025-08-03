import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export function Button({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    children, 
    className = '', 
    disabled,
    ...props 
}: ButtonProps) {
    const baseClasses = 'font-medium rounded-full transition duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-cyan-500 text-gray-900 hover:bg-cyan-400 focus:ring-cyan-300 disabled:bg-gray-600',
        secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 disabled:bg-gray-600'
    };

    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button 
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? 'Carregando...' : children}
        </button>
    );
}
