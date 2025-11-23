import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Sesion } from '../../types';

const initialValue = browser ? JSON.parse(localStorage.getItem('sesion') || 'null') : null;

export const currentSesion = writable<Sesion | null>(initialValue);

if (browser) {
	currentSesion.subscribe((value) => {
		localStorage.setItem('sesion', JSON.stringify(value));
	});
}

export const sesionStore = {
	subscribe: currentSesion.subscribe,
	set: currentSesion.set,
	update: currentSesion.update,
	reset: () => currentSesion.set(null)
};
