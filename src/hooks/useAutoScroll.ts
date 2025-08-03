import { useEffect, useRef } from 'react';
import { UI_CONSTANTS } from '../constants';

export function useAutoScroll<T extends HTMLElement>(dependency: unknown) {
    const ref = useRef<T>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({ 
            behavior: UI_CONSTANTS.SCROLL_BEHAVIOR 
        });
    }, [dependency]);

    return ref;
}
