"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./RouteTransition.module.css";

export default function RouteTransition({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<div
			key={pathname}
			className={hasMounted ? styles.route : undefined}
		>
			{children}
		</div>
	);
}
