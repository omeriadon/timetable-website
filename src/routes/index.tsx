import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/page";

export const Route = createFileRoute("/")({
	component: LandingPage,
	head: () => ({
		meta: [{ title: "Timetable" }],
		links: [
			{
				rel: "preload",
				href: "/hdr-white.avif",
				as: "image",
				type: "image/avif",
			},
		],
	}),
});
