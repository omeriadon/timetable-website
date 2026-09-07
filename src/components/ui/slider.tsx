import { Slider as SliderPrimitive } from "@kobalte/core/slider";
import { splitProps, type ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./slider.module.css";

type SliderProps = Omit<
	ComponentProps<typeof SliderPrimitive>,
	"value" | "defaultValue" | "onChange"
> & {
	ariaLabel: string;
	value?: number;
	defaultValue?: number;
	onValueChange?: (value: number) => void;
	className?: string;
};

function Slider(props: SliderProps) {
	const [local, rest] = splitProps(props, [
		"ariaLabel",
		"class",
		"className",
		"value",
		"defaultValue",
		"onValueChange",
	]);
	return (
		<SliderPrimitive
			{...rest}
			class={cn(styles.root, local.class ?? local.className)}
			value={local.value === undefined ? undefined : [local.value]}
			defaultValue={
				local.defaultValue === undefined ? undefined : [local.defaultValue]
			}
			onChange={(value) => local.onValueChange?.(value[0] ?? 0)}
			aria-label={local.ariaLabel}
		>
			<SliderPrimitive.Track class={styles.track}>
				<SliderPrimitive.Fill class={styles.indicator} />
				<SliderPrimitive.Thumb class={styles.thumb} />
			</SliderPrimitive.Track>
		</SliderPrimitive>
	);
}

export { Slider };
