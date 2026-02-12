import type { PageLoad } from './$types.js';
import { fetchUsuariosAdmin } from '@/hooks/UsuariosAdmin.js';

export const ssr = false;

export const load: PageLoad = async ({ depends }) => {
	depends('admin:load');
	const result = await fetchUsuariosAdmin(1, 5);

	if (result.error) {
		return { error: true };
	}

	return {
		usuarios: result.ret?.usuarios,
		hayMas: result.ret?.hayMas,
		error: false
	};
};
