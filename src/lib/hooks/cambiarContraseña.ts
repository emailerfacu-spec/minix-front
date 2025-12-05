import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';
import type { UserResponseDto } from '../../types';
import { sesionStore } from '@/stores/usuario';

export async function cambiarContraseña(usuario: UserResponseDto, newpass: string) {
	try {
		const req = await fetch(get(apiBase) + '/api/admin/password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			},
			body: JSON.stringify({ id: usuario.id, newpass })
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
