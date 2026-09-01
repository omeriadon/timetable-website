import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/grades/page";
export const Route = createFileRoute("/_authenticated/grades")({
	component: Page,
});
