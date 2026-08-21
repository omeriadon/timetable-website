import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./accordion.module.css";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
	return (
		<AccordionPrimitive.Root
			data-slot="accordion"
			className={cn(styles.accordion, className)}
			{...props}
		/>
	);
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn(styles.item, className)}
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	...props
}: AccordionPrimitive.Trigger.Props) {
	return (
		<AccordionPrimitive.Header className={styles.header}>
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(styles.trigger, className)}
				{...props}
			>
				{children}

				<ChevronDownIcon
					data-slot="accordion-trigger-icon"
					className={cn(styles.triggerIcon, styles.downIcon)}
				/>

				<ChevronUpIcon
					data-slot="accordion-trigger-icon"
					className={cn(styles.triggerIcon, styles.upIcon)}
				/>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: AccordionPrimitive.Panel.Props) {
	return (
		<AccordionPrimitive.Panel
			data-slot="accordion-content"
			className={styles.panel}
			{...props}
		>
			<div className={cn(styles.content, className)}>{children}</div>
		</AccordionPrimitive.Panel>
	);
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
