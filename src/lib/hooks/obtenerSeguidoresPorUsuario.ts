import { sesionStore } from "@/stores/usuario";
import type { UserResponseDto } from "../../types";
import { get } from "svelte/store";
import { apiBase } from "@/stores/url";

export async function obtenerSeguidoresPorUsuario(id: string, limit:number = 20): Promise<UserResponseDto[] | null> {
 try {
  const response = await fetch(`${get(apiBase)}/api/users/${id}/followers?limit=${limit}`, {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${get(sesionStore)?.accessToken}`
   }
  });

  if (!response.ok) {
   return null;
  }

  const followers: UserResponseDto[] = await response.json();
  return followers;
 } catch (error) {
  return null;
 }
}
