import { apiBase } from "@/stores/url"
import { sesionStore } from "@/stores/usuario"
import { get } from "svelte/store"

export interface AdminUpdateUsuario {
  id:string,
  displayName: string,
  bio: string,
  profileImage:boolean,
  oldImageUrl:string
}

export async function updateUsuario(usuario: AdminUpdateUsuario) {

  const formData = new FormData();
  formData.append('displayName', usuario.displayName);
  formData.append('bio', usuario.bio);
  if (usuario.profileImage) {
    formData.append('profileImageUrl', usuario.oldImageUrl);
  }

  try {
    const req = await fetch(get(apiBase) + "/api/users/"+usuario.id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${get(sesionStore)?.accessToken}`
      },
      body: formData,
    });
    if (req.status === 204) {
      let ret = {
        // bio: usuario.bio,
        displayName: usuario.displayName,
        // oldImageUrl: usuario.oldImageUrl,
      }
      return ret;
    }
    const dataa = await req.json();

    return dataa.message;
  } catch {
    return "No se pudo alcanzar el servidor"
  }
}
