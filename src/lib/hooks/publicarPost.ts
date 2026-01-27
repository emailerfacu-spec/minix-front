import { addPost } from '@/stores/posts';
import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function publicarPost(formData: FormData) {
	try {
		const req = fetch(get(apiBase) + '/api/posts', {
			method: 'POST',
			//credentials: 'include',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			},
			body: formData
		});

		const res = await req;
		if (res.ok) {
			const post = await res.json();
			addPost(post);
			return '';
		}
		return 'No se pudo crear el post.';
	} catch {
		return 'Fallo al alcanzar el servidor';
	}
}
