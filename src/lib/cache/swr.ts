import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import {
	isBrowser,
	isStale,
	onCacheUpdated,
	readCacheEntry,
	writeCacheEntry,
} from "./storage";

export type CachedResourceOptions<T> = {
	key: string;
	fetcher: () => Promise<T>;
	initialData?: T | null;
	userId?: string | null;
	ttlMs: number;
	/** When false, never revalidate in background (static data). */
	revalidate?: boolean;
};

const inFlight = new Map<string, Promise<unknown>>();

function dedupedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
	const existing = inFlight.get(key);
	if (existing) return existing as Promise<T>;
	const request = fetcher().finally(() => {
		if (inFlight.get(key) === request) {
			inFlight.delete(key);
		}
	});
	inFlight.set(key, request);
	return request;
}

function readSeed<T>(key: string, userId?: string | null) {
	return readCacheEntry<T>(key, userId);
}

/**
 * Stale-while-revalidate resource backed by localStorage.
 *
 * - Renders cached (or SSR `initialData`) synchronously, never blocks.
 * - Revalidates in the background when the entry is missing or older than `ttlMs`.
 * - `isLoading` is only true when there is nothing to show yet.
 * - `isRevalidating` drives a non-blocking "updating" indicator.
 */
export function createCachedResource<T>(options: CachedResourceOptions<T>) {
	const { key, fetcher, ttlMs } = options;
	const userId = options.userId ?? null;

	const seed = readSeed<T>(key, userId);
	const [data, setData] = createSignal<T | null>(
		(options.initialData ?? seed?.payload ?? null) as T | null,
	);
	const [error, setError] = createSignal<string | null>(null);
	const [isRevalidating, setIsRevalidating] = createSignal(false);

	let disposed = false;
	onCleanup(() => {
		disposed = true;
	});

	const refresh = async (force = false) => {
		const currentEntry = readCacheEntry<T>(key, userId);
		if (!force && currentEntry && !isStale(currentEntry, ttlMs) && data()) {
			return;
		}
		if (!isBrowser()) {
			// SSR: rely on loader-provided initialData.
			return;
		}
		setIsRevalidating(true);
		try {
			const fresh = await dedupedFetch(key, fetcher);
			if (disposed) return;
			setData(() => fresh);
			setError(() => null);
			writeCacheEntry(key, fresh, userId);
		} catch (requestError) {
			if (disposed) return;
			// Keep stale data visible; only surface the error when we have nothing.
			if (!data()) {
				setError((requestError as Error).message);
			}
		} finally {
			if (!disposed) setIsRevalidating(false);
		}
	};

	const mutate = (next: T | ((current: T | null) => T)) => {
		const resolved =
			typeof next === "function"
				? (next as (current: T | null) => T)(data())
				: next;
		setData(() => resolved);
		setError(() => null);
		writeCacheEntry(key, resolved, userId);
	};

	onMount(() => {
		// Persist SSR data so the next navigation is instant, then revalidate if stale.
		if (options.initialData) {
			writeCacheEntry(key, options.initialData, userId);
		}
		const entry = readCacheEntry<T>(key, userId);
		if (!data() || !entry || isStale(entry, ttlMs)) {
			if (options.revalidate === false && data()) return;
			void refresh(true);
		}

		const detach = onCacheUpdated(key, () => {
			const updated = readCacheEntry<T>(key, userId);
			if (updated) {
				setData(() => updated.payload);
			}
		});
		onCleanup(detach);
	});

	// Keep the user scope in sync if it resolves after mount (e.g. account loads late).
	createEffect(() => {
		const scopedUserId = options.userId ?? null;
		if (!scopedUserId || !isBrowser()) return;
		const entry = readCacheEntry<T>(key, scopedUserId);
		if (entry && !data()) {
			setData(() => entry.payload);
		}
	});

	return {
		data,
		error,
		isLoading: () => !data() && !error(),
		isRevalidating,
		isStale: () => isStale(readCacheEntry<T>(key, userId), ttlMs),
		refresh: (force = true) => refresh(force),
		mutate,
	};
}
