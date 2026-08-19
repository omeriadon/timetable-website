import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export function List({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn(styles.list, className)}>{children}</div>;
}

export function ListSection({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn(styles.listSection, className)}>{children}</section>
	);
}

export function ListSectionHeader({ children }: { children: ReactNode }) {
	return <div className={styles.listSectionHeader}>{children}</div>;
}

export function ListRow({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn(styles.listRow, className)}>{children}</div>;
}
