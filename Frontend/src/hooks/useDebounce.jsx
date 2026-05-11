import { useRef, useCallback } from 'react';

export default function useDebouncedCallback(callback, delay) {
    const timerRef = useRef();

    const debouncedFn = useCallback((...args) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedFn;
}