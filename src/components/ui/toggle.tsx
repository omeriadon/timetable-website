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

			const next = draggedOffset >= state.maxOffset / 2;
			const snappedOffset = next ? state.maxOffset : 0;

			root.dataset.dragChecked = next ? "true" : "false";

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

			if (!state.hasDragged) {
				delete root.dataset.dragChecked;
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

			delete root.dataset.dragChecked;

			suppressNextChange.current = true;
			snapTo(next);
		};

		const pointerCancel = (event: PointerEvent) => {
			dragState.current.active = false;
			dragState.current.hasDragged = false;

			delete root.dataset.dragChecked;

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
			data-slot="toggle"
			data-size={size}
			checked={isChecked}
			onCheckedChange={handleCheckedChange}
			className={cn(styles.root, className)}
		>
			<TogglePrimitive.Thumb
				ref={thumbRef}
				data-slot="toggle-thumb"
				className={styles.thumb}
			/>
		</TogglePrimitive.Root>
	);
}

export { Toggle };
