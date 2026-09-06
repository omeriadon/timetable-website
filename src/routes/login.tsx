import { createFileRoute } from "@tanstack/solid-router";
import LoginPage from "@/pages/login/page";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	head: () => ({
		meta: [
			{ title: "Log in · Timetable" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});
