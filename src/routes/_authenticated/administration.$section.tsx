import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/administration/[section]/page";
export const Route = createFileRoute("/_authenticated/administration/$section")(
	{ component: Page },
);
