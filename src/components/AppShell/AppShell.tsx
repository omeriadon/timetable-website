"use client";

import { usePathname } from "@/lib/routerCompat";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Toolbar, { ToolbarProvider } from "@/components/Toolbar/Toolbar";
import ReflectedPageContent from "@/components/ReflectedPageContent/ReflectedPageContent";
import MobileTabBar from "@/components/MobileTabBar/MobileTabBar";
import SessionGate from "@/components/SessionGate/SessionGate";
import { DrawerProvider } from "@/components/drawers/Drawer/Drawer";
import ThemeSettingsSync from "@/components/ThemeSettingsSync/ThemeSettingsSync";
import { StatusBadgeProvider } from "@/components/StatusBadge/StatusBadge";
import styles from "@/app/layout.module.css";
import GradientBlinds from "@/components/GradientBlinds";

export default function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	if (pathname === "/" || pathname === "/login") {
		return children;
	}

	const isAboutPage = pathname === "/settings/about";

	return (
		<SessionGate>
			<StatusBadgeProvider>
				<ThemeSettingsSync />
				<DrawerProvider>
					<ToolbarProvider>
						<div
							className={`${styles.appShell} ${
								isAboutPage ? styles.aboutAppShell : ""
							}`}
						>
							{isAboutPage ? (
								<div className={styles.aboutBackground} aria-hidden="true">
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
							<div className={styles.outerAppShell}>
								<ReflectedPageContent>{children}</ReflectedPageContent>
								<Toolbar />
							</div>
							<MobileTabBar />
						</div>
					</ToolbarProvider>
				</DrawerProvider>
			</StatusBadgeProvider>
		</SessionGate>
	);
}
