import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export async function busquedaAdminUsuarios(q: string, limit = 5, page = 1, fetch2?: Function) {
	try {
		const fetchFn = fetch2 ? fetch2 : fetch;
		const response = await fetchFn(
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
