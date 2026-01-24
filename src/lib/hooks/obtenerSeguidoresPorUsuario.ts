import { sesionStore } from '@/stores/usuario';
import type { UsersResponseDto } from '../../types';
import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';

export async function obtenerSeguidoresPorUsuario(
	id: string,
	page: number = 1,
	limit: number = 20,
	fetch2?: Function
): Promise<UsersResponseDto | null> {
	try {
		const fetchFunc = fetch2 || fetch;
		const skip = (page - 1) * limit;

		const response = await fetchFunc(`${get(apiBase)}/api/users/${id}/followers?skip=${skip}&limit=${limit}`, {
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