import type { ReactNode } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { cn } from "@/lib/utils";
import styles from "./sectioncard.module.css";

type SectionCardProps = {
	background: "paper" | "surface";
	title: string;
	symbolName: string;
	children: ReactNode;
	className?: string;
};

export function SectionCard({
	background,
	title,
	symbolName,
	children,
	className,
}: SectionCardProps) {
	return (
		<section className={cn(styles.card, styles[background], className)}>
			<header className={styles.header}>
				<div className={styles.heading}>
					<Symbol name={symbolName} className={styles.icon} />
					<div>{title}</div>
				</div>
			</header>
			<div className={styles.content}>{children}</div>
		</section>
	);
}
