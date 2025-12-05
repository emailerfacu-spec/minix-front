import { apiBase } from "@/stores/url";
import { sesionStore } from "@/stores/usuario";
import { get } from "svelte/store";

export async function getPosts() {


	const req = await fetch(`${get(apiBase)}/timeline?pageSize=20`,{
	headers: {
	Authorization: `Bearer ${get(sesionStore)?.accessToken}`

	}
	});
	if (req.ok) {
		return await req.json();
	}
}
