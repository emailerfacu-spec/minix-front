import { dev } from '$app/environment';
import { readable } from 'svelte/store';

// export const apiBase = readable(
// 	dev ? 'http://localhost:5000' : 'https://minix-back-dsuk.onrender.com'
// );

export const apiBase = readable(
	dev
		? 'http://localhost:5000'
		: 'https://minix-back-3.salmonpebble-66858787.brazilsouth.azurecontainerapps.io'
);
