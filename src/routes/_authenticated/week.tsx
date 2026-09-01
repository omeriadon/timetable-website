import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/week/page";
export const Route = createFileRoute("/_authenticated/week")({
	component: Page,
});
