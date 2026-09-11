import { DropdownMenu as Primitive } from "@kobalte/core/dropdown-menu";
import { CheckIcon, ChevronRightIcon } from "lucide-solid";
import { cn } from "@/lib/utils";
import styles from "./dropdown-menu.module.css";

export const DropdownMenu = Primitive;
export const DropdownMenuPortal = Primitive.Portal;
export const DropdownMenuTrigger: any = Primitive.Trigger;
export function DropdownMenuContent(props: any) {
	return (
		<Primitive.Portal>
			<Primitive.Content
				{...props}
				data-slot="dropdown-menu-content"
				class={cn(styles.content, props.class ?? props.className)}
			/>
		</Primitive.Portal>
	);
}
export const DropdownMenuGroup = Primitive.Group;
export function DropdownMenuLabel(props: any) {
	return (
		<Primitive.GroupLabel
			{...props}
			data-slot="dropdown-menu-label"
			class={cn(styles.label, props.class ?? props.className)}
		/>
	);
}
export function DropdownMenuItem(props: any) {
	return (
		<Primitive.Item
			{...props}
			data-slot="dropdown-menu-item"
			data-variant={props.variant ?? "default"}
			class={cn(styles.item, props.class ?? props.className)}
		/>
	);
}
export const DropdownMenuSub = Primitive.Sub;
export function DropdownMenuSubTrigger(props: any) {
	return (
		<Primitive.SubTrigger
			{...props}
			data-slot="dropdown-menu-sub-trigger"
			class={cn(styles.subTrigger, props.class ?? props.className)}
		>
			{props.children}
			<ChevronRightIcon class={styles.subTriggerIcon} />
		</Primitive.SubTrigger>
	);
}
export function DropdownMenuSubContent(props: any) {
	return (
		<Primitive.SubContent
			{...props}
			data-slot="dropdown-menu-sub-content"
			class={cn(styles.subContent, props.class ?? props.className)}
		/>
	);
}
export function DropdownMenuCheckboxItem(props: any) {
	const { onCheckedChange, ...rest } = props;
	return (
		<Primitive.CheckboxItem
			{...rest}
			data-slot="dropdown-menu-checkbox-item"
			onChange={onCheckedChange}
			class={cn(styles.checkboxItem, props.class ?? props.className)}
		>
			<Primitive.ItemIndicator class={styles.itemIndicator}>
				<CheckIcon />
			</Primitive.ItemIndicator>
			{props.children}
		</Primitive.CheckboxItem>
	);
}
export function DropdownMenuRadioGroup(props: any) {
	const { onValueChange, ...rest } = props;
	return <Primitive.RadioGroup {...rest} onChange={onValueChange} />;
}
export function DropdownMenuRadioItem(props: any) {
	return (
		<Primitive.RadioItem
			{...props}
			data-slot="dropdown-menu-radio-item"
			class={cn(styles.radioItem, props.class ?? props.className)}
		>
			<Primitive.ItemIndicator class={styles.itemIndicator}>
				<CheckIcon />
			</Primitive.ItemIndicator>
			{props.children}
		</Primitive.RadioItem>
	);
}
export function DropdownMenuSeparator(props: any) {
	return (
		<Primitive.Separator
			{...props}
			data-slot="dropdown-menu-separator"
			class={cn(styles.separator, props.class ?? props.className)}
		/>
	);
}
export function DropdownMenuShortcut(props: any) {
	return (
		<span
			{...props}
			data-slot="dropdown-menu-shortcut"
			class={cn(styles.shortcut, props.class ?? props.className)}
		/>
	);
}
