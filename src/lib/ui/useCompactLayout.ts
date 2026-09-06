import { createSignal, onCleanup, onMount } from "solid-js";

export const compactLayoutQuery = "(max-width: 700px)";

export function useCompactLayout() {
	const [isCompact, setIsCompact] = createSignal(false);

	onMount(() => {
		const mediaQuery = window.matchMedia(compactLayoutQuery);
		const update = () => setIsCompact(mediaQuery.matches);
		update();
		mediaQuery.addEventListener("change", update);
		onCleanup(() => mediaQuery.removeEventListener("change", update));
	});

	return isCompact;
}
