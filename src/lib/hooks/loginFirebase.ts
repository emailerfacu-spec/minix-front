import { apiBase } from '@/stores/url';
import type { LoginSsoDto, Sesion } from '../../types';
import { sesionStore } from '@/stores/usuario';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export async function loginFirebase(dto: LoginSsoDto, callbackfn: () => void) {
	if (dto.accessToken == '' || dto.uid == '') return;
	try {
		const req = await fetch(get(apiBase) + '/api/auth/login/sso', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(dto)
		});
		if (req.ok) {
			const token: Sesion = await req.json();
			console.log(token);
			sesionStore.set(token);
			goto('/');
		} else {
			callbackfn();
		}
	} catch {
		// callbackfn();
		console.error('fallo al intentar alcanzar el servidor');
	}
}
