import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Sesion } from '../../types';
import { apiBase } from '@/stores/url';

const { subscribe } = apiBase;
let baseUrl: string = '';

subscribe((value) => {
	baseUrl = value;
})();

const initialValue = browser ? JSON.parse(localStorage.getItem('sesion') || 'null') : null;

export const currentSesion = writable<Sesion | null>(initialValue);

export const sesionStore = {
	subscribe: currentSesion.subscribe,
	set: currentSesion.set,
	update: currentSesion.update,
	reset: () => currentSesion.set(null)
};

if (browser) {
	currentSesion.subscribe((value) => {
		localStorage.setItem('sesion', JSON.stringify(value));
	});
}
if (browser) {
	const refreshAccessToken = async () => {
		try {
			const response = await fetch(baseUrl + '/api/auth/refresh', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			if (response.ok) {
				const data = await response.json();
				currentSesion.update((sesion) => {
					if (sesion) {
						return { ...sesion, accessToken: data.accessToken };
					}
					return sesion;
				});
			} else {
				console.error('Error refreshing token:', response.statusText);
				currentSesion.set(null);
			}
		} catch (error) {
			console.error('Error refreshing token:', error);
			currentSesion.set(null);
		}
	};

	setInterval(refreshAccessToken, 10 * 60 * 1000);
}
