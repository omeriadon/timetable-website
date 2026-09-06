import { useLocation } from "@tanstack/solid-router";
import type { JSX } from "solid-js";

export default function RouteTransition({ children }: { children: JSX.Element }) {
	useLocation({ select: (location) => location.pathname });
	return <div>{children}</div>;
}
