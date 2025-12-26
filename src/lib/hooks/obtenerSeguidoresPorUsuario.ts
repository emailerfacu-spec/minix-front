import { sesionStore } from '@/stores/usuario';
import type { UsersResponseDto } from '../../types';
import { get } from 'svelte/store';
import { apiBase } from '@/stores/url';

export async function obtenerSeguidoresPorUsuario(
	id: string,
	limit: number = 20,
	fetch2: Function
): Promise<UsersResponseDto | null> {
	try {
		const fetchFunc = fetch2 || fetch;
		const response = await fetchFunc(`${get(apiBase)}/api/users/${id}/followers?limit=${limit}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		if (!response.ok) {
			return null;
		}

		const followers: UsersResponseDto = await response.json();
		return followers;
	} catch (error) {
		return null;
	}
}
