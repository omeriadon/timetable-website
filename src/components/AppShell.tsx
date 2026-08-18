"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Toolbar, { ToolbarProvider } from "@/components/Toolbar";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { FadeToBackground } from "@/components/ui/FadeToBackground";
import ReflectedPageContent from "@/components/ReflectedPageContent";
import MobileTabBar from "@/components/MobileTabBar";
import SessionGate from "@/components/SessionGate";
import { SheetProvider } from "@/components/sheets/Sheet";
import styles from "@/app/layout.module.css";

const blurLevels = [0.5, 1, 1.5, 2, 2, 2, 2, 2];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return children;
  }

  return (
    <SessionGate>
      <SheetProvider>
        <ToolbarProvider>
          <div className={styles.appShell}>
            <Sidebar />
            <div className={styles.outerAppShell}>
              <ReflectedPageContent>{children}</ReflectedPageContent>
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
            <MobileTabBar />
          </div>
        </ToolbarProvider>
      </SheetProvider>
    </SessionGate>
  );
}
