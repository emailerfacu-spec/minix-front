import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';
import type { Post } from '../../types';
import { apiBase } from '@/stores/url';

export async function esSeguido(post: Post) {
	if (!get(sesionStore)?.accessToken || post.authorName === '[deleted]') return;

	const id = post.authorId;
	try {
		const response = await fetch(`${get(apiBase)}/api/users/${id}/is-following`, {
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			return false;
		}
	} catch {
		return null;
	}
}
