import { useEffect, useRef } from 'react';

type SomeFunction = (...args: any[]) => void;
type Timer = ReturnType<typeof setTimeout>;

function useDebounce<Fn extends SomeFunction>(fn: Fn, delay: number) {
	const timer = useRef<Timer>();

	useEffect(() => {
		return () => {
			if (!timer.current) return;
			clearTimeout(timer.current);
		};
	}, []);

	const debouncedFunction = ((...args) => {
		const newTimer = setTimeout(() => {
			fn(...args);
		}, delay);
		clearTimeout(timer.current); //Cancel previous timers
		timer.current = newTimer; //Save latest timer
	}) as Fn;

	return debouncedFunction;
}

export { useDebounce };
