import { useEffect } from "react";
import { apiRequest } from "@/lib/api/client";

type ThemeSettings = {
	appFontDesign: "monospaced" | "rounded" | "expanded";
};

export default function ThemeSettingsSync() {
	useEffect(() => {
		const apply = (settings: ThemeSettings) => {
			document.documentElement.dataset.appFont = settings.appFontDesign;
		};
		apiRequest<ThemeSettings>("v1/settings")
			.then(apply)
			.catch(() => undefined);
		const handleUpdate = (event: Event) =>
			apply((event as CustomEvent<ThemeSettings>).detail);
		window.addEventListener("timetable:theme", handleUpdate);
		return () => window.removeEventListener("timetable:theme", handleUpdate);
	}, []);
	return null;
}
