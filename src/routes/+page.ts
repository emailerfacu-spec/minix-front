import { apiBase } from '@/stores/url';

export const ssr = true;

export async function load({}) {
	const { subscribe } = apiBase;
	let baseUrl: string = '';

	subscribe((value) => {
		baseUrl = value;
	})();

	const req = await fetch(`${baseUrl}/Posts`);
	if (req.ok) return { posts: req };
	else return { posts: [] };
}
