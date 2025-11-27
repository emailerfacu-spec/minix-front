import { apiBase } from '@/stores/url.js';
import { sesionStore } from '@/stores/usuario';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { UserResponseDto } from '../../../types.js';

<<<<<<< HEAD
//para que solo se envie cuando se requiere
export const prerender = true;
=======
export const ssr = true;
>>>>>>> 354f43e (fetch de usuarios ya funcional junto con la ui de usurios)

export async function load({}) {
	const response = await fetch(get(apiBase) + '/api/admin/users', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${get(sesionStore)?.accessToken}`
		}
	});

	if (response.status === 401) {
		throw redirect(302, '/');
	}
	if (!response.ok) {
		return { error: true };
	}

	const usuarios: UserResponseDto[] = await response.json();

	return { usuarios, error: false };
}
