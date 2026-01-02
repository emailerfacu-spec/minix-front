import { apiBase } from '@/stores/url';
import { get } from 'svelte/store';

export async function busquedaHashtags(htag: string) {
	if (!htag) return null;
	try {
		const req = await fetch(`${get(apiBase)}/api/htag?q=${htag}`, {
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
