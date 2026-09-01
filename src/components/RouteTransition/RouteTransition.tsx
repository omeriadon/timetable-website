"use client";

import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

export default function RouteTransition({ children }: { children: ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	return <div key={pathname}>{children}</div>;
}
