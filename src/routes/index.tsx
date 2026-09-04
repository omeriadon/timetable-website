import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/page";

export const Route = createFileRoute("/")({
	component: LandingPage,
	head: () => ({
		meta: [
			{ title: "Timetable — Your school day, in one place" },
			{
				name: "description",
				content:
					"See your school day clearly with Timetable: today and week views, planning, grades, classes, and friends in one place.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Timetable" },
			{
				property: "og:title",
				content: "Timetable — Your school day, in one place",
			},
			{
				property: "og:description",
				content:
					"See your school day clearly with Timetable: today and week views, planning, grades, classes, and friends in one place.",
			},
			{ property: "og:url", content: "https://timetable.adonis.pt/" },
			{
				property: "og:image",
				content: "https://timetable.adonis.pt/social-card.webp",
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: "Timetable" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Timetable — Your school day, in one place",
			},
			{
				name: "twitter:description",
				content:
					"See your school day clearly with Timetable: today and week views, planning, grades, classes, and friends in one place.",
			},
			{
				name: "twitter:image",
				content: "https://timetable.adonis.pt/social-card.webp",
			},
		],
		links: [
			{
				rel: "canonical",
				href: "https://timetable.adonis.pt/",
			},
			{
				rel: "preload",
				href: "/fonts/SF-Mono-Regular.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous",
			},
		],
	}),
});
