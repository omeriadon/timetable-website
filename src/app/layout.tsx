import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import Toolbar, { ToolbarProvider } from "../components/Toolbar";
import styles from "./layout.module.css";
import "./globals.css";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

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
				<svg aria-hidden="true" width="0" height="0" focusable="false">
					<filter
						id="toolbar-button-liquid-glass"
						x="-20%"
						y="-20%"
						width="140%"
						height="140%"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.012 0.018"
							numOctaves="1"
							seed="8"
							result="noise"
						/>
						<feDisplacementMap
							in="SourceGraphic"
							in2="noise"
							scale="10"
							xChannelSelector="R"
							yChannelSelector="G"
							result="displaced"
						/>
						<feGaussianBlur in="displaced" stdDeviation="0.25" />
					</filter>
				</svg>
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
