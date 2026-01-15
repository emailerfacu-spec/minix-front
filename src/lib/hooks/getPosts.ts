import { apiBase } from "@/stores/url";
import { sesionStore } from "@/stores/usuario";
import { get } from "svelte/store";
import type { Post } from '../../types';
import { PAGE_SIZE } from '../stores/posts';

export async function getPosts(page: number = 1): Promise<Post[]> {
	const token = get(sesionStore)?.accessToken;

	const headers: HeadersInit = {};
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(
		`${get(apiBase)}/timeline?page=${page}&pageSize=${PAGE_SIZE}`,
		{ headers }
	);

	if (!res.ok) throw new Error('Error cargando posts');

	return res.json();
}