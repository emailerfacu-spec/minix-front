import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';

export async function busquedaUsuarios(username: string) {
	if (!username) return null;
	try {
		const req = await fetch(`${get(apiBase)}/api/users/search?q=${username}`, {
			method: 'GET'
		});
		if (req.ok) {
			let data = await req.json();
			return data;
		}
		return [];
	} catch {
		return null;
	}
}
