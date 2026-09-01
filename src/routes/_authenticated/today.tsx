import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/today/page";
export const Route = createFileRoute("/_authenticated/today")({
	component: Page,
});
