import { writable } from 'svelte/store';
import type { Sesion } from '../../types';

export const currentSesion = writable<Sesion| null>(null);

export const sesionStore = {
	subscribe: currentSesion.subscribe,
	set: currentSesion.set,
	update: currentSesion.update,
	reset: () => currentSesion.set(null)
};
