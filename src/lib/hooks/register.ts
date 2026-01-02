import { apiBase } from '@/stores/url';
import { goto } from '$app/navigation';
import type { RegisterDto } from '../../types';
import { get } from 'svelte/store';

export async function register(
	e: SubmitEvent,
	dto: RegisterDto,
	callbackfn: () => void,
	admin: boolean = false
) {
	e.preventDefault();
	if (
		dto.password == '' ||
		dto.username == '' ||
		!dto.email?.includes('@') ||
		dto.displayName == ''
	)
		return;
	try {
		const req = await fetch(get(apiBase) + '/api/auth/register', {
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
