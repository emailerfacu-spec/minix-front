import { busquedaUsuarios } from '@/hooks/busquedaUsuarios';
import { error } from '@sveltejs/kit';
import type { UserResponseDto } from '../../../types';
import { busquedaHashtags } from '@/hooks/busquedaHashtags.js';

export async function load({ params }) {
	let req1 = busquedaUsuarios(params.user);
	//usa el mismo param
	let req2 = busquedaHashtags(params.user);

	let [usuarios, htags] = await Promise.all([req1, req2]);

	if (usuarios == null) {
		return error(500, 'No se pudo alcanzar el servidor.');
	}

	if (usuarios.length == 0) {
		return error(404, 'No se encontraron usuarios que coinsidan con la busqueda.');
	}
	return { usuarios, htags };
}
