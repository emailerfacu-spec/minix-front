import { writable } from 'svelte/store';
import type { Post } from '../../types';

export const posts = writable<Post[]>([]);

export const setPosts = (newPosts: Post[]) => {
	posts.set(newPosts);
};

export const addPost = (post: Post) => {
	posts.update((currentPosts) => [post, ...currentPosts]);
};

export const updatePost = (postId: string, updatedData: Partial<Post>) => {
	posts.update((currentPosts) =>
		currentPosts.map((post) => (post._id === postId ? { ...post, ...updatedData } : post))
	);
};

export const removePost = (postId: string) => {
	posts.update((currentPosts) => currentPosts.filter((post) => post._id !== postId));
};
