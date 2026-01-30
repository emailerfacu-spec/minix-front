import { apiBase } from '@/stores/url';
import { goto } from '$app/navigation';
import type { RegisterDto, RegisterSsoDto } from '../../types';
import { get } from 'svelte/store';

export async function registerFirebase(
	dto: RegisterSsoDto,
	callbackfn: () => void,
	admin: boolean = false
) {
	if (dto.uid == '' || dto.token == '' || !dto.email?.includes('@') || dto.username == '') return;
	try {
		const req = await fetch(get(apiBase) + '/api/auth/register/sso', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dto)
		});
		if (req.ok) {
			const data = await req.json();
			if (!admin) goto('/login?msg=' + data.message);
		} else {
			callbackfn();
		}
	} catch {
		callbackfn();
		console.error('fallo al intentar alcanzar el servidor');
	}
}
