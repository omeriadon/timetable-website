import {
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/solid-router";
import { HydrationScript, Suspense } from "solid-js/web";
import "../styles/globals.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Timetable" },
			{ name: "theme-color", content: "#000000" },
			{ name: "application-name", content: "Timetable" },
			{ name: "apple-mobile-web-app-title", content: "Timetable" },
			{ name: "apple-mobile-web-app-capable", content: "yes" },
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
		],
		links: [
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument(props: { children: any }) {
	return (
		<html lang="en">
			<head>
				<HydrationScript />
			</head>
			<body>
				<HeadContent />
				<Suspense>
					{props.children}
				</Suspense>
				<Scripts />
			</body>
		</html>
	);
}
