import { Switch as Primitive } from "@kobalte/core/switch";
import {
	createSignal,
	onCleanup,
	onMount,
	splitProps,
	type Accessor,
	type ComponentProps,
} from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./toggle.module.css";

type ToggleProps = Omit<
	ComponentProps<typeof Primitive>,
	"checked" | "onChange"
> & {
	onCheckedChange?: (checked: boolean) => void;
	size?: "sm" | "default";
	class?: string;
	className?: string;
	checked?: boolean | Accessor<boolean>;
};

export function Toggle(props: ToggleProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"className",
		"onCheckedChange",
		"size",
		"checked",
		"defaultChecked",
		"disabled",
	]);
	const [internalChecked, setInternalChecked] = createSignal(
		local.defaultChecked ?? false,
	);
	let root: HTMLElement | undefined;
	let thumb: HTMLSpanElement | undefined;
	let active = false;
	let dragged = false;
	let startX = 0;
	let startChecked = false;
	let maxOffset = 0;
	let suppressNextChange = false;

	const controlledChecked = () =>
		typeof local.checked === "function" ? local.checked() : local.checked;
	const isChecked = () => controlledChecked() ?? internalChecked();

	const commit = (next: boolean) => {
		if (controlledChecked() === undefined) {
			setInternalChecked(next);
		}
		local.onCheckedChange?.(next);
	};

	const clearDragStyles = () => {
		if (!thumb) return;
		thumb.style.transition = "";
		thumb.style.transform = "";
	};

	onMount(() => {
		if (!root || !thumb) return;

		const readPx = (name: string, fallback: number) => {
			const parsed = Number.parseFloat(
				getComputedStyle(root!).getPropertyValue(name),
			);
			return Number.isFinite(parsed) ? parsed : fallback;
		};

		const pointerDown = (event: PointerEvent) => {
			if (local.disabled) return;
			startChecked = isChecked();
			startX = event.clientX;
			active = true;
			dragged = false;
			const rootRect = root!.getBoundingClientRect();
			const thumbRect = thumb!.getBoundingClientRect();
			const border = readPx("--border-width", 2);
			maxOffset = Math.max(0, rootRect.width - thumbRect.width - border * 2);
			root!.setPointerCapture(event.pointerId);
		};

		const pointerMove = (event: PointerEvent) => {
			if (!active) return;
			const delta = event.clientX - startX;
			if (!dragged && Math.abs(delta) < readPx("--drag-threshold", 4)) return;
			dragged = true;
			const offset = Math.max(
				0,
				Math.min(maxOffset, (startChecked ? maxOffset : 0) + delta),
			);
			const next = offset >= maxOffset / 2;
			root!.dataset.dragChecked = String(next);
			thumb!.style.transition = "";
			thumb!.style.transform = `translateX(${next ? maxOffset : 0}px) scale(1.8)`;
		};

		const pointerUp = (event: PointerEvent) => {
			if (!active) return;
			active = false;
			if (root!.hasPointerCapture(event.pointerId)) {
				root!.releasePointerCapture(event.pointerId);
			}
			if (!dragged) {
				clearDragStyles();
				return;
			}
			const delta = event.clientX - startX;
			const offset = Math.max(
				0,
				Math.min(maxOffset, (startChecked ? maxOffset : 0) + delta),
			);
			const next = offset >= maxOffset / 2;
			delete root!.dataset.dragChecked;
			suppressNextChange = true;
			thumb!.style.transform = `translateX(${next ? maxOffset : 0}px) scale(1)`;
			commit(next);
			clearDragStyles();
		};

		const pointerCancel = (event: PointerEvent) => {
			active = false;
			dragged = false;
			delete root!.dataset.dragChecked;
			if (root!.hasPointerCapture(event.pointerId)) {
				root!.releasePointerCapture(event.pointerId);
			}
			clearDragStyles();
		};

		root.addEventListener("pointerdown", pointerDown);
		root.addEventListener("pointermove", pointerMove);
		root.addEventListener("pointerup", pointerUp);
		root.addEventListener("pointercancel", pointerCancel);
		onCleanup(() => {
			root?.removeEventListener("pointerdown", pointerDown);
			root?.removeEventListener("pointermove", pointerMove);
			root?.removeEventListener("pointerup", pointerUp);
			root?.removeEventListener("pointercancel", pointerCancel);
		});
	});

	return (
		<Primitive
			{...rest}
			data-slot="toggle"
			data-size={local.size ?? "default"}
			ref={(element) => {
				root = element;
			}}
			checked={isChecked()}
			onChange={(next) => {
				if (suppressNextChange) {
					suppressNextChange = false;
					return;
				}
				commit(next);
			}}
			class={cn(styles.root, local.class ?? local.className)}
		>
			<Primitive.Input />
			<Primitive.Control>
				<Primitive.Thumb
					data-slot="toggle-thumb"
					ref={(element) => {
						thumb = element;
					}}
					class={styles.thumb}
				/>
			</Primitive.Control>
		</Primitive>
	);
}
