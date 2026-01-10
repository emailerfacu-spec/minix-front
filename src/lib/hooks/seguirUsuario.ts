import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function seguirUsuario(idusuario: string, toggle: Boolean = false) {
	try {
		const req = await fetch(`${get(apiBase)}/api/users/${idusuario}/follow`, {
			method: !toggle ? 'POST' : 'DELETE',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});
		if (req.ok) {
			return true;
		} else {
			return false;
		}
	} catch {
		return null;
	}
}
