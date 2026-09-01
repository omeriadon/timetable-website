"use client";

import { usePathname } from "@/lib/routerCompat";
import type { ReactNode } from "react";

export default function RouteTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	return <div key={pathname}>{children}</div>;
}
