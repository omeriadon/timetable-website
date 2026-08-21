"use client";

import { usePathname } from "next/navigation";
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

export default function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	if (pathname === "/" || pathname === "/login") {
		return children;
	}

	return (
		<SessionGate>
			<StatusBadgeProvider>
				<ThemeSettingsSync />
				<DrawerProvider>
					<ToolbarProvider>
						<div className={styles.appShell}>
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
