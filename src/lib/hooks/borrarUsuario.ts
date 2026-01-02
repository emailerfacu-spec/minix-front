import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function borrarUsuario(id: string) {
	try {
		const req = await fetch(`${get(apiBase)}/api/users/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		if (req.ok) {
			return true;
		}
		return false;
	} catch {
		return false;
	}
}
