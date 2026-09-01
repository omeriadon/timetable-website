import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/testing/page";
export const Route = createFileRoute("/_authenticated/testing")({
	component: Page,
	head: () => ({ meta: [{ title: "Testing · Timetable" }] }),
});
