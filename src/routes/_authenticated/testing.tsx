import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/testing/page";
export const Route = createFileRoute("/_authenticated/testing")({
	component: Page,
});
