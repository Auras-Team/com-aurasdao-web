import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface SwapData<Type> {
	state: Writable<Type | null>;
	swapTo: (to: Type) => void;
	onOutro: () => void;
}

export function swapTransition<Type>(init: Type | null): SwapData<Type> {
	const state = writable(init);
	let next = init;

	const swapTo = (to: Type): void => {
		if (next === to) return;
		state.set(null);
		next = to;
	};

	const onOutro = (): void => {
		state.set(next);
	};

	return {
		state,
		swapTo,
		onOutro
	};
}
