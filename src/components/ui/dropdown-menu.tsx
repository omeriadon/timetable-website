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
			class={cn(styles.label, props.class ?? props.className)}
		/>
	);
}
export function DropdownMenuItem(props: any) {
	return (
		<Primitive.Item
			{...props}
			class={cn(styles.item, props.class ?? props.className)}
		/>
	);
}
export const DropdownMenuSub = Primitive.Sub;
export function DropdownMenuSubTrigger(props: any) {
	return (
		<Primitive.SubTrigger
			{...props}
			class={cn(styles.subTrigger, props.class ?? props.className)}
		>
			{props.children}
			<ChevronRightIcon class={styles.subTriggerIcon} />
		</Primitive.SubTrigger>
	);
}
export const DropdownMenuSubContent = Primitive.SubContent;
export function DropdownMenuCheckboxItem(props: any) {
	const { onCheckedChange, ...rest } = props;
	return (
		<Primitive.CheckboxItem
			{...rest}
			onChange={onCheckedChange}
			class={cn(styles.checkboxItem, props.class ?? props.className)}
		>
			<Primitive.ItemIndicator>
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
			class={cn(styles.radioItem, props.class ?? props.className)}
		>
			<Primitive.ItemIndicator>
				<CheckIcon />
			</Primitive.ItemIndicator>
			{props.children}
		</Primitive.RadioItem>
	);
}
export const DropdownMenuSeparator = Primitive.Separator;
export function DropdownMenuShortcut(props: any) {
	return (
		<span
			{...props}
			class={cn(styles.shortcut, props.class ?? props.className)}
		/>
	);
}
