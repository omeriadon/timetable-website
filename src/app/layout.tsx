import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import styles from "./layout.module.css";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const blurLevels = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

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

						<ProgressiveBlur
							height="10%"
							position="bottom"
							blurLevels={blurLevels}
						/>
						<ProgressiveBlur
							height="10%"
							position="top"
							blurLevels={blurLevels}
						/>
					</div>
				</div>
			</body>
		</html>
	);
}
