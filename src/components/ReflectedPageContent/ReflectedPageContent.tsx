import type { ReactNode } from "react";
import styles from "@/styles/layout.module.css";
import RouteTransition from "@/components/RouteTransition/RouteTransition";

type ReflectedPageContentProps = {
	children: ReactNode;
};

export default function ReflectedPageContent({
	children,
}: ReflectedPageContentProps) {
	return (
		<div className={styles.pageContent}>
			<div className={styles.contentSurface}>
				<RouteTransition>{children}</RouteTransition>
			</div>
		</div>
	);
}
