import { apiBase } from '@/stores/url';
import type { UserResponseDto } from '../../types';
import { get } from 'svelte/store';
import { sesionStore } from '@/stores/usuario';

export async function obtenerUsuarioPorUsername(
	username: string,
	fetch2?: Function
): Promise<UserResponseDto | null> {
	try {
		const fetchFunction = fetch2 || fetch;

		const response = await fetchFunction(`${get(apiBase)}/api/users/username/${username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			}
		});

		if (!response.ok) {
			//console.error('Error fetching user data:', response.status);
			return null;
		}

		const user: UserResponseDto = await response.json();
		return user;
	} catch (error) {
		//console.error('Failed to reach the server while fetching user:', error);
		return null;
	}
}
