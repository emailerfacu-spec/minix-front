import { busquedaUsuarios } from '@/hooks/busquedaUsuarios';
import type { PageProps } from '../$types';
import { error } from '@sveltejs/kit';
import type { UserResponseDto } from '../../../types';

export async function load({ params }: PageProps) {
	let usuarios: UserResponseDto[] = await busquedaUsuarios(params.user);
	if (usuarios == null) {
		return error(500, 'No se pudo alcanzar el servidor.');
	}

	if (usuarios.length == 0) {
		return error(404, 'No se encontraron usuarios que coinsidan con la busqueda.');
	}
	return { usuarios };
}
