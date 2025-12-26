import { obtenerUsuarioPorUsername } from '@/hooks/obtenerUsuario.js';
import type { User, UserResponseDto } from '../../types.js';
import { error } from '@sveltejs/kit';
import { obtenerSeguidosPorUsuario } from '@/hooks/obtenerSeguidosPorUsuario.js';
import { obtenerSeguidoresPorUsuario } from '@/hooks/obtenerSeguidoresPorUsuario.js';

export async function load({ params, depends, fetch }) {
	depends('perfil:general');
	const usuario: UserResponseDto | null = await obtenerUsuarioPorUsername(params.perfil, fetch);
	if (!usuario) error(404, 'No se encontro el usuario, ' + params.perfil);

	const [seguidos, seguidores] = await Promise.all([
		obtenerSeguidosPorUsuario(usuario.id, 3, fetch),
		obtenerSeguidoresPorUsuario(usuario.id, 3, fetch)
	]);

	return { ...usuario, seguidos, seguidores };
}
