import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import Toolbar, { ToolbarProvider } from "../components/Toolbar";
import styles from "./layout.module.css";
import "./globals.css";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const blurLevels = [0.5, 1, 1.5, 2, 2, 2, 2, 2];

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
				<ToolbarProvider>
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

							<Toolbar />
						</div>
					</div>
				</ToolbarProvider>
			</body>
		</html>
	);
}
