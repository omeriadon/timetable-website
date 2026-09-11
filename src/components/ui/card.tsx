import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./card.module.css";

type DivProps = JSX.HTMLAttributes<HTMLDivElement> & { className?: string };

function part(slot: string, className: string, props: DivProps) {
	const [local, rest] = splitProps(props, ["class", "className", "children"]);
	return (
		<div
			{...rest}
			data-slot={`card-${slot}`}
			class={cn(className, local.class ?? local.className)}
		>
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

const CardHeader = (props: DivProps) => part("header", styles.header, props);
const CardTitle = (props: DivProps) => part("title", styles.title, props);
const CardDescription = (props: DivProps) =>
	part("description", styles.description, props);
const CardAction = (props: DivProps) => part("action", styles.action, props);
const CardContent = (props: DivProps) => part("content", styles.content, props);
const CardFooter = (props: DivProps) => part("footer", styles.footer, props);

export {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
};
