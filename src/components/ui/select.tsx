import {
	Select as Primitive,
	type SelectRootProps,
} from "@kobalte/core/select";
import {
	createContext,
	createSignal,
	splitProps,
	useContext,
	type Accessor,
	type JSX,
} from "solid-js";
import { CheckIcon, ChevronDownIcon } from "lucide-solid";
import { cn } from "@/lib/utils";
import styles from "./select.module.css";

type SelectValue = string | number | null;
type SelectOption = {
	value: string;
	label: JSX.Element;
};
const SelectOptionsContext = createContext<{
	register: (option: SelectOption) => void;
}>();
type SelectProps = Omit<
	SelectRootProps<SelectOption>,
	"onChange" | "multiple" | "value" | "defaultValue" | "options" | "disabled"
> & {
	onValueChange?: (value: string | null) => void;
	multiple?: false;
	value?: SelectValue | Accessor<SelectValue>;
	defaultValue?:
		Exclude<SelectValue, null> | Accessor<Exclude<SelectValue, null>>;
	children?: JSX.Element;
	disabled?: boolean | Accessor<boolean>;
};

export function Select(props: SelectProps) {
	const [options, setOptions] = createSignal<SelectOption[]>([]);
	const [local, rest] = splitProps(props, [
		"onValueChange",
		"value",
		"defaultValue",
		"disabled",
	]);
	const value = () => {
		const current =
			typeof local.value === "function" ? local.value() : local.value;
		return current === null || current === undefined
			? current
			: String(current);
	};
	const defaultValue = () => {
		const current =
			typeof local.defaultValue === "function"
				? local.defaultValue()
				: local.defaultValue;
		return current === undefined ? undefined : String(current);
	};
	const selectedValue = () =>
		options().find((option) => option.value === value()) ?? null;
	const selectedDefaultValue = () =>
		options().find((option) => option.value === defaultValue());
	return (
		<SelectOptionsContext.Provider
			value={{
				register: (option) =>
					setOptions((current) =>
						current.some((item) => item.value === option.value)
							? current
							: [...current, option],
					),
			}}
		>
			<Primitive<SelectOption>
				{...rest}
				options={options()}
				optionValue="value"
				optionTextValue={(option) => String(option.value)}
				itemComponent={(item) => (
					<Primitive.Item item={item.item}>
						<Primitive.ItemLabel>
							{item.item.rawValue.label}
						</Primitive.ItemLabel>
						<Primitive.ItemIndicator>
							<CheckIcon class={styles.itemIndicatorIcon} />
						</Primitive.ItemIndicator>
					</Primitive.Item>
				)}
				value={selectedValue()}
				defaultValue={selectedDefaultValue()}
				disabled={
					typeof props.disabled === "function"
						? props.disabled()
						: props.disabled
				}
				onChange={(option) =>
					local.onValueChange?.(
						Array.isArray(option) ? null : (option?.value ?? null),
					)
				}
			>
				{props.children}
			</Primitive>
		</SelectOptionsContext.Provider>
	);
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
export function SelectItem(props: {
	value: string;
	children?: JSX.Element;
	key?: string;
}) {
	const context = useContext(SelectOptionsContext);
	context?.register({ value: String(props.value), label: props.children });
	return null;
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
