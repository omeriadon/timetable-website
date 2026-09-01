import * as React from "react";
import { createPortal } from "react-dom";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

import { cn } from "@/lib/utils";

import styles from "./drawer.module.css";
import { Button } from "./button";
import { XIcon } from "lucide-react";

type DrawerContextProps = {
	hasSnapPoints: boolean;
	modal: DrawerPrimitive.Root.Props["modal"];
	showSwipeHandle: boolean;
	swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>;
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);
const DrawerFooterHostContext = React.createContext<
	HTMLDivElement | null | undefined
>(undefined);

function useDrawer() {
	const context = React.useContext(DrawerContext);

	if (!context) {
		throw new Error("useDrawer must be used within a Drawer.");
	}

	return context;
}

function Drawer({
	modal = true,
	showSwipeHandle = false,
	snapPoints,
	swipeDirection = "right",
	...props
}: DrawerPrimitive.Root.Props & {
	showSwipeHandle?: boolean;
}) {
	const hasSnapPoints = snapPoints != null && snapPoints.length > 0;

	const contextValue = React.useMemo(
		() => ({
			hasSnapPoints,
			modal,
			showSwipeHandle,
			swipeDirection,
		}),
		[hasSnapPoints, modal, showSwipeHandle, swipeDirection],
	);

	return (
		<DrawerContext.Provider value={contextValue}>
			<DrawerPrimitive.Root
				data-slot="drawer"
				modal={modal}
				snapPoints={snapPoints}
				swipeDirection={swipeDirection}
				{...props}
			/>
		</DrawerContext.Provider>
	);
}

function DrawerTrigger(props: DrawerPrimitive.Trigger.Props) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: DrawerPrimitive.Portal.Props) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
	children,
	variant = "outline",
	size = "default",
	flexible = false,
	...props
}: Omit<DrawerPrimitive.Close.Props, "render"> & {
	children: React.ReactNode;
	variant?: React.ComponentProps<typeof Button>["variant"];
	size?: React.ComponentProps<typeof Button>["size"];
	flexible?: React.ComponentProps<typeof Button>["flexible"];
}) {
	return (
		<DrawerPrimitive.Close
			render={
				<Button
					variant={variant}
					size={size}
					flexible={flexible}
					className={styles.closeButton}
				>
					{children}
				</Button>
			}
			{...props}
		/>
	);
}

function DrawerOverlay({
	className,
	...props
}: DrawerPrimitive.Backdrop.Props) {
	return (
		<DrawerPrimitive.Backdrop
			data-slot="drawer-overlay"
			className={cn(styles.overlay, className)}
			{...props}
		/>
	);
}

function DrawerSwipeHandle({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="drawer-swipe-handle"
			aria-hidden="true"
			className={cn(styles.swipeHandle, className)}
			{...props}
		/>
	);
}

function DrawerContent({
	className,
	children,
	...props
}: DrawerPrimitive.Popup.Props) {
	const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = useDrawer();
	const [footerHost, setFooterHost] = React.useState<HTMLDivElement | null>(
		null,
	);

	const swipeAxis =
		swipeDirection === "down" || swipeDirection === "up" ? "y" : "x";

	return (
		<DrawerPortal data-slot="drawer-portal">
			{modal === true && (
				<DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
			)}

			<DrawerPrimitive.Viewport
				data-slot="drawer-viewport"
				data-modal={modal}
				className={styles.viewport}
			>
				<DrawerPrimitive.Popup
					data-slot="drawer-popup"
					data-swipe-axis={swipeAxis}
					data-snap-points={hasSnapPoints ? "" : undefined}
					className={cn(styles.popup, className)}
					{...props}
				>
					{showSwipeHandle && <DrawerSwipeHandle />}

					<DrawerPrimitive.Content
						data-slot="drawer-content"
						className={styles.content}
					>
						<DrawerFooterHostContext.Provider value={footerHost}>
							{children}
						</DrawerFooterHostContext.Provider>
						<div
							ref={setFooterHost}
							data-slot="drawer-footer-host"
							className={styles.footerHost}
						/>
					</DrawerPrimitive.Content>
				</DrawerPrimitive.Popup>
			</DrawerPrimitive.Viewport>
		</DrawerPortal>
	);
}

function DrawerHeader({
	className,
	children,
	showCloseButton = true,
	...props
}: React.ComponentProps<"div"> & {
	showCloseButton?: boolean;
}) {
	const hasClose = React.Children.toArray(children).some(
		(child) => React.isValidElement(child) && child.type === DrawerClose,
	);

	return (
		<div
			data-slot="drawer-header"
			className={cn(styles.header, className)}
			{...props}
		>
			<div className={styles.headerContent}>{children}</div>

			{showCloseButton && !hasClose && (
				<DrawerClose size="icon" aria-label="Close drawer">
					<XIcon />
				</DrawerClose>
			)}
		</div>
	);
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
	const footerHost = React.useContext(DrawerFooterHostContext);
	const footer = (
		<div
			data-slot="drawer-footer"
			className={cn(styles.footer, className)}
			{...props}
		/>
	);

	if (footerHost === undefined) {
		return footer;
	}

	return footerHost ? createPortal(footer, footerHost) : null;
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={cn(styles.title, className)}
			{...props}
		/>
	);
}

function DrawerDescription({
	className,
	...props
}: DrawerPrimitive.Description.Props) {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-description"
			className={cn(styles.description, className)}
			{...props}
		/>
	);
}

export {
	Drawer,
	DrawerPortal,
	DrawerOverlay,
	DrawerSwipeHandle,
	DrawerTrigger,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
};
