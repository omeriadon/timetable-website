"use client";

import { usePathname, useRouter } from "@/lib/routerCompat";
import { useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "@/lib/api/client";
import { resetDashboardCache } from "@/features/timetable/useDashboard";

export default function SessionGate({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let isCurrent = true;
		resetDashboardCache();

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
	}, []);

	return ready ? children : null;
}
