import { browser } from '$app/environment';
import { writable } from 'svelte/store';

class FollowCache {
	constructor() {
		if (browser) {
			this.loadFromStorage();
		}
	}

	/** @type {Map<string, boolean>} */
	#cache = new Map();

	/** @type {import('svelte/store').Writable<Map<string, boolean>>} */
	store = writable(this.#cache);

	/**
	 * @param {string} userId
	 * @returns {boolean | undefined}
	 */
	get(userId) {
		return this.#cache.get(userId);
	}

	/**
	 * @param {string} userId
	 * @param {boolean} isFollowed
	 */
	set(userId, isFollowed) {
		this.#cache.set(userId, isFollowed);
		this.store.set(this.#cache);
		this.saveToStorage();

		if (browser) {
			window.dispatchEvent(
				new CustomEvent('followCacheUpdated', {
					detail: { userId, isFollowed }
				})
			);
		}
	}

	/**
	 * @param {string} userId
	 * @returns {boolean}
	 */
	has(userId) {
		return this.#cache.has(userId);
	}

	/**
	 * @param {string} userId
	 */
	delete(userId) {
		this.#cache.delete(userId);
		this.store.set(this.#cache);
		this.saveToStorage();

		if (browser) {
			window.dispatchEvent(
				new CustomEvent('followCacheUpdated', {
					detail: { userId, isFollowed: false }
				})
			);
		}
	}

	clear() {
		this.#cache.clear();
		this.store.set(this.#cache);
		this.saveToStorage();

		if (browser) {
			window.dispatchEvent(
				new CustomEvent('followCacheUpdated', {
					detail: { clearAll: true }
				})
			);
		}
	}

	saveToStorage() {
		if (browser) {
			const data = Object.fromEntries(this.#cache);
			sessionStorage.setItem('follow-cache', JSON.stringify(data));
		}
	}

	loadFromStorage() {
		if (browser) {
			try {
				const stored = sessionStorage.getItem('follow-cache');
				if (stored) {
					const data = JSON.parse(stored);
					this.#cache = new Map(Object.entries(data));
					this.store.set(this.#cache);
				}
			} catch (error) {
				console.error('Error cargando desde sesion:', error);
			}
		}
	}
}

export const cacheSeguidos = new FollowCache();
