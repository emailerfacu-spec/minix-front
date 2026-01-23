import { get, writable } from 'svelte/store';
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

sesionStore.subscribe((value) => {
	console.log(value);
});

if (browser) {
	currentSesion.subscribe((value) => {
		localStorage.setItem('sesion', JSON.stringify(value));
	});
}
if (browser) {
	const decodeJWT = (token: string) => {
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);

			return JSON.parse(jsonPayload);
		} catch (error) {
			console.error('Error decodificando JWT:', error);
			return null;
		}
	};

	const shouldRefreshToken = async (sesion: Sesion | null): Promise<boolean> => {
		if (!sesion || !sesion.accessToken) return false;

		if (sesion.isFirebase) {
			try {
				// Simulamos la importación dinámica de Firebase
				const { getAuth } = await import('firebase/auth');
				const auth = getAuth();
				const user = auth.currentUser;

				if (user) {
					const token = await user.getIdToken(true);
					currentSesion.update((s) => {
						if (s) {
							return { ...s, accessToken: token };
						}
						return s;
					});
					return false;
				}
			} catch (error) {
				console.error('Error obteniendo token de Firebase:', error);
				return false;
			}
		}

		const decoded = decodeJWT(sesion.accessToken);
		if (!decoded || !decoded.exp) return false;

		const expirationTime = decoded.exp * 1000;
		const currentTime = Date.now();
		const timeUntilExpiration = expirationTime - currentTime;

		return timeUntilExpiration <= 60 * 1000; // 1 minuto
	};

	const refreshAccessToken = async () => {
		try {
			const sesion = get(currentSesion);
			if (!(await shouldRefreshToken(sesion))) return;

			// Solo ejecutar este código si NO es Firebase
			if (!sesion?.isFirebase) {
				console.log('refrescando token');
				const response = await fetch(get(apiBase) + '/api/auth/refresh', {
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
					console.error('Error refrescando token:', response.statusText);
					currentSesion.set(null);
				}
			}
		} catch (error) {
			console.error('Error refrescando token:', error);
			currentSesion.set(null);
		}
	};

	setInterval(() => {
		refreshAccessToken();
	}, 30 * 1000); // Check every 30 seconds

	refreshAccessToken();
}
