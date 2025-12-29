import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function obtenerCantidadDeUsosdeHtag(htag: string, fetch2?: Function) {
	if (!htag) return null;
	const fetchFn = fetch2 || fetch;
	try {
		const req = await fetchFn(`${get(apiBase)}/api/posts/hashtag/${htag}`, {
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
