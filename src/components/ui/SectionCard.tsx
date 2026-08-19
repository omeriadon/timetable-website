import type { ReactNode } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { cn } from "@/lib/utils";
import styles from "./SectionCard.module.css";

type SectionCardProps = {
	background: "paper" | "surface";
	title: string;
	symbolName: string;
	children: ReactNode;
	headingLevel?: "h1" | "h2";
	className?: string;
};

export function SectionCard({
	background,
	title,
	symbolName,
	children,
	headingLevel = "h2",
	className,
}: SectionCardProps) {
	const Heading = headingLevel;

	return (
		<section className={cn(styles.card, styles[background], className)}>
			<header className={styles.header}>
				<div className={styles.heading}>
					<Symbol name={symbolName} className={styles.icon} />
					<Heading>{title}</Heading>
				</div>
			</header>
			{children}
		</section>
	);
}
