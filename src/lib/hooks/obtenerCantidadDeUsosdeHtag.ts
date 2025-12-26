import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function obtenerCantidadDeUsosdeHtag(htag: string) {
	if (!htag) return null;
	try {
		const req = await fetch(`${get(apiBase)}/api/posts/hashtag/${htag}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});
		if (req.ok) {
			let data = await req.json();
			return data;
		}
		return null;
	} catch {
		return null;
	}
}
