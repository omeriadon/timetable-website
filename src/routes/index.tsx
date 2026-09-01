import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/page";

export const Route = createFileRoute("/")({
	component: LandingPage,
	head: () => ({
		meta: [
			{ title: "Timetable" },
			{
				name: "description",
				content:
					"Timetable for Perth Mod students: view your day, week, planner, grades, and friends in one place.",
			},
		],
		links: [
			{
				rel: "preload",
				href: "/hdr-white.avif",
				as: "image",
				type: "image/avif",
			},
			{
				rel: "preload",
				href: "/fonts/SF-Mono-Regular.otf",
				as: "font",
				type: "font/otf",
				crossOrigin: "anonymous",
			},
		],
	}),
});
