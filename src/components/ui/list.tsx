import { Children, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import styles from "./list.module.css";

export function List({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const items = Children.toArray(children);
	const hasSections = items.some(
		(item) => isValidElement(item) && item.type === ListSection,
	);

	if (hasSections) {
		return (
			<div className={cn(styles.sectionList, className)}>
				{items.map((item, index) =>
					isValidElement(item) && item.type === ListSection ? (
						<Card key={item.key ?? index} role="group" className={styles.card}>
							{item}
						</Card>
					) : (
						item
					),
				)}
			</div>
		);
	}

	return (
		<Card role="list" className={cn(styles.card, className)}>
			{children}
		</Card>
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
