import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/settings/page";
export const Route = createFileRoute("/_authenticated/settings")({
	component: Page,
});
