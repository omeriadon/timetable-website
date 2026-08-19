"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import {
	Children,
	forwardRef,
	isValidElement,
	type ChangeEvent,
	type ComponentPropsWithoutRef,
	type ReactElement,
	type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "./primitives.module.css";

type OptionProps = {
	value?: string | number;
	disabled?: boolean;
	children?: ReactNode;
};

export type SelectProps = Omit<
	ComponentPropsWithoutRef<"select">,
	"children" | "onChange" | "value" | "defaultValue" | "multiple"
> & {
	children: ReactNode;
	value?: string | number;
	defaultValue?: string | number;
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
	function Select(
		{ children, className, value, defaultValue, onChange, ...props },
		ref,
	) {
		const options = Children.toArray(children).filter(isValidElement) as Array<
			ReactElement<OptionProps>
		>;
		const items = options.map((option) => ({
			value: String(option.props.value ?? option.props.children ?? ""),
			label: option.props.children,
		}));

		const emitChange = (nextValue: string | null) => {
			if (!onChange) {
				return;
			}

			const target = { value: nextValue ?? "" } as HTMLSelectElement;
			onChange({
				target,
				currentTarget: target,
			} as ChangeEvent<HTMLSelectElement>);
		};

		return (
			<BaseSelect.Root<string, false>
				{...props}
				items={items}
				value={value === undefined ? undefined : String(value)}
				defaultValue={
					defaultValue === undefined ? undefined : String(defaultValue)
				}
				onValueChange={emitChange}
			>
				<BaseSelect.Trigger
					ref={ref}
					className={cn(styles.selectTrigger, className)}
				>
					<BaseSelect.Value className={styles.selectValue} />
					<BaseSelect.Icon className={styles.selectIcon}>
						<SymbolIcon name="chevron.down" className={styles.selectSymbol} />
					</BaseSelect.Icon>
				</BaseSelect.Trigger>
				<BaseSelect.Portal>
					<BaseSelect.Positioner sideOffset={4}>
						<BaseSelect.Popup className={styles.popup}>
							<BaseSelect.List className={styles.selectList}>
								{options.map((option, index) => {
									const optionValue = String(
										option.props.value ?? option.props.children ?? "",
									);

									return (
										<BaseSelect.Item
											key={`${optionValue}-${index}`}
											value={optionValue}
											disabled={option.props.disabled}
											className={styles.selectItem}
										>
											<BaseSelect.ItemText>
												{option.props.children}
											</BaseSelect.ItemText>
										</BaseSelect.Item>
									);
								})}
							</BaseSelect.List>
						</BaseSelect.Popup>
					</BaseSelect.Positioner>
				</BaseSelect.Portal>
			</BaseSelect.Root>
		);
	},
);

Select.displayName = "Select";
