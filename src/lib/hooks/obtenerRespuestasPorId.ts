import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';
import type { Post } from '../../types';

export async function obtenerRespuestasPorId(
	id: string,
	fetch2?: Function,
	depends?: Function,
	page: number = 1
): Promise<string | Post[] | null> {
	if (depends) depends('post:respuestas');
	const fetchFn = fetch2 ? fetch2 : fetch;
	try {
		const req = await fetchFn(`${get(apiBase)}/api/posts/${id}/replies?page=${page}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken || ''}`
			}
		});
		if (req.ok) {
			const data = await req.json();
			return data;
		}
		return null;
	} catch {
		return 'No se pudo obtener del dato del servidor';
	}
}
