import { goto } from '$app/navigation';
import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';

export async function logout(menuOpen: boolean) {
	try {
		const req = await fetch($apiBase + '/api/auth/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${$sesionStore.accessToken}`
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
