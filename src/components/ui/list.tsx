import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import styles from "./list.module.css";

export function List({
	children,
	className,
	rowHover = false,
}: {
	children: ReactNode;
	className?: string;
	rowHover?: boolean;
}) {
	const items = Children.toArray(children);

	const hasSections = items.some(
		(item) => isValidElement(item) && item.type === ListSection,
	);

	if (!hasSections) {
		return (
			<Card
				role="list"
				className={cn(styles.card, rowHover && styles.rowHover, className)}
			>
				{children}
			</Card>
		);
	}

	return (
		<div
			role="list"
			className={cn(styles.sectionList, rowHover && styles.rowHover, className)}
		>
			{items.map((item, index) => {
				if (!isValidElement(item) || item.type !== ListSection) {
					return item;
				}

				const section = item as ReactElement<{
					children: ReactNode;
					className?: string;
				}>;

				const sectionChildren = Children.toArray(section.props.children);

				const header = sectionChildren.find(
					(child) => isValidElement(child) && child.type === ListSectionHeader,
				);

				const content = sectionChildren.filter(
					(child) =>
						!(isValidElement(child) && child.type === ListSectionHeader),
				);

				return (
					<div
						key={section.key ?? index}
						className={cn(styles.section, section.props.className)}
					>
						{header}

						<Card role="group" className={styles.card}>
							{content}
						</Card>
					</div>
				);
			})}
		</div>
	);
}

export function ListSection({
	children,
}: {
	children: ReactNode;
	className?: string;
}) {
	return children;
}

export function ListSectionHeader({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={cn(styles.sectionHeader, className)}>{children}</div>;
}

export function ListRow({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			role="listitem"
			data-slot="list-row"
			className={cn(styles.row, className)}
		>
			{children}
		</div>
	);
}
