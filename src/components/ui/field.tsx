"use client";

import { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import styles from "./field.module.css";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
	return (
		<fieldset
			data-slot="field-set"
			className={cn(styles.fieldSet, className)}
			{...props}
		/>
	);
}

function FieldLegend({
	className,
	variant = "legend",
	...props
}: React.ComponentProps<"legend"> & {
	variant?: "legend" | "label";
}) {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(styles.legend, className)}
			{...props}
		/>
	);
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-group"
			className={cn(styles.group, className)}
			{...props}
		/>
	);
}

function Field({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<"div"> & {
	orientation?: "vertical" | "horizontal" | "responsive";
}) {
	return (
		<div
			role="group"
			data-slot="field"
			data-orientation={orientation}
			className={cn(styles.field, className)}
			{...props}
		/>
	);
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-content"
			className={cn(styles.content, className)}
			{...props}
		/>
	);
}

function FieldLabel({
	className,
	...props
}: React.ComponentProps<typeof Label>) {
	return (
		<Label
			data-slot="field-label"
			className={cn(styles.label, className)}
			{...props}
		/>
	);
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-title"
			className={cn(styles.title, className)}
			{...props}
		/>
	);
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="field-description"
			className={cn(styles.description, className)}
			{...props}
		/>
	);
}

function FieldSeparator({
	children,
	className,
	...props
}: React.ComponentProps<"div"> & {
	children?: React.ReactNode;
}) {
	return (
		<div
			data-slot="field-separator"
			data-content={Boolean(children)}
			className={cn(styles.separator, className)}
			{...props}
		>
			<Separator className={styles.separatorLine} />

			{children && (
				<span
					data-slot="field-separator-content"
					className={styles.separatorContent}
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
}: React.ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
}) {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		];

		if (uniqueErrors.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul className={styles.errorList}>
				{uniqueErrors.map(
					(error, index) =>
						error?.message && <li key={index}>{error.message}</li>,
				)}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn(styles.error, className)}
			{...props}
		>
			{content}
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
