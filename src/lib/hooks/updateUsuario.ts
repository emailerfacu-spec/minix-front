import { apiBase } from '@/stores/url';
import { sesionStore } from '@/stores/usuario';
import { get } from 'svelte/store';

export interface AdminUpdateUsuario {
	id: string;
	displayName: string | null;
	bio: string | null;
	profileImage: boolean;
	image: File;
	profileImageUrl: string | null;
}

export async function updateUsuario(usuario: Partial<AdminUpdateUsuario>) {
	const formData = new FormData();
	if (usuario.displayName) formData.append('displayName', usuario.displayName);
	if (usuario.bio) formData.append('bio', usuario.bio);
	if (usuario.profileImage) {
		if (usuario.profileImageUrl) formData.append('profileImageUrl', 'null');
	} else {
		if (usuario.profileImageUrl) {
			formData.append('profileImageUrl', usuario.profileImageUrl);
		} else {
			if (usuario.image) formData.append('profileImage', usuario.image);
		}
	}

	try {
		const req = await fetch(get(apiBase) + '/api/users/' + usuario.id, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${get(sesionStore)?.accessToken}`
			},
			body: formData
		});
		if (req.status === 204) {
			let ret = {
				// bio: usuario.bio,
				displayName: usuario.displayName
				// oldImageUrl: usuario.oldImageUrl,
			};
			return ret;
		}
		const dataa = await req.json();

		return dataa.message;
	} catch {
		return 'No se pudo alcanzar el servidor';
	}
}
