import type { PageLoad } from './$types.js';
import { fetchUsuariosAdmin } from '@/hooks/UsuariosAdmin.js';

export const ssr = false;

export const load: PageLoad = async ({ depends}) => {
	depends('admin:load');
	const result = await fetchUsuariosAdmin(1, 10);

	if (result.error) {
		return { error: true };
	}

	return {
		usuarios: result.usuarios,
		error: false
	};
}
