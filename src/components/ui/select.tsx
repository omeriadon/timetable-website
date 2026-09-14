import {
	Select as Primitive,
	type SelectRootProps,
} from "@kobalte/core/select";
import {
	children,
	createContext,
	createSignal,
	createUniqueId,
	splitProps,
	useContext,
	type Accessor,
	type ComponentProps,
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
type SelectOptionGroup = {
	id: string;
	label?: JSX.Element;
	options: SelectOption[];
	separated: boolean;
};
const SelectOptionsContext = createContext<{
	registerOption: (option: SelectOption, groupID?: string) => void;
	registerGroup: (id: string) => void;
	setGroupLabel: (id: string, label: JSX.Element) => void;
	markSeparator: () => void;
}>();
const SelectGroupContext = createContext<string>();
type SelectProps = Omit<
	SelectRootProps<SelectOption, SelectOptionGroup>,
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
	const [options, setOptions] = createSignal<
		Array<SelectOption | SelectOptionGroup>
	>([]);
	let separatesNextGroup = false;
	const [local, rest] = splitProps(props, [
		"onValueChange",
		"value",
		"defaultValue",
		"disabled",
	]);
	const normalizeValue = (current: SelectValue | undefined) =>
		current === null || current === undefined ? current : String(current);
	const defaultValue = normalizeValue(
		typeof local.defaultValue === "function"
			? local.defaultValue()
			: local.defaultValue,
	);
	const [internalValue, setInternalValue] = createSignal<SelectValue>(
		defaultValue ?? null,
	);
	const value = () => {
		const current =
			typeof local.value === "function" ? local.value() : local.value;
		return local.value === undefined
			? normalizeValue(internalValue())
			: normalizeValue(current);
	};
	const flatOptions = () =>
		options().flatMap((option) =>
			"options" in option ? option.options : [option],
		);
	const selectedValue = () =>
		flatOptions().find((option) => option.value === value()) ?? null;
	return (
		<SelectOptionsContext.Provider
			value={{
				registerOption: (option, groupID) =>
					setOptions((current) => {
						if (
							current.some((item) =>
								"options" in item
									? item.options.some((child) => child.value === option.value)
									: item.value === option.value,
							)
						) {
							return current;
						}
						if (!groupID) {
							return [...current, option];
						}
						return current.map((item) =>
							"options" in item && item.id === groupID
								? { ...item, options: [...item.options, option] }
								: item,
						);
					}),
				registerGroup: (id) => {
					setOptions((current) =>
						current.some((item) => "options" in item && item.id === id)
							? current
							: [
									...current,
									{
										id,
										options: [],
										separated: separatesNextGroup,
									},
								],
					);
					separatesNextGroup = false;
				},
				setGroupLabel: (id, label) =>
					setOptions((current) =>
						current.map((item) =>
							"options" in item && item.id === id ? { ...item, label } : item,
						),
					),
				markSeparator: () => {
					separatesNextGroup = true;
				},
			}}
		>
			<Primitive<SelectOption, SelectOptionGroup>
				{...rest}
				options={options()}
				optionValue="value"
				optionTextValue={(option) => String(option.value)}
				optionGroupChildren="options"
				itemComponent={(item) => (
					<Primitive.Item
						item={item.item}
						data-slot="select-item"
						class={styles.item}
					>
						<Primitive.ItemLabel class={styles.itemText}>
							{item.item.rawValue.label}
						</Primitive.ItemLabel>
						<Primitive.ItemIndicator
							data-slot="select-item-indicator"
							class={styles.itemIndicator}
						>
							<CheckIcon class={styles.itemIndicatorIcon} />
						</Primitive.ItemIndicator>
					</Primitive.Item>
				)}
				sectionComponent={(section) => (
					<Primitive.Section
						class={cn(
							styles.group,
							section.section.rawValue.separated && styles.groupSeparated,
						)}
					>
						{section.section.rawValue.label ? (
							<span class={styles.label}>{section.section.rawValue.label}</span>
						) : null}
					</Primitive.Section>
				)}
				value={selectedValue()}
				disabled={
					typeof props.disabled === "function"
						? props.disabled()
						: props.disabled
				}
				onChange={(option) => {
					const next = Array.isArray(option) ? null : (option?.value ?? null);
					if (local.value === undefined) {
						setInternalValue(next);
					}
					local.onValueChange?.(next);
				}}
			>
				{props.children}
			</Primitive>
		</SelectOptionsContext.Provider>
	);
}
export function SelectGroup(props: { children?: JSX.Element }) {
	const context = useContext(SelectOptionsContext);
	const id = createUniqueId();
	context?.registerGroup(id);
	return (
		<SelectGroupContext.Provider value={id}>
			{props.children}
		</SelectGroupContext.Provider>
	);
}
export function SelectValue(props: ComponentProps<typeof Primitive.Value>) {
	return (
		<Primitive.Value
			{...props}
			data-slot="select-value"
			class={cn(styles.value, props.class ?? props.className)}
		/>
	);
}
export function SelectTrigger(props: ComponentProps<typeof Primitive.Trigger>) {
	return (
		<Primitive.Trigger
			{...props}
			data-slot="select-trigger"
			data-size={props.size ?? "default"}
			class={cn(styles.trigger, props.class ?? props.className)}
		>
			{props.children}
			<Primitive.Icon>
				<ChevronDownIcon class={styles.triggerIcon} />
			</Primitive.Icon>
		</Primitive.Trigger>
	);
}
export function SelectContent(props: ComponentProps<typeof Primitive.Content>) {
	const [local, rest] = splitProps(props, [
		"class",
		"className",
		"alignItemWithTrigger",
		"children",
	]);
	children(() => local.children)();
	return (
		<Primitive.Portal>
			<Primitive.Content
				{...rest}
				data-slot="select-content"
				class={cn(styles.content, local.class ?? local.className)}
			>
				<Primitive.Listbox />
			</Primitive.Content>
		</Primitive.Portal>
	);
}
export function SelectLabel(props: ComponentProps<typeof Primitive.Label>) {
	const context = useContext(SelectOptionsContext);
	const groupID = useContext(SelectGroupContext);
	if (groupID) {
		context?.setGroupLabel(groupID, props.children);
	}
	return null;
}
export function SelectItem(props: {
	value: string;
	children?: JSX.Element;
	key?: string;
}) {
	const context = useContext(SelectOptionsContext);
	const groupID = useContext(SelectGroupContext);
	context?.registerOption(
		{ value: String(props.value), label: props.children },
		groupID,
	);
	return null;
}
export function SelectSeparator() {
	useContext(SelectOptionsContext)?.markSeparator();
	return null;
}
export function SelectScrollUpButton() {
	return null;
}
export function SelectScrollDownButton() {
	return null;
}
