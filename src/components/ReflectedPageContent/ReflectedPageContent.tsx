import type { JSX } from "solid-js";
import styles from "@/styles/layout.module.css";
import RouteTransition from "@/components/RouteTransition/RouteTransition";

type ReflectedPageContentProps = {
	children: JSX.Element;
};

export default function ReflectedPageContent({
	children,
}: ReflectedPageContentProps) {
	return (
		<div class={styles.pageContent}>
			<div class={styles.contentSurface}>
				<RouteTransition>{children}</RouteTransition>
			</div>
		</div>
	);
}
