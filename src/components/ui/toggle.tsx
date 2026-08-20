"use client";

import * as React from "react";
import { Switch as TogglePrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";
import styles from "./toggle.module.css";

function readPx(el: HTMLElement, prop: string, fallback: number) {
	const value = getComputedStyle(el).getPropertyValue(prop);
	const parsed = parseFloat(value);

	return Number.isFinite(parsed) ? parsed : fallback;
}

function Toggle({
	className,
	size = "default",
	checked,
	defaultChecked,
	onCheckedChange,
	...props
}: TogglePrimitive.Root.Props & {
	size?: "sm" | "default";
}) {
	const rootRef = React.useRef<HTMLButtonElement>(null);
	const thumbRef = React.useRef<HTMLSpanElement>(null);

	const [internalChecked, setInternalChecked] = React.useState(
		defaultChecked ?? false,
	);

	const isControlled = checked !== undefined;
	const isChecked = isControlled ? checked : internalChecked;

	const checkedRef = React.useRef(isChecked);

	React.useEffect(() => {
		checkedRef.current = isChecked;
	}, [isChecked]);

	const dragState = React.useRef({
		active: false,
		hasDragged: false,
		startX: 0,
		startChecked: false,
		maxOffset: 0,
		threshold: 4,
	});

	/*
	 * When a drag finishes, the browser still emits a click.
	 * Base UI would interpret that click as another toggle.
	 */
	const suppressNextChange = React.useRef(false);

	const commitChecked = React.useCallback(
		(next: boolean) => {
			checkedRef.current = next;

			if (!isControlled) {
				setInternalChecked(next);
			}

			onCheckedChange?.(next, undefined as never);
		},
		[isControlled, onCheckedChange],
	);

	const applyDragOffset = (offset: number) => {
		const thumb = thumbRef.current;
		if (!thumb) return;

		thumb.style.transition = "none";
		thumb.style.transform = `translateX(${offset}px) scale(1.8)`;
	};

	const clearDragStyles = () => {
		const thumb = thumbRef.current;
		if (!thumb) return;

		thumb.style.transition = "";
		thumb.style.transform = "";
	};

	const snapTo = (next: boolean) => {
		const thumb = thumbRef.current;

		if (!thumb) {
			commitChecked(next);
			return;
		}

		const target = next ? dragState.current.maxOffset : 0;

		/*
		 * Keep the current drag position, restore the transition,
		 * then move to the appropriate endpoint.
		 */
		thumb.style.transition = "";

		void thumb.offsetWidth;

		thumb.style.transform = `translateX(${target}px) scale(1)`;

		commitChecked(next);

		const cleanup = (event: TransitionEvent) => {
			if (event.propertyName !== "transform") return;

			thumb.style.transition = "";
			thumb.style.transform = "";

			thumb.removeEventListener("transitionend", cleanup);
		};

		thumb.addEventListener("transitionend", cleanup);
	};

	React.useEffect(() => {
		const root = rootRef.current;
		const thumb = thumbRef.current;

		if (!root || !thumb) return;

		const pointerDown = (event: PointerEvent) => {
			if (props.disabled) return;

			const rootRect = root.getBoundingClientRect();
			const thumbRect = thumb.getBoundingClientRect();

			const borderWidth = readPx(root, "--border-width", 2);
			const threshold = readPx(root, "--drag-threshold", 4);

			const maxOffset = rootRect.width - thumbRect.width - borderWidth * 2;

			dragState.current = {
				active: true,
				hasDragged: false,
				startX: event.clientX,
				startChecked: checkedRef.current,
				maxOffset,
				threshold,
			};

			root.setPointerCapture(event.pointerId);
		};

		const pointerMove = (event: PointerEvent) => {
			const state = dragState.current;

			if (!state.active) return;

			const delta = event.clientX - state.startX;

			if (!state.hasDragged) {
				if (Math.abs(delta) < state.threshold) return;

				state.hasDragged = true;
			}

			const startOffset = state.startChecked ? state.maxOffset : 0;

			const draggedOffset = Math.max(
				0,
				Math.min(state.maxOffset, startOffset + delta),
			);

			const snappedOffset =
				draggedOffset >= state.maxOffset / 2 ? state.maxOffset : 0;

			thumb.style.transition = "";
			thumb.style.transform = `translateX(${snappedOffset}px) scale(1.8)`;
		};

		const pointerUp = (event: PointerEvent) => {
			const state = dragState.current;

			if (!state.active) return;

			state.active = false;

			if (root.hasPointerCapture(event.pointerId)) {
				root.releasePointerCapture(event.pointerId);
			}

			// Normal click — Base UI handles the toggle.
			if (!state.hasDragged) {
				clearDragStyles();
				return;
			}

			const delta = event.clientX - state.startX;

			const startOffset = state.startChecked ? state.maxOffset : 0;

			const finalOffset = Math.max(
				0,
				Math.min(state.maxOffset, startOffset + delta),
			);

			const next = finalOffset >= state.maxOffset / 2;

			suppressNextChange.current = true;
			snapTo(next);
		};

		const pointerCancel = (event: PointerEvent) => {
			dragState.current.active = false;
			dragState.current.hasDragged = false;

			if (root.hasPointerCapture(event.pointerId)) {
				root.releasePointerCapture(event.pointerId);
			}

			clearDragStyles();
		};

		root.addEventListener("pointerdown", pointerDown);
		root.addEventListener("pointermove", pointerMove);
		root.addEventListener("pointerup", pointerUp);
		root.addEventListener("pointercancel", pointerCancel);

		return () => {
			root.removeEventListener("pointerdown", pointerDown);
			root.removeEventListener("pointermove", pointerMove);
			root.removeEventListener("pointerup", pointerUp);
			root.removeEventListener("pointercancel", pointerCancel);
		};
	}, [props.disabled]);

	const handleCheckedChange = (
		next: boolean,
		event: Parameters<
			NonNullable<TogglePrimitive.Root.Props["onCheckedChange"]>
		>[1],
	) => {
		if (suppressNextChange.current) {
			suppressNextChange.current = false;
			return;
		}

		commitChecked(next);
	};

	return (
		<TogglePrimitive.Root
			{...props}
			ref={rootRef}
			nativeButton
			render={<button type="button" />}
			data-slot="Toggle"
			data-size={size}
			checked={isChecked}
			onCheckedChange={handleCheckedChange}
			className={cn(
				"peer group/Toggle relative inline-flex shrink-0 items-center rounded-full border-2 transition-all outline-none group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-5 data-[size=default]:w-11 data-[size=sm]:h-4 data-[size=sm]:w-7 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary group-has-focus-visible/field-label:data-checked:border-primary data-unchecked:border-transparent data-unchecked:bg-input/90 group-has-focus-visible/field-label:data-unchecked:border-transparent data-disabled:cursor-not-allowed data-disabled:opacity-50",
				styles.root,
				className,
			)}
		>
			<TogglePrimitive.Thumb
				ref={thumbRef}
				data-slot="Toggle-thumb"
				className={cn(
					"pointer-events-none block rounded-full bg-background shadow-sm ring-0 not-dark:bg-clip-padding group-data-[size=default]/Toggle:h-4 group-data-[size=default]/Toggle:w-6 group-data-[size=sm]/Toggle:h-3 group-data-[size=sm]/Toggle:w-4 dark:data-unchecked:bg-foreground",
					styles.thumb,
				)}
			/>
		</TogglePrimitive.Root>
	);
}

export { Toggle };
