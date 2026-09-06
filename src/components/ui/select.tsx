import { Select as Primitive } from "@kobalte/core/select";
import { CheckIcon, ChevronDownIcon } from "lucide-solid";
import { cn } from "@/lib/utils";
import styles from "./select.module.css";

type SelectProps = {
	onValueChange?: (value: string | null) => void;
	[key: string]: unknown;
};

const SelectRoot: any = Primitive;

export function Select(props: SelectProps) {
	const { onValueChange, ...rest } = props;
	return <SelectRoot {...rest} onChange={onValueChange} />;
}
export function SelectGroup(props: any) {
	return (
		<Primitive.Section
			{...props}
			class={cn(styles.group, props.class ?? props.className)}
		/>
	);
}
export function SelectValue(props: any) {
	return (
		<Primitive.Value
			{...props}
			class={cn(styles.value, props.class ?? props.className)}
		/>
	);
}
export function SelectTrigger(props: any) {
	return (
		<Primitive.Trigger
			{...props}
			data-slot="select-trigger"
			class={cn(styles.trigger, props.class ?? props.className)}
		>
			{props.children}
			<Primitive.Icon>
				<ChevronDownIcon class={styles.triggerIcon} />
			</Primitive.Icon>
		</Primitive.Trigger>
	);
}
export function SelectContent(props: any) {
	return (
		<Primitive.Portal>
			<Primitive.Content
				{...props}
				data-slot="select-content"
				class={cn(styles.content, props.class ?? props.className)}
			/>
		</Primitive.Portal>
	);
}
export function SelectLabel(props: any) {
	return (
		<Primitive.Label
			{...props}
			data-slot="select-label"
			class={cn(styles.label, props.class ?? props.className)}
		/>
	);
}
export function SelectItem(props: any) {
	return (
		<Primitive.Item
			{...props}
			data-slot="select-item"
			class={cn(styles.item, props.class ?? props.className)}
		>
			<Primitive.ItemLabel>{props.children}</Primitive.ItemLabel>
			<Primitive.ItemIndicator>
				<CheckIcon class={styles.itemIndicatorIcon} />
			</Primitive.ItemIndicator>
		</Primitive.Item>
	);
}
export function SelectSeparator(props: any) {
	return (
		<div
			{...props}
			data-slot="select-separator"
			role="separator"
			class={cn(styles.separator, props.class ?? props.className)}
		/>
	);
}
export function SelectScrollUpButton(props: any) {
	return null;
}
export function SelectScrollDownButton(props: any) {
	return null;
}
