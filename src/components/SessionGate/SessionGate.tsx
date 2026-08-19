"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api/client";

export default function SessionGate({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let isCurrent = true;
		setReady(false);

		apiRequest("session")
			.then(() => {
				if (isCurrent) {
					setReady(true);
				}
			})
			.catch(() => {
				if (isCurrent) {
					router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
				}
			});

		return () => {
			isCurrent = false;
		};
	}, [pathname, router]);

	return ready ? children : null;
}
