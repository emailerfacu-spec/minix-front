import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function obtenerCantidadDeSeguidores(id: string, fetch2?: Function) {
	const fetchFn = fetch2 || fetch;
	try {
		const response = await fetchFn(`${get(apiBase)}/api/users/${id}/followers/count`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		if (!response.ok) {
			return 0;
		}
		return await response.json();
	} catch {
		return 0;
	}
}
