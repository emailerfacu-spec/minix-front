import { writable } from 'svelte/store';
import type { User } from '../../types';

export const currentUser = writable<User | null>(null);

export const userStore = {
	subscribe: currentUser.subscribe,
	set: currentUser.set,
	update: currentUser.update,
	reset: () => currentUser.set(null)
};
