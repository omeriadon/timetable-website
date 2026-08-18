"use client";

import styles from "./Sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const topGroups = [
  [
    {
      label: "Today",
      href: "/?mode=today",
      icon: "calendar.day.timeline.left.svg",
    },
    { label: "Week", href: "/?mode=week", icon: "calendar.badge.clock.svg" },
    {
      label: "Planner",
      href: "/?mode=planner",
      icon: "pencil.and.list.clipboard.svg",
    },
  ],
  [{ label: "Friends", href: "/friends", icon: "person.2.svg" }],
  [{ label: "Grades", href: "/grades", icon: "chart.bar.xaxis.svg" }],
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: "gear.svg" },
  {
    label: "Administration",
    href: "/administration",
    icon: "calendar.badge.lock.svg",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeMode = searchParams.get("mode") ?? "today";

  function isActive(href: string) {
    if (href.startsWith("/?mode=")) {
      return pathname === "/" && href.endsWith(activeMode);
    }

    return pathname === href;
  }

  function renderItem(item: (typeof topGroups)[number][number]) {
    return (
      <Link
        key={item.href}
        href={item.href}
        className={
          isActive(item.href)
            ? `${styles.sidebarLink} ${styles.active}`
            : styles.sidebarLink
        }
        aria-current={isActive(item.href) ? "page" : undefined}
      >
        <img
          className={styles.navIcon}
          src={`/icons/${item.icon}`}
          alt=""
          loading="eager"
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <aside className={styles.sidebar} aria-label="Sidebar navigation">
      <div className={styles.saturationOutline} aria-hidden="true" />

      <Image
        src="/icon.png"
        alt="Photo"
        loading="eager"
        width={100}
        height={100}
      />

      <nav className={styles.sidebarNav} aria-label="Main navigation">
        {topGroups.map((group, index) => (
          <div key={index} className={styles.sidebarGroup}>
            {group.map(renderItem)}
          </div>
        ))}
      </nav>
      <nav className={styles.sidebarBottom} aria-label="Account navigation">
        {bottomItems.map(renderItem)}
      </nav>
    </aside>
  );
}
