"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";

function Sheet(props: SheetPrimitive.Root.Props) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: SheetPrimitive.Close.Props) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetContent({ children, ...props }: SheetPrimitive.Popup.Props) {
	return (
		<SheetPrimitive.Portal data-slot="sheet-portal">
			<SheetPrimitive.Backdrop data-slot="sheet-overlay" />
			<SheetPrimitive.Popup data-slot="sheet-content" {...props}>
				{children}
			</SheetPrimitive.Popup>
		</SheetPrimitive.Portal>
	);
}

function SheetHeader(props: React.ComponentProps<"div">) {
	return <div data-slot="sheet-header" {...props} />;
}

function SheetFooter(props: React.ComponentProps<"div">) {
	return <div data-slot="sheet-footer" {...props} />;
}

function SheetTitle(props: SheetPrimitive.Title.Props) {
	return <SheetPrimitive.Title data-slot="sheet-title" {...props} />;
}

function SheetDescription(props: SheetPrimitive.Description.Props) {
	return (
		<SheetPrimitive.Description data-slot="sheet-description" {...props} />
	);
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
};
