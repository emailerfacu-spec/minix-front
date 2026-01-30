import { obtenerPostPorId } from '@/hooks/obtenerPostPorId.js';
import { obtenerRespuestasPorId } from '@/hooks/obtenerRespuestasPorId';
import { error } from '@sveltejs/kit';

export const ssr = false;

export async function load({ params, fetch, depends }) {
	let ret = await obtenerPostPorId(params.idpost, fetch, depends);
	if (ret == null) return error(404, 'no existe un post con ese id.');
	if (typeof ret == 'string') return error(500, ret);

	let respuestas = await obtenerRespuestasPorId(params.idpost, fetch, depends);
	if (respuestas == null) return error(404, 'no existe un post con ese id.');
	if (typeof respuestas == 'string') return error(500, respuestas);

	return {
		post: ret,
		respuestas: respuestas
	};
}
