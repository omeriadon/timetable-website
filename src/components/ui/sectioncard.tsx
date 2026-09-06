import type { JSX } from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import { cn } from "@/lib/utils";
import styles from "./sectioncard.module.css";

type SectionCardProps = {
	background: "paper" | "surface";
	title: string;
	symbolName: string;
	children: JSX.Element;
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
		<section class={cn(styles.card, styles[background], className)}>
			<header class={styles.header}>
				<div class={styles.heading}>
					<Symbol name={symbolName} class={styles.icon} />
					<div>{title}</div>
				</div>
			</header>
			<div class={styles.content}>{children}</div>
		</section>
	);
}
