import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';

export async function checkUsername(username: string) {
	try {
		const req = await fetch(`${get(apiBase)}/api/users/check-username/${username}`, {
			method: 'GET'
		});
		if (req.ok) {
			return (await req.json()).available;
		}
		return false;
	} catch {
		return false;
	}
}
