import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';
import type { Post } from '../../types';

export async function obtenerPostPorId(
	idpost: string,
	fetch2?: Function,
	depends?: Function
): Promise<null | Post | string> {
	if (idpost == '') return null;
	if (depends) depends('post:post');
	const fetchFn = fetch2 ? fetch2 : fetch;

	try {
		const req = await fetchFn(`${get(apiBase)}/api/posts/${idpost}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});
		let data = await req.json();
		if (req.ok) {
			return data;
		}
		return data.message;
	} catch {
		return 'No se pudo alcanzar el servidor.';
	}
}
