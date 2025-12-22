import { sesionStore } from '@/stores/usuario';
import type { UsersResponseDto } from '../../types';
import { get } from 'svelte/store';
import { apiBase } from '@/stores/url';

export async function obtenerSeguidoresPorUsuario(
	id: string,
	limit: number = 20
): Promise<UsersResponseDto | null> {
	try {
		const response = await fetch(`${get(apiBase)}/api/users/${id}/followers?limit=${limit}`, {
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
