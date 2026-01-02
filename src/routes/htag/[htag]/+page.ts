import { obtenerCantidadDeUsosdeHtag } from '@/hooks/obtenerCantidadDeUsosdeHtag.js';

export async function load({ params, fetch }) {
	let { htag } = params;

	const posts = await obtenerCantidadDeUsosdeHtag(htag, fetch);
	// if (cantidad == null || posts.lenght == 0) return error(404, 'no existe el #(hashtag)');
	return { htag, posts };
}
