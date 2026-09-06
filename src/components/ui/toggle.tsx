import { Switch as Primitive } from "@kobalte/core/switch";
import { cn } from "@/lib/utils";
import styles from "./toggle.module.css";

export function Toggle(props: any) {
	const className = () => cn(styles.root, props.class ?? props.className);
	return <Primitive {...props} class={className()}>
		<Primitive.Input />
		<Primitive.Control data-size={props.size ?? "default"}>
			<Primitive.Thumb class={styles.thumb} />
		</Primitive.Control>
	</Primitive>;
}
