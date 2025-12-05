import { sesionStore } from "@/stores/usuario";
import type { UserResponseDto } from "../../types";
import { apiBase } from "@/stores/url";
import { get } from "svelte/store";

export async function obtenerSeguidosPorUsuario(id: string, limit:number = 20): Promise<UserResponseDto[] | null> {
 try {
  const response = await fetch(`${get(apiBase)}/api/users/${id}/following?limit=${limit}`, {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${get(sesionStore)?.accessToken}`
   }
  });

  if (!response.ok) {
   return null;
  }

  const users: UserResponseDto[] = await response.json();
  return users;
 } catch (error) {
  return null;
 }
}
