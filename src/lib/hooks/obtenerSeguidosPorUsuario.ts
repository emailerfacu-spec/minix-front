import { sesionStore } from '@/stores/usuario';
import type { UsersResponseDto } from '../../types';
import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';

export async function obtenerSeguidosPorUsuario(
	id: string,
	limit: number = 20,
	fetch2?: Function
): Promise<UsersResponseDto | null> {
	try {
		const fetchFunc = fetch2 || fetch;

		const response = await fetchFunc(`${get(apiBase)}/api/users/${id}/following?limit=${limit}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		if (!response.ok) {
			return null;
		}

		const users: UsersResponseDto = await response.json();
		return users;
	} catch (error) {
		return null;
	}
}
