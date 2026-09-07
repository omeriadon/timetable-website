import { children as resolveChildren, type JSX } from "solid-js";
import styles from "@/styles/layout.module.css";
import RouteTransition from "@/components/RouteTransition/RouteTransition";

type ReflectedPageContentProps = {
	children: JSX.Element;
};

export default function ReflectedPageContent(props: ReflectedPageContentProps) {
	const children = resolveChildren(() => props.children);
	return (
		<div class={styles.pageContent}>
			<div class={styles.contentSurface}>
				<RouteTransition>{children()}</RouteTransition>
			</div>
		</div>
	);
}
