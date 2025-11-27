import { apiBase } from '@/stores/url.js';
import { sesionStore } from '@/stores/usuario';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { UserResponseDto } from '../../../types.js';

export const ssr = true;

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
