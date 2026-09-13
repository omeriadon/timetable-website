import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/testing/page";
import { loadAdministration } from "@/lib/server/page-data.functions";
import { redirect } from "@tanstack/solid-router";
export const Route = createFileRoute("/_authenticated/testing")({
	loader: async () => {
		const administration = await loadAdministration();
		if (!administration.isAdmin) {
			throw redirect({ to: "/today" });
		}
		return administration;
	},
	component: Page,
	head: () => ({ meta: [{ title: "Testing · Timetable" }] }),
});
