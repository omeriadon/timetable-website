import * as AlertDialogPrimitive from "@kobalte/core/dialog";
import type { ComponentProps, JSX } from "solid-js";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import styles from "./alert-dialog.module.css";

function AlertDialog(
	props: ComponentProps<typeof AlertDialogPrimitive.Dialog>,
) {
	return <AlertDialogPrimitive.Dialog data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(
	props: ComponentProps<typeof AlertDialogPrimitive.Trigger>,
) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}

function AlertDialogPortal(
	props: ComponentProps<typeof AlertDialogPrimitive.Portal>,
) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}

function AlertDialogOverlay({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Overlay> & {
	className?: string;
}) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			{...props}
			class={cn(styles.overlay, className ?? props.class)}
		/>
	);
}

function AlertDialogContent({
	className,
	size = "default",
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Content> & {
	className?: string;
	size?: "default" | "sm";
}) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot="alert-dialog-content"
				data-size={size}
				{...props}
				class={cn(styles.content, className ?? props.class)}
			/>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({
	className,
	...props
}: JSX.HTMLAttributes<HTMLDivElement> & { className?: string }) {
	return (
		<div
			data-slot="alert-dialog-header"
			{...props}
			class={cn(styles.header, className ?? props.class)}
		/>
	);
}

function AlertDialogFooter({
	className,
	...props
}: JSX.HTMLAttributes<HTMLDivElement> & { className?: string }) {
	return (
		<div
			data-slot="alert-dialog-footer"
			{...props}
			class={cn(styles.footer, className ?? props.class)}
		/>
	);
}

function AlertDialogMedia({
	className,
	...props
}: JSX.HTMLAttributes<HTMLDivElement> & { className?: string }) {
	return (
		<div
			data-slot="alert-dialog-media"
			{...props}
			class={cn(styles.media, className ?? props.class)}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Title> & {
	className?: string;
}) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			{...props}
			class={cn(styles.title, className ?? props.class)}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Description> & {
	className?: string;
}) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			{...props}
			class={cn(styles.description, className ?? props.class)}
		/>
	);
}

function AlertDialogAction({
	className,
	...props
}: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	variant?:
		"default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
	size?:
		"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
}) {
	return (
		<Button
			data-slot="alert-dialog-action"
			class={className ?? props.class}
			{...props}
		/>
	);
}

function AlertDialogCancel({
	className,
	variant = "outline",
	size = "default",
	...props
}: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	variant?:
		"default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
	size?:
		"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
}) {
	return (
		<AlertDialogPrimitive.CloseButton
			data-slot="alert-dialog-cancel"
			class={className ?? props.class}
			as={Button}
			variant={variant}
			size={size}
			{...props}
		/>
	);
}

export {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogOverlay,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger,
};
