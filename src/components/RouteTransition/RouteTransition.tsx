import { useLocation } from "@tanstack/solid-router";
import { children as resolveChildren, Show, type JSX } from "solid-js";

export default function RouteTransition(props: { children: JSX.Element }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const resolvedChildren = resolveChildren(() => props.children);
	return (
		<div>
			<Show keyed when={pathname()}>
				{resolvedChildren()}
			</Show>
		</div>
	);
}
