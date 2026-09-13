import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		// Warm navigations reuse loader data instead of refetching from scratch.
		// Client pages render localStorage cache instantly and revalidate in
		// the background, so the router must not block on loaders either.
		defaultStaleTime: 5 * 60 * 1000,
		defaultGcTime: 30 * 60 * 1000,
		defaultPreloadStaleTime: 5 * 60 * 1000,
		// Don't flash a pendingComponent for fast loader resolutions;
		// cold starts still show it after this delay.
		defaultPendingMs: 250,
		defaultPendingMinMs: 0,
	});
}

declare module "@tanstack/solid-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
