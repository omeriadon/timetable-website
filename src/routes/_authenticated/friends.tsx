import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/friends/page";
export const Route = createFileRoute("/_authenticated/friends")({
	component: Page,
});
