import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell/AppShell";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: "Timetable",
	description: "Timetable",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("font-sans", inter.variable)}>
			<body>
				<AppShell>{children}</AppShell>
			</body>
		</html>
	);
}
