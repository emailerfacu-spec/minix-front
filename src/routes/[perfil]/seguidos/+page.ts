import { obtenerUsuarioPorUsername } from '@/hooks/obtenerUsuario';
import { error } from '@sveltejs/kit';
import type { UserResponseDto, UsersResponseDto } from '../../../types';
import { obtenerSeguidosPorUsuario } from '@/hooks/obtenerSeguidosPorUsuario';

export async function load({ params, fetch }) {
	const usuario: UserResponseDto | null = await obtenerUsuarioPorUsername(params.perfil, fetch);
	if (!usuario) error(404, 'No se encontro el usuario, ' + params.perfil);

	const seguidosResponse: UsersResponseDto | null = await obtenerSeguidosPorUsuario(
		usuario.id,
		100,
		fetch
	);

	return {
		usuario,
		seguidos: seguidosResponse?.response || []
	};
}
