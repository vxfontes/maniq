import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export function Input({ className = '', error, ...props }: InputProps) {
    const baseClasses = 'bg-gray-700 border border-gray-600 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200';
    const errorClasses = error ? 'border-red-500 focus:ring-red-300' : '';
    
    const classes = `${baseClasses} ${errorClasses} ${className}`;

    return (
        <div className="flex flex-col flex-1">
            <input className={classes} {...props} />
            {error && (
                <span className="text-red-400 text-sm mt-1 px-2">
                    {error}
                </span>
            )}
        </div>
    );
}
