import { useEffect, useState, useRef } from 'react';

// Hook for animating number changes
export function useCountUp(end, duration = 800) {
    const [count, setCount] = useState(end);
    const prevEndRef = useRef(end);

    useEffect(() => {
        // Only animate if the value actually changed
        if (prevEndRef.current === end) return;

        const start = prevEndRef.current;
        const increment = (end - start) / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;

            // Check if we've reached the target
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.round(current));
            }
        }, 16);

        prevEndRef.current = end;

        return () => clearInterval(timer);
    }, [end, duration]);

    return Math.round(count);
}

// Animated number component
export function AnimatedNumber({ value, className = '' }) {
    const animatedValue = useCountUp(value);

    return <span className={className}>{animatedValue.toLocaleString()}</span>;
}

// Animated time component (for hours/minutes)
export function AnimatedTime({ minutes, className = '' }) {
    const animatedMinutes = useCountUp(minutes);

    const hours = Math.floor(animatedMinutes / 60);
    const mins = Math.round(animatedMinutes % 60);

    if (hours > 0) {
        return <span className={className}>{hours}h {mins}m</span>;
    }
    return <span className={className}>{mins}m</span>;
}
