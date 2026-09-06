import { createContext, createSignal, useContext, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import CorvuDrawer from "@corvu/drawer";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { XIcon } from "lucide-solid";
import styles from "./drawer.module.css";

type DrawerContextValue = {
	hasSnapPoints: boolean;
	modal: boolean;
	showSwipeHandle: boolean;
	swipeDirection: "down" | "up" | "left" | "right";
};
const Context = createContext<DrawerContextValue>();
const FooterContext = createContext<() => HTMLDivElement | undefined>();

export function Drawer(
	props: JSX.HTMLAttributes<HTMLDivElement> & {
		children?: JSX.Element;
		key?: unknown;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		modal?: boolean;
		showSwipeHandle?: boolean;
		snapPoints?: (number | string)[];
		swipeDirection?: "down" | "up" | "left" | "right";
	},
) {
	const direction = props.swipeDirection ?? "right";
	const side =
		direction === "up" ? "top" : direction === "down" ? "bottom" : direction;
	const hasSnapPoints = !!props.snapPoints?.length;
	return (
		<Context.Provider
			value={{
				hasSnapPoints,
				modal: props.modal ?? true,
				showSwipeHandle: props.showSwipeHandle ?? false,
				swipeDirection: direction,
			}}
		>
			<CorvuDrawer
				open={props.open}
				onOpenChange={props.onOpenChange}
				side={side as any}
				snapPoints={props.snapPoints as any}
			>
				{props.children}
			</CorvuDrawer>
		</Context.Provider>
	);
}

export const DrawerTrigger: any = CorvuDrawer.Trigger;
export const DrawerPortal = CorvuDrawer.Portal;
export const DrawerOverlay = CorvuDrawer.Overlay;

export function DrawerClose(
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
		children?: JSX.Element;
		className?: string;
		variant?:
			"default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
		flexible?: boolean;
	},
) {
	return (
		<CorvuDrawer.Close
			as="button"
			class={cn(
				styles.closeButton,
				props.flexible && styles.flexible,
				props.class ?? props.className,
			)}
			{...props}
		/>
	);
}

export function DrawerSwipeHandle(props: JSX.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			{...props}
			data-slot="drawer-swipe-handle"
			aria-hidden="true"
			class={cn(styles.swipeHandle, props.class)}
		/>
	);
}

export function DrawerContent(props: JSX.HTMLAttributes<HTMLDivElement>) {
	const context = useContext(Context);
	const [footerHost, setFooterHost] = createSignal<HTMLDivElement>();
	const axis =
		context?.swipeDirection === "down" || context?.swipeDirection === "up"
			? "y"
			: "x";
	return (
		<Portal>
			{context?.modal ? (
				<CorvuDrawer.Overlay
					data-slot="drawer-overlay"
					data-snap-points={context.hasSnapPoints ? "" : undefined}
					class={styles.overlay}
				/>
			) : null}
			<div
				data-slot="drawer-viewport"
				data-modal={context?.modal}
				class={styles.viewport}
			>
				<CorvuDrawer.Content
					data-slot="drawer-popup"
					data-swipe-axis={axis}
					data-snap-points={context?.hasSnapPoints ? "" : undefined}
					class={cn(styles.popup, props.class)}
				>
					{context?.showSwipeHandle ? <DrawerSwipeHandle /> : null}
					<div data-slot="drawer-content" class={styles.content}>
						<FooterContext.Provider value={footerHost}>
							{props.children}
						</FooterContext.Provider>
						<div
							ref={setFooterHost}
							data-slot="drawer-footer-host"
							class={styles.footerHost}
						/>
					</div>
				</CorvuDrawer.Content>
			</div>
		</Portal>
	);
}

export function DrawerHeader(
	props: JSX.HTMLAttributes<HTMLDivElement> & {
		showCloseButton?: boolean;
		className?: string;
	},
) {
	return (
		<div
			{...props}
			data-slot="drawer-header"
			class={cn(styles.header, props.class ?? props.className)}
		>
			<div class={styles.headerContent}>{props.children}</div>
			{props.showCloseButton !== false ? (
				<DrawerClose aria-label="Close drawer">
					<XIcon />
				</DrawerClose>
			) : null}
		</div>
	);
}

export function DrawerFooter(
	props: JSX.HTMLAttributes<HTMLDivElement> & { className?: string },
) {
	const host = useContext(FooterContext);
	const footer = (
		<div
			{...props}
			data-slot="drawer-footer"
			class={cn(styles.footer, props.class ?? props.className)}
		>
			{props.children}
		</div>
	);
	return host?.() ? <Portal mount={host()!}>{footer}</Portal> : footer;
}

export const DrawerTitle = (
	props: JSX.HTMLAttributes<HTMLHeadingElement> & { className?: string },
) => (
	<CorvuDrawer.Label
		{...props}
		data-slot="drawer-title"
		class={cn(styles.title, props.class ?? props.className)}
	/>
);
export const DrawerDescription = (
	props: JSX.HTMLAttributes<HTMLParagraphElement> & { className?: string },
) => (
	<CorvuDrawer.Description
		{...props}
		data-slot="drawer-description"
		class={cn(styles.description, props.class ?? props.className)}
	/>
);
