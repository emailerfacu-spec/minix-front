import { get } from 'svelte/store';
import { page, loadingPosts, PAGE_SIZE } from '@/stores/posts';
import { appendPosts } from '@/stores/posts';
import { getPosts } from './getPosts';

let finished = false;

export async function loadMorePosts() {
	if (get(loadingPosts) || finished) return;

	loadingPosts.set(true);

	try {
		const currentPage = get(page);
		const newPosts = await getPosts(currentPage);

		if (newPosts.length === 0) {
			finished = true;
			return;
		}

		appendPosts(newPosts);

		if (newPosts.length < PAGE_SIZE) {
			finished = true;
		} else {
			page.update((p) => p + 1);
		}
	} finally {
		loadingPosts.set(false);
	}
}
