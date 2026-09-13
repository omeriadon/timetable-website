const PREFIX = "timetable.cache.v1.";
export const CACHE_VERSION = 1;

export type CacheEntry<T> = {
	v: number;
	savedAt: number;
	userId: string | null;
	payload: T;
};

export function isBrowser() {
	return (
		typeof window !== "undefined" && typeof window.localStorage !== "undefined"
	);
}

function storageKey(key: string) {
	return `${PREFIX}${key}`;
}

export function readCacheEntry<T>(
	key: string,
	userId?: string | null,
): CacheEntry<T> | null {
	if (!isBrowser()) return null;
	try {
		const raw = window.localStorage.getItem(storageKey(key));
		if (!raw) return null;
		const entry = JSON.parse(raw) as CacheEntry<T>;
		if (
			!entry ||
			entry.v !== CACHE_VERSION ||
			typeof entry.savedAt !== "number"
		) {
			return null;
		}
		if (userId && entry.userId && entry.userId !== userId) {
			return null;
		}
		return entry;
	} catch {
		return null;
	}
}

export function writeCacheEntry<T>(
	key: string,
	payload: T,
	userId?: string | null,
) {
	if (!isBrowser()) return;
	try {
		const entry: CacheEntry<T> = {
			v: CACHE_VERSION,
			savedAt: Date.now(),
			userId: userId ?? null,
			payload,
		};
		window.localStorage.setItem(storageKey(key), JSON.stringify(entry));
		window.dispatchEvent(
			new CustomEvent("timetable:cache-updated", { detail: { key } }),
		);
	} catch (error) {
		// Quota or serialization failure: caching is best-effort, but log it
		// so a silently-empty cache (cold tabs always spinning) is diagnosable.
		if (typeof console !== "undefined") {
			console.warn(`[cache] failed to persist ${key}`, error);
		}
	}
}

export function removeCacheEntry(key: string) {
	if (!isBrowser()) return;
	try {
		window.localStorage.removeItem(storageKey(key));
	} catch {
		// ignore
	}
}

export function isStale(entry: { savedAt: number } | null, ttlMs: number) {
	if (!entry) return true;
	return Date.now() - entry.savedAt > ttlMs;
}

export function clearAllCachedData() {
	if (!isBrowser()) return;
	try {
		const doomed: string[] = [];
		for (let index = 0; index < window.localStorage.length; index++) {
			const storageKeyName = window.localStorage.key(index);
			if (storageKeyName?.startsWith(PREFIX)) {
				doomed.push(storageKeyName);
			}
		}
		for (const doomedKey of doomed) {
			window.localStorage.removeItem(doomedKey);
		}
	} catch {
		// ignore
	}
}

export function onCacheUpdated(key: string, callback: () => void) {
	if (!isBrowser()) return () => {};
	const handler = (event: Event) => {
		const detail = (event as CustomEvent).detail as
			{ key?: string } | undefined;
		if (detail?.key === key) callback();
	};
	const storageHandler = (event: StorageEvent) => {
		if (event.key === storageKey(key)) callback();
	};
	window.addEventListener("timetable:cache-updated", handler);
	window.addEventListener("storage", storageHandler);
	return () => {
		window.removeEventListener("timetable:cache-updated", handler);
		window.removeEventListener("storage", storageHandler);
	};
}
