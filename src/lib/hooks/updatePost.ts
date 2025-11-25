import { apiBase } from '@/stores/url';
import type { Post, PostResponseDto } from '../../types';
import { get } from 'svelte/store';
import { sesionStore } from '@/stores/usuario';

export async function updatePost(post: Post, callbackfn: Function, message: string) {
	try {
		const data = {
			content: post.content,
			imageUrl: post.imageUrl
		};
		const req = await fetch(get(apiBase) + `/api/posts/${post.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			},
			body: JSON.stringify(data)
		});
		if (req.ok) {
			const newpost: PostResponseDto = await req.json();
			callbackfn(newpost);
			return;
		}
		message = 'Fallo al intentar modificar la publicación';
	} catch {
		message = 'No se pudo alcanzar el servidor';
	}
}
