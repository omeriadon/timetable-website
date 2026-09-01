import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/administration/[section]/page";
export const Route = createFileRoute("/_authenticated/administration/$section")(
	{
		component: () => {
			const { section } = Route.useParams();
			return <Page section={section} />;
		},
	},
);
