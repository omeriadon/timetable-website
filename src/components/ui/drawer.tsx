"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

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
	swipeDirection = "right",
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

function DrawerOverlay({ ...props }: DrawerPrimitive.Backdrop.Props) {
	return <DrawerPrimitive.Backdrop data-slot="drawer-overlay" {...props} />;
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
			<DrawerPrimitive.Viewport data-slot="drawer-viewport" data-modal={modal}>
				<DrawerPrimitive.Popup
					data-slot="drawer-popup"
					data-swipe-direction={swipeDirection}
					className={className}
					{...props}
				>
					{showSwipeHandle && <DrawerSwipeHandle />}
					<DrawerPrimitive.Content data-slot="drawer-content">
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
