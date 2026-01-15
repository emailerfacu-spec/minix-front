import { writable } from 'svelte/store';
import type { Post } from '../../types';

export const posts = writable<Post[]>([]);
export const loadingPosts = writable(false);
export const page = writable(1);

export const PAGE_SIZE = 20;

export const setPosts = (newPosts: Post[]) => {
	posts.set(newPosts);
};

export const appendPosts = (newPosts: Post[]) => {
	posts.update((current) => [...current, ...newPosts]);
};

export const addPost = (post: Post) => {
	posts.update((current) => [post, ...current]);
};

export const updatePostStore = (
	postId: string,
	updatedData: Partial<Post>
) => {
	posts.update((current) =>
		current.map((post) =>
			post.id === postId ? { ...post, ...updatedData } : post
		)
	);
};

export const removePost = (postId: string) => {
	posts.update((current) =>
		current.filter((post) => post.id !== postId)
	);
};

export const resetPosts = () => {
	posts.set([]);
	page.set(1);
};
