import { createMemo, Show } from "solid-js";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import styles from "./field.module.css";

function FieldSet({ className, ...props }: any) {
	return (
		<fieldset
			data-slot="field-set"
			{...props}
			class={cn(styles.fieldSet, className ?? props.class)}
		/>
	);
}

function FieldLegend({ className, variant = "legend", ...props }: any) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			{...props}
			class={cn(styles.legend, className ?? props.class)}
		/>
	);
}

function FieldGroup({ className, ...props }: any) {
	return (
		<div
			data-slot="field-group"
			{...props}
			class={cn(styles.group, className ?? props.class)}
		/>
	);
}

function Field({ className, orientation = "vertical", ...props }: any) {
	return (
		<div
			role="group"
			data-slot="field"
			data-orientation={orientation}
			{...props}
			class={cn(styles.field, className ?? props.class)}
		/>
	);
}

function FieldContent({ className, ...props }: any) {
	return (
		<div
			data-slot="field-content"
			{...props}
			class={cn(styles.content, className ?? props.class)}
		/>
	);
}

function FieldLabel({ className, ...props }: any) {
	return (
		<Label
			data-slot="field-label"
			{...props}
			class={cn(styles.label, className ?? props.class)}
		/>
	);
}

function FieldTitle({ className, ...props }: any) {
	return (
		<div
			data-slot="field-title"
			{...props}
			class={cn(styles.title, className ?? props.class)}
		/>
	);
}

function FieldDescription({ className, ...props }: any) {
	return (
		<p
			data-slot="field-description"
			{...props}
			class={cn(styles.description, className ?? props.class)}
		/>
	);
}

function FieldSeparator({ children, className, ...props }: any) {
	return (
		<div
			data-slot="field-separator"
			data-content={Boolean(children)}
			{...props}
			class={cn(styles.separator, className ?? props.class)}
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

function FieldError({ className, children, errors, ...props }: any) {
	const hasChildren = () => Boolean(children);
	const content = createMemo(() => {
		if (hasChildren()) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const typedErrors = errors as Array<{ message?: string } | undefined>;
		const uniqueErrors: Array<{ message?: string } | undefined> = [
			...new Map(
				typedErrors.map((error: { message?: string } | undefined) => [
					error?.message,
					error,
				]),
			).values(),
		];

		if (uniqueErrors.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul class={styles.errorList}>
				{uniqueErrors.map(
					(error) => error?.message && <li>{error.message}</li>,
				)}
			</ul>
		);
	});

	return (
		<Show when={content()}>
			{(value) => (
				<div
					role="alert"
					data-slot="field-error"
					{...props}
					class={cn(styles.error, className ?? props.class)}
				>
					{value()}
				</div>
			)}
		</Show>
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
