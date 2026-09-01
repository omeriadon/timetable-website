import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/timetable/page";
export const Route = createFileRoute("/_authenticated/timetable")({
	component: Page,
});
