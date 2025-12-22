import { obtenerCantidadDeUsosdeHtag } from '@/hooks/obtenerCantidadDeUsosdeHtag.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	let { htag } = params;

	const posts = await obtenerCantidadDeUsosdeHtag(htag);
	// if (cantidad == null || posts.lenght == 0) return error(404, 'no existe el #(hashtag)');
	return { htag, posts };
}
