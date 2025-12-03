import { obtenerUsuarioPorUsername } from '@/hooks/obtenerUsuario.js';
import type { User, UserResponseDto } from '../../types.js';
import { error } from '@sveltejs/kit';
import { obtenerSeguidosPorUsuario } from '@/hooks/obtenerSeguidosPorUsuario.js';
import { obtenerSeguidoresPorUsuario } from '@/hooks/obtenerSeguidoresPorUsuario.js';

export async function load({ params }) {
  const usuario: UserResponseDto | null = await obtenerUsuarioPorUsername(params.perfil);
  if(!usuario) error(404, 'No se encontro el usuario, ' + params.perfil);

  const seguidos = await obtenerSeguidosPorUsuario(usuario.id);
  const seguidores = await obtenerSeguidoresPorUsuario(usuario.id);

  return { ...usuario, seguidos, seguidores };
}
