import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./List.module.css";

export function List({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div role="list" className={cn(styles.list, className)}>
			{children}
		</div>
	);
}

export function ListSection({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn(styles.section, className)}>{children}</section>
	);
}

export function ListSectionHeader({ children }: { children: ReactNode }) {
	return <div className={styles.sectionHeader}>{children}</div>;
}

export function ListRow({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div role="listitem" className={cn(styles.row, className)}>
			{children}
		</div>
	);
}
