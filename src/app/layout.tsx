import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import styles from "./layout.module.css";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
		<html lang="en">
			<body>
				<div className={styles.appShell}>
					<Sidebar />

					<div className={styles.outerAppShell}>
						<div className={styles.pageContent}>{children}</div>

						<ProgressiveBlur height="50%" position="bottom" />
					</div>
				</div>
			</body>
		</html>
	);
}
