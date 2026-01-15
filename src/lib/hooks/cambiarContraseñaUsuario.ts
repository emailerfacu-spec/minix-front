import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';
import type { UserResponseDto } from '../../types';
import { sesionStore } from '@/stores/usuario';

export async function cambiarContraseñaUsuario(
	oldPassword: string,
	newPassword: string,
	id: number
) {
	try {
		const req = await fetch(`${get(apiBase)}/api/users/${id}/password`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			},
			body: JSON.stringify({ currentPassword: oldPassword, newPassword })
		});
		if (req.ok) {
			return '';
		}
		const data = await req.json();
		return data.message;
	} catch {
		return 'No se pudo alcanzar el servidor';
	}
}
