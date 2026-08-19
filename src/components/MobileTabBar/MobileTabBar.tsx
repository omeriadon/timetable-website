"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
import styles from "./MobileTabBar.module.css";

const tabs = [
  { href: "/", label: "Timetable", icon: "calendar.day.timeline.left.svg" },
  { href: "/friends", label: "Friends", icon: "person.2.svg" },
  { href: "/grades", label: "Grades", icon: "chart.bar.xaxis.svg" },
  { href: "/settings", label: "Settings", icon: "gear.svg" },
  { href: "/administration", label: "Admin", icon: "calendar.badge.lock.svg" },
];

export default function MobileTabBar() {
  const isCompact = useCompactLayout();
  const pathname = usePathname();
  const [isAdministrator, setIsAdministrator] = useState(false);

  useEffect(() => {
    apiRequest<Account>("v1/account")
      .then((account) =>
        setIsAdministrator(
          account.authority.toLowerCase().includes("admin") ||
            account.authority.toLowerCase().includes("owner"),
        ),
      )
      .catch(() => setIsAdministrator(false));
  }, []);

  if (!isCompact) {
    return null;
  }

  return (
    <nav
      className={styles.tabBar}
      style={{ "--tab-count": isAdministrator ? 5 : 4 } as CSSProperties}
      aria-label="Primary navigation"
    >
      {tabs
        .filter((tab) => tab.label !== "Admin" || isAdministrator)
        .map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={active ? `${styles.tab} ${styles.active}` : styles.tab}
              aria-current={active ? "page" : undefined}
            >
              <img
                className={styles.symbol}
                src={`/icons/${tab.icon}`}
                alt=""
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
