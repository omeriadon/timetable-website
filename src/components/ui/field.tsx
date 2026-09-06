import { createMemo } from "solid-js";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import styles from "./field.module.css";

function FieldSet({ className, ...props }: any) {
	return (
		<fieldset
			data-slot="field-set"
			class={cn(styles.fieldSet, className)}
			{...props}
		/>
	);
}

function FieldLegend({
	className,
	variant = "legend",
	...props
}: any) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			class={cn(styles.legend, className)}
			{...props}
		/>
	);
}

function FieldGroup({ className, ...props }: any) {
	return (
		<div
			data-slot="field-group"
			class={cn(styles.group, className)}
			{...props}
		/>
	);
}

function Field({
	className,
	orientation = "vertical",
	...props
}: any) {
	return (
		<div
			role="group"
			data-slot="field"
			data-orientation={orientation}
			class={cn(styles.field, className)}
			{...props}
		/>
	);
}

function FieldContent({ className, ...props }: any) {
	return (
		<div
			data-slot="field-content"
			class={cn(styles.content, className)}
			{...props}
		/>
	);
}

function FieldLabel({
	className,
	...props
}: any) {
	return (
		<Label
			data-slot="field-label"
			class={cn(styles.label, className)}
			{...props}
		/>
	);
}

function FieldTitle({ className, ...props }: any) {
	return (
		<div
			data-slot="field-title"
			class={cn(styles.title, className)}
			{...props}
		/>
	);
}

function FieldDescription({ className, ...props }: any) {
	return (
		<p
			data-slot="field-description"
			class={cn(styles.description, className)}
			{...props}
		/>
	);
}

function FieldSeparator({
	children,
	className,
	...props
}: any) {
	return (
		<div
			data-slot="field-separator"
			data-content={Boolean(children)}
			class={cn(styles.separator, className)}
			{...props}
		>
			<Separator class={styles.separatorLine} />

			{children && (
				<span
					data-slot="field-separator-content"
					class={styles.separatorContent}
				>
					{children}
				</span>
			)}
		</div>
	);
}

function FieldError({
	className,
	children,
	errors,
	...props
}: any) {
	const content = createMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const typedErrors = errors as Array<{ message?: string } | undefined>;
		const uniqueErrors: Array<{ message?: string } | undefined> = [
			...new Map(typedErrors.map((error: { message?: string } | undefined) => [error?.message, error])).values(),
		];

		if (uniqueErrors.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul class={styles.errorList}>
				{uniqueErrors.map(
					(error) =>
						error?.message && <li>{error.message}</li>,
				)}
			</ul>
		);
	});

	if (!content()) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			class={cn(styles.error, className)}
			{...props}
		>
			{content()}
		</div>
	);
}

export {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldContent,
	FieldTitle,
};
