import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';
import { sesionStore } from '@/stores/usuario';
import type { Post } from '../../types';

export async function likePost(post: Post) {
  let method = post.isLiked ? "DELETE" : "POST";
	try {
		const req = await fetch(get(apiBase) + `/api/posts/${post.id}/like`, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		const data: { message: string } = await req.json();
		return { message: data.message, ok: req.ok };
	} catch {
		return { message: 'No se pudo alcanzar el servidor', ok: false };
	}
}
