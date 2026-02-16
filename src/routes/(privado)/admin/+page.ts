import { busquedaAdminUsuarios } from '@/hooks/busquedaAdminUsuarios.js';
import type { PageLoad } from './$types.js';
import { fetchUsuariosAdmin } from '@/hooks/UsuariosAdmin.js';

export const ssr = false;

export const load: PageLoad = async ({ depends, fetch }) => {
	depends('admin:load');
	let url = new URL(location.href);
	let query = url.searchParams.get('q') ?? '';
	let page = Number(url.searchParams.get('p'));
	if (isNaN(page) || page < 1) {
		page = 1;
	}

	const result = await busquedaAdminUsuarios(query, 5, page, fetch);

	if (result.error) {
		return { error: true };
	}

	return {
		usuarios: result.usuarios,
		hayMas: result.hayMas,
		error: false
	};
};
