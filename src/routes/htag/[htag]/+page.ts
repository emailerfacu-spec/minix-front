import { obtenerCantidadDeUsosdeHtag } from '@/hooks/obtenerCantidadDeUsosdeHtag.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	let { htag } = params;

	const cantidad = await obtenerCantidadDeUsosdeHtag(htag);
	if (cantidad == null || cantidad.lenght == 0) return error(404, 'no existe el #(hashtag)');
	return { htag, cantidad };
}
