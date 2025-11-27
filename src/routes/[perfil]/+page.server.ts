import { obtenerUsuarioPorUsername } from '@/hooks/obtenerUsuario.js';
import type { User, UserResponseDto } from '../../types.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const usuario: UserResponseDto | null = await obtenerUsuarioPorUsername(params.perfil);
	if (usuario) {
		return usuario;
	}
	error(404, 'No se encontro el usuario, ' + params.perfil);
}
