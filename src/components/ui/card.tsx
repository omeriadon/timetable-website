import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./card.module.css";

type DivProps = JSX.HTMLAttributes<HTMLDivElement> & { className?: string };

function part(className: string, props: DivProps) {
	const [local, rest] = splitProps(props, ["class", "className", "children"]);
	return (
		<div {...rest} class={cn(className, local.class ?? local.className)}>
			{local.children}
		</div>
	);
}

function Card(props: DivProps & { size?: "default" | "sm" }) {
	const [local, rest] = splitProps(props, [
		"class",
		"className",
		"children",
		"size",
	]);
	return (
		<div
			{...rest}
			data-slot="card"
			data-size={local.size ?? "default"}
			class={cn(styles.card, local.class ?? local.className)}
		>
			{local.children}
		</div>
	);
}

const CardHeader = (props: DivProps) => part(styles.header, props);
const CardTitle = (props: DivProps) => part(styles.title, props);
const CardDescription = (props: DivProps) => part(styles.description, props);
const CardAction = (props: DivProps) => part(styles.action, props);
const CardContent = (props: DivProps) => part(styles.content, props);
const CardFooter = (props: DivProps) => part(styles.footer, props);

export {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
};
