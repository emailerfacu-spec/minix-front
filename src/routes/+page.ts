import { resetPosts } from '@/stores/posts';

//export const ssr = true;
export async function load({}) {
	resetPosts();
}
