import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import Toolbar, { ToolbarProvider } from "../components/Toolbar";
import styles from "./layout.module.css";
import "./globals.css";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { FadeToBackground } from "@/components/ui/FadeToBackground";

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
								height="5%"
								position="bottom"
								blurLevels={blurLevels}
							/>

							<ProgressiveBlur
								height="10%"
								position="top"
								blurLevels={blurLevels}
							/>

							<FadeToBackground
								height="15%"
								maxOpacity={0.8}
								direction="to top"
								className={styles.fadeToBackgroundTop}
							/>

							<Toolbar />
						</div>
					</div>
				</ToolbarProvider>
			</body>
		</html>
	);
}
