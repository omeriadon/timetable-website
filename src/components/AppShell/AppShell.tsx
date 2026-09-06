import type { JSX } from "solid-js";
import { useLocation } from "@tanstack/solid-router";
import Sidebar from "@/components/Sidebar/Sidebar";
import Toolbar, { ToolbarProvider } from "@/components/Toolbar/Toolbar";
import ReflectedPageContent from "@/components/ReflectedPageContent/ReflectedPageContent";
import MobileTabBar from "@/components/MobileTabBar/MobileTabBar";
import { DrawerProvider } from "@/components/drawers/Drawer/Drawer";
import ThemeSettingsSync from "@/components/ThemeSettingsSync/ThemeSettingsSync";
import { StatusBadgeProvider } from "@/components/StatusBadge/StatusBadge";
import styles from "@/styles/layout.module.css";
import GradientBlinds from "@/components/GradientBlinds";

export default function AppShell({ children }: { children: JSX.Element }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const isAboutPage = () => pathname() === "/settings/about";

	return (
		<StatusBadgeProvider>
			<ThemeSettingsSync />
			<DrawerProvider>
				<ToolbarProvider>
					<div
						class={`${styles.appShell} ${
							isAboutPage() ? styles.aboutAppShell : ""
						}`}
					>
						{isAboutPage() ? (
							<div class={styles.aboutBackground} aria-hidden="true">
								<GradientBlinds
									gradientColors={["#997554", "#d1b38c"]}
									angle={0}
									noise={0}
									blindCount={20}
									blindMinWidth={60}
									spotlightRadius={1}
									spotlightSoftness={1}
									spotlightOpacity={1}
									mouseDampening={1}
									distortAmount={4}
									shineDirection="left"
									mixBlendMode="lighten"
									pointerTarget="window"
								/>
							</div>
						) : null}
						<Sidebar />
						<div class={styles.outerAppShell}>
							<ReflectedPageContent>{children}</ReflectedPageContent>
							<Toolbar />
						</div>
						<MobileTabBar />
					</div>
				</ToolbarProvider>
			</DrawerProvider>
		</StatusBadgeProvider>
	);
}
