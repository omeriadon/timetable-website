import { Popover as Primitive } from "@kobalte/core/popover";
import type { ComponentProps, JSX } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./popover.module.css";

export function Popover(props: ComponentProps<typeof Primitive>) {
	return <Primitive {...props} data-slot="popover" />;
}
export function PopoverTrigger(
	props: ComponentProps<typeof Primitive.Trigger>,
) {
	return <Primitive.Trigger {...props} data-slot="popover-trigger" />;
}
export function PopoverContent(
	props: ComponentProps<typeof Primitive.Content>,
) {
	return (
		<Primitive.Portal>
			<Primitive.Content
				{...props}
				data-slot="popover-content"
				class={cn(styles.content, props.class ?? props.className)}
			/>
		</Primitive.Portal>
	);
}
export function PopoverHeader(
	props: JSX.HTMLAttributes<HTMLDivElement> & { className?: string },
) {
	return (
		<div
			{...props}
			data-slot="popover-header"
			class={cn(styles.header, props.class ?? props.className)}
		/>
	);
}
export function PopoverTitle(props: ComponentProps<typeof Primitive.Title>) {
	return (
		<Primitive.Title
			{...props}
			data-slot="popover-title"
			class={cn(styles.title, props.class ?? props.className)}
		/>
	);
}
export function PopoverDescription(
	props: ComponentProps<typeof Primitive.Description>,
) {
	return (
		<Primitive.Description
			{...props}
			data-slot="popover-description"
			class={cn(styles.description, props.class ?? props.className)}
		/>
	);
}
