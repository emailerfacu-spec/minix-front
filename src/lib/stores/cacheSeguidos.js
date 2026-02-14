import { browser } from '$app/environment';
import { writable } from 'svelte/store';

class FollowCache {
	constructor() {
		if (browser) {
			this.loadFromStorage();
		}
	}

	/** @type {Map<string, boolean | Promise<boolean>>} */
	#cache = new Map();

	/** @type {import('svelte/store').Writable<Map<string, boolean>>} */
	store = writable(new Map());

	/** @param {string} userId */
	get(userId) {
		const value = this.#cache.get(userId);
		return value instanceof Promise ? undefined : value;
	}

  	/** @param {string} userId */
	has(userId) {
		return this.#cache.has(userId);
	}

	/**
	 * @param {string} userId
	 * @param {() => Promise<boolean>} fetchFn
	 */
	async getOrFetch(userId, fetchFn) {
		const existing = this.#cache.get(userId);

		if (existing !== undefined) {
			if (existing instanceof Promise) {
				return existing;
			}
			return existing;
		}

		const promise = fetchFn()
			.then((result) => {
				this.#setFinal(userId, result);
				return result;
			})
			.catch((err) => {
				this.#cache.delete(userId);
				this.#updateStore();
				throw err;
			});

		this.#cache.set(userId, promise);
		this.#updateStore();

		return promise;
	}

	/**
	 * @param {string} userId
	 * @param {boolean} isFollowed
	 */
	set(userId, isFollowed) {
		this.#setFinal(userId, isFollowed);
	}

	/**
	 * @param {string} userId
	 * @param {boolean} value
	 */
	#setFinal(userId, value) {
		this.#cache.set(userId, value);
		this.#updateStore();
		this.saveToStorage();

		if (browser) {
			window.dispatchEvent(
				new CustomEvent('followCacheUpdated', {
					detail: { userId, isFollowed: value }
				})
			);
		}
	}

	#updateStore() {
		const filtered = Array.from(this.#cache.entries())
			.filter(([_, v]) => typeof v === 'boolean');

		this.store.set(
			/** @type {Map<string, boolean>} */
			(new Map(filtered))
		);
	}

	/** @param {string} userId */
	delete(userId) {
		this.#cache.delete(userId);
		this.#updateStore();
		this.saveToStorage();
	}

	clear() {
		this.#cache.clear();
		this.store.set(new Map());
		this.saveToStorage();
	}

	saveToStorage() {
		if (!browser) return;
		const filtered = Array.from(this.#cache.entries())
			.filter(([_, v]) => typeof v === 'boolean');

		const data = Object.fromEntries(filtered);
		sessionStorage.setItem('follow-cache', JSON.stringify(data));
	}

	loadFromStorage() {
		if (!browser) return;

		try {
			const stored = sessionStorage.getItem('follow-cache');
			if (!stored) return;
			const data = JSON.parse(stored);

			this.#cache = new Map(Object.entries(data));
			this.#updateStore();

		} catch (err) {
			console.error('Error cargando follow-cache:', err);
		}
	}
}

export const cacheSeguidos = new FollowCache();