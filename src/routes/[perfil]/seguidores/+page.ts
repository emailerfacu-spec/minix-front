import { obtenerSeguidoresPorUsuario } from '@/hooks/obtenerSeguidoresPorUsuario';
import { obtenerUsuarioPorUsername } from '@/hooks/obtenerUsuario';
import { error } from '@sveltejs/kit';
import type { UserResponseDto, UsersResponseDto } from '../../../types';

export async function load({ params, fetch }) {
	const usuario: UserResponseDto | null = await obtenerUsuarioPorUsername(params.perfil, fetch);
	if (!usuario) error(404, 'No se encontro el usuario, ' + params.perfil);

	const seguidoresResponse: UsersResponseDto | null = await obtenerSeguidoresPorUsuario(
		usuario.id,
		100,
		fetch
	);

	return {
		usuario,
		seguidores: seguidoresResponse?.response || []
	};
}
