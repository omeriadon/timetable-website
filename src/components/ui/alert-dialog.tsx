import * as AlertDialogPrimitive from "@kobalte/core/dialog";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import styles from "./alert-dialog.module.css";

function AlertDialog(props: any) {
	return <AlertDialogPrimitive.Dialog data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: any) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}

function AlertDialogPortal(props: any) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}

function AlertDialogOverlay({ className, ...props }: any) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			{...props}
			class={cn(styles.overlay, className ?? props.class)}
		/>
	);
}

function AlertDialogContent({ className, size = "default", ...props }: any) {
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

function AlertDialogHeader({ className, ...props }: any) {
	return (
		<div
			data-slot="alert-dialog-header"
			{...props}
			class={cn(styles.header, className ?? props.class)}
		/>
	);
}

function AlertDialogFooter({ className, ...props }: any) {
	return (
		<div
			data-slot="alert-dialog-footer"
			{...props}
			class={cn(styles.footer, className ?? props.class)}
		/>
	);
}

function AlertDialogMedia({ className, ...props }: any) {
	return (
		<div
			data-slot="alert-dialog-media"
			{...props}
			class={cn(styles.media, className ?? props.class)}
		/>
	);
}

function AlertDialogTitle({ className, ...props }: any) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			{...props}
			class={cn(styles.title, className ?? props.class)}
		/>
	);
}

function AlertDialogDescription({ className, ...props }: any) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			{...props}
			class={cn(styles.description, className ?? props.class)}
		/>
	);
}

function AlertDialogAction({ className, ...props }: any) {
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
}: any) {
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
