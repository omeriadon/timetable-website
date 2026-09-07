import { Accordion as Primitive } from "@kobalte/core/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-solid";
import { cn } from "@/lib/utils";
import styles from "./according.module.css";

export function Accordion(props: any) {
	return (
		<Primitive
			{...props}
			data-slot="accordion"
			class={cn(styles.accordion, props.class ?? props.className)}
		/>
	);
}

export function AccordionItem(props: any) {
	return (
		<Primitive.Item
			{...props}
			data-slot="accordion-item"
			class={cn(styles.item, props.class ?? props.className)}
		/>
	);
}

export function AccordionTrigger(props: any) {
	return (
		<Primitive.Header class={styles.header}>
			<Primitive.Trigger
				{...props}
				data-slot="accordion-trigger"
				class={cn(styles.trigger, props.class ?? props.className)}
			>
				{props.children}
				<ChevronDownIcon
					data-slot="accordion-trigger-icon"
					class={cn(styles.triggerIcon, styles.downIcon)}
				/>
				<ChevronUpIcon
					data-slot="accordion-trigger-icon"
					class={cn(styles.triggerIcon, styles.upIcon)}
				/>
			</Primitive.Trigger>
		</Primitive.Header>
	);
}

export function AccordionContent(props: any) {
	return (
		<Primitive.Content
			{...props}
			data-slot="accordion-content"
			class={styles.panel}
		>
			<div class={cn(styles.content, props.class ?? props.className)}>
				{props.children}
			</div>
		</Primitive.Content>
	);
}
