"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";

type DrawerContextProps = {
	hasSnapPoints: boolean;
	modal: DrawerPrimitive.Root.Props["modal"];
	showSwipeHandle: boolean;
	swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>;
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);

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
	swipeDirection = "down",
	...props
}: DrawerPrimitive.Root.Props & {
	showSwipeHandle?: boolean;
}) {
	const hasSnapPoints = snapPoints != null && snapPoints.length > 0;
	const contextValue = React.useMemo(
		() => ({ hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
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

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
	className,
	...props
}: DrawerPrimitive.Backdrop.Props) {
	return (
		<DrawerPrimitive.Backdrop
			data-slot="drawer-overlay"
			className={cn("fixed inset-0 z-50", className)}
			{...props}
		/>
	);
}

function DrawerSwipeHandle({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div data-slot="drawer-swipe-handle" className={className} {...props} />
	);
}

function DrawerContent({
	className,
	children,
	...props
}: DrawerPrimitive.Popup.Props) {
	const { modal, showSwipeHandle, swipeDirection } = useDrawer();

	return (
		<DrawerPortal data-slot="drawer-portal">
			{modal === true && <DrawerOverlay />}
			<DrawerPrimitive.Viewport
				data-slot="drawer-viewport"
				data-modal={modal}
				className="pointer-events-none fixed inset-0 z-50 data-[modal=true]:pointer-events-auto"
			>
				<DrawerPrimitive.Popup
					data-slot="drawer-popup"
					data-swipe-direction={swipeDirection}
					className={cn(
						"pointer-events-auto fixed z-50 flex max-h-screen min-h-0 w-full flex-col overflow-auto",
						swipeDirection === "down" && "inset-x-0 bottom-0",
						swipeDirection === "up" && "inset-x-0 top-0",
						swipeDirection === "left" && "inset-y-0 left-0 w-auto",
						swipeDirection === "right" && "inset-y-0 right-0 w-auto",
						className,
					)}
					{...props}
				>
					{showSwipeHandle && <DrawerSwipeHandle />}
					<DrawerPrimitive.Content
						data-slot="drawer-content"
						className="flex min-h-0 flex-1 flex-col overflow-auto"
					>
						{children}
					</DrawerPrimitive.Content>
				</DrawerPrimitive.Popup>
			</DrawerPrimitive.Viewport>
		</DrawerPortal>
	);
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="drawer-header" className={className} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="drawer-footer" className={className} {...props} />;
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={className}
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
			className={className}
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
