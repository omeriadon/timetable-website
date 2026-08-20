"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import styles from "./Switch.module.css";

type SwitchPointerEvent = Parameters<
	NonNullable<SwitchPrimitive.Root.Props["onPointerDown"]>
>[0];
type SwitchClickEvent = Parameters<
	NonNullable<SwitchPrimitive.Root.Props["onClickCapture"]>
>[0];

function Switch({
	className,
	size = "default",
	onClickCapture,
	onPointerCancel,
	onPointerDown,
	onPointerMove,
	onPointerUp,
	...props
}: SwitchPrimitive.Root.Props & {
	size?: "sm" | "default";
}) {
	const drag = useRef<{
		lastTime: number;
		lastX: number;
		moved: boolean;
		pointerID: number;
		progress: number;
		startChecked: boolean;
		startX: number;
		travel: number;
		velocity: number;
	} | null>(null);
	const suppressClick = useRef(false);

	const handlePointerDown = (event: SwitchPointerEvent) => {
		onPointerDown?.(event);
		if (event.defaultPrevented || event.button !== 0) {
			return;
		}

		const root = event.currentTarget as HTMLElement;
		const thumb = root.querySelector<HTMLElement>('[data-slot="switch-thumb"]');
		if (!thumb) {
			return;
		}

		const rootBounds = root.getBoundingClientRect();
		const thumbBounds = thumb.getBoundingClientRect();
		drag.current = {
			lastTime: event.timeStamp,
			lastX: event.clientX,
			moved: false,
			pointerID: event.pointerId,
			progress: root.getAttribute("aria-checked") === "true" ? 1 : 0,
			startChecked: root.getAttribute("aria-checked") === "true",
			startX: event.clientX,
			travel: Math.max(rootBounds.width - thumbBounds.width, 1),
			velocity: 0,
		};
		root.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: SwitchPointerEvent) => {
		onPointerMove?.(event);
		const current = drag.current;
		if (!current || current.pointerID !== event.pointerId) {
			return;
		}

		const distance = event.clientX - current.startX;
		if (!current.moved && Math.abs(distance) < 4) {
			return;
		}

		current.moved = true;
		const progress = Math.min(
			1,
			Math.max(0, (current.startChecked ? 1 : 0) + distance / current.travel),
		);
		const elapsed = Math.max(event.timeStamp - current.lastTime, 1);
		current.velocity = (event.clientX - current.lastX) / elapsed;
		current.lastTime = event.timeStamp;
		current.lastX = event.clientX;
		current.progress = progress;

		const root = event.currentTarget as HTMLElement;
		root.dataset.dragging = "";
		root.style.setProperty(
			"--switch-thumb-x",
			`${progress * current.travel}px`,
		);
	};

	const finishDrag = (event: SwitchPointerEvent) => {
		onPointerUp?.(event);
		const current = drag.current;
		if (!current || current.pointerID !== event.pointerId) {
			return;
		}

		const root = event.currentTarget as HTMLElement;
		if (current.moved) {
			const projectedProgress = current.progress + current.velocity * 0.12;
			const nextChecked = projectedProgress >= 0.5;
			suppressClick.current = nextChecked === current.startChecked;
			root.style.setProperty(
				"--switch-thumb-x",
				`${(nextChecked ? 1 : 0) * current.travel}px`,
			);
			requestAnimationFrame(() => {
				delete root.dataset.dragging;
				root.style.removeProperty("--switch-thumb-x");
			});
		}

		if (root.hasPointerCapture(event.pointerId)) {
			root.releasePointerCapture(event.pointerId);
		}
		drag.current = null;
	};

	const handlePointerCancel = (event: SwitchPointerEvent) => {
		onPointerCancel?.(event);
		if (drag.current?.pointerID !== event.pointerId) {
			return;
		}

		const root = event.currentTarget as HTMLElement;
		delete root.dataset.dragging;
		root.style.removeProperty("--switch-thumb-x");
		drag.current = null;
	};

	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			data-size={size}
			className={cn(
				"peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 transition-all outline-none group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-5 data-[size=default]:w-11 data-[size=sm]:h-4 data-[size=sm]:w-7 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary group-has-[:focus-visible]/field-label:data-checked:border-primary data-unchecked:border-transparent data-unchecked:bg-input/90 group-has-[:focus-visible]/field-label:data-unchecked:border-transparent data-disabled:cursor-not-allowed data-disabled:opacity-50",
				styles.root,
				className,
			)}
			onClickCapture={(event: SwitchClickEvent) => {
				if (suppressClick.current) {
					event.preventDefault();
					event.stopPropagation();
					suppressClick.current = false;
				}
				onClickCapture?.(event);
			}}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={finishDrag}
			onPointerCancel={handlePointerCancel}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block rounded-full bg-background shadow-sm ring-0 not-dark:bg-clip-padding group-data-[size=default]/switch:h-4 group-data-[size=default]/switch:w-6 group-data-[size=sm]/switch:h-3 group-data-[size=sm]/switch:w-4 dark:data-unchecked:bg-foreground",
					styles.thumb,
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
