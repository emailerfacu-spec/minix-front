import { sesionStore } from '@/stores/usuario';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export async function load({ params }) {
	if (get(sesionStore)?.isAdmin !== true) {
		redirect(302, '/');
	}
}
