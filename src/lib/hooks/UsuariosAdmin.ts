import { apiBase } from "@/stores/url";
import { sesionStore } from "@/stores/usuario";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import type { UserResponseDto } from "../../types";

export async function fetchUsuariosAdmin(page: number, limit: number) {
    let response = await fetch(get(apiBase) + `/api/admin/users?page=${page}&pageSize=${limit}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${get(sesionStore)?.accessToken}`
            }
        });

    if (response.status === 401) {
        throw redirect(302, '/');
    }

    if (!response.ok) {
        return { error: true };
    }
    const usuarios: UserResponseDto[] = await response.json();  
    return { usuarios, error: false };
}