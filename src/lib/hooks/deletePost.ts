import { apiBase } from '@/stores/url';
import type { Post } from '../../types';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function deletePost(
	post: Post,
	callbackfn: Function,
	cargando: boolean,
	message: string = ''
) {
	try {
		cargando = true;

		const req = await fetch(get(apiBase) + `/api/posts/${post.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});
		if (req.status === 204) {
			callbackfn();
			return;
		}
		const msg = await req.json();
		message = msg.message;
	} catch {
		message = 'No se pudo alcanzar el servidor';
	} finally {
		cargando = false;
	}
}
