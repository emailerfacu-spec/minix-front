import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function busquedaAdminUsuarios(q: string, limit = 5, page = 1) {
	try {
		const response = await fetch(
			get(apiBase) +
				`/api/admin/users${q ? `?q=${q}` : ''}${q ? '&' : '?'}page=${page}&pageSize=${limit}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${get(sesionStore)?.accessToken}`
				}
			}
		);
		if (response.ok) {
			return await response.json();
		}
		return [];
	} catch {
		return [];
	}
}
