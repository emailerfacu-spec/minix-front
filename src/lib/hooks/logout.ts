import { goto } from '$app/navigation';
import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function logout(menuOpen: boolean) {
	try {
		const req = await fetch(get(apiBase) + '/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			},
			credentials: 'include'
		});
		if (req.ok) {
			sesionStore.reset();
			menuOpen = false;
		}
	} catch {
		console.log('fallo el lougout');
	} finally {
		sesionStore.reset();
		goto('/');
	}
}
