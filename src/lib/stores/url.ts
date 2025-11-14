import { dev } from '$app/environment';
import { writable } from 'svelte/store';

export const apiBase = writable(
	dev ? 'http://localhost:5000' : 'https://minix-back-dsuk.onrender.com'
);
