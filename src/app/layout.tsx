import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import Toolbar, {
	LiquidGlassButton,
	ToolbarProvider,
} from "../components/Toolbar";
import styles from "./layout.module.css";
import "./globals.css";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { FadeToBackground } from "@/components/ui/FadeToBackground";
import LiquidGlass from "@/components/LiquidGlass";

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

							{/* <LiquidGlassButton
								className={styles.liquidGlassTestButton}
								action={{
									label: "Liquid glass test",
									icon: "chart.bar.xaxis.svg",
								}}
							>
								<span className={styles.liquidGlassTestContent}>
									<strong>Refraction test</strong>
									<span>Move the page behind this panel</span>
								</span>
							</LiquidGlassButton> */}

							<LiquidGlass
								radius={16}
								scale={-180}
								border={0.07}
								alpha={0.93}
								inputBlur={10}
								outputBlur={2}
								red={0}
								green={10}
								blue={20}
								frost={0.05}
								saturation={1.5}
								className={styles.liquidGlassTestButton2}
							>
								<div>Test</div>
							</LiquidGlass>
						</div>
					</div>
				</ToolbarProvider>
			</body>
		</html>
	);
}
