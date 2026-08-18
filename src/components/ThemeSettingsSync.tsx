"use client";

import { useEffect } from "react";
import { apiRequest } from "@/lib/api/client";

type ThemeSettings = { appFontDesign: "monospaced" | "rounded" | "expanded"; appBackground: "solid" | "paper" };

export default function ThemeSettingsSync() {
	useEffect(() => {
		const apply = (settings: ThemeSettings) => {
			document.documentElement.dataset.appFont = settings.appFontDesign;
			document.documentElement.dataset.appBackground = settings.appBackground;
		};
		apiRequest<ThemeSettings>("v1/settings")
			.then(apply)
			.catch(() => undefined);
		const handleUpdate = (event: Event) => apply((event as CustomEvent<ThemeSettings>).detail);
		window.addEventListener("timetable:theme", handleUpdate);
		return () => window.removeEventListener("timetable:theme", handleUpdate);
	}, []);
	return null;
}
