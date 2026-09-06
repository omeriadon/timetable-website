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

function AlertDialogOverlay({
	className,
	...props
}: any) {
	return (
			<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			class={cn(styles.overlay, className)}
			{...props}
		/>
	);
}

function AlertDialogContent({
	className,
	size = "default",
	...props
}: any) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot="alert-dialog-content"
				data-size={size}
				class={cn(styles.content, className)}
				{...props}
			/>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({
	className,
	...props
}: any) {
	return (
		<div
			data-slot="alert-dialog-header"
			class={cn(styles.header, className)}
			{...props}
		/>
	);
}

function AlertDialogFooter({
	className,
	...props
}: any) {
	return (
		<div
			data-slot="alert-dialog-footer"
			class={cn(styles.footer, className)}
			{...props}
		/>
	);
}

function AlertDialogMedia({
	className,
	...props
}: any) {
	return (
		<div
			data-slot="alert-dialog-media"
			class={cn(styles.media, className)}
			{...props}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: any) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			class={cn(styles.title, className)}
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: any) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			class={cn(styles.description, className)}
			{...props}
		/>
	);
}

function AlertDialogAction({
	className,
	...props
}: any) {
	return (
		<Button data-slot="alert-dialog-action" class={className} {...props} />
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
			class={className}
			render={<Button variant={variant} size={size} />}
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
