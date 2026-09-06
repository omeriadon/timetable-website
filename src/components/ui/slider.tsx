import { Slider as SliderPrimitive } from "@kobalte/core/slider";
import { cn } from "@/lib/utils";
import styles from "./slider.module.css";

type SliderProps = any & {
	ariaLabel: string;
};

function Slider({ ariaLabel, className, ...props }: SliderProps) {
	return (
		<SliderPrimitive {...props} class={cn(styles.root, className)} aria-label={ariaLabel}>
			<SliderPrimitive.Track class={styles.track}>
				<SliderPrimitive.Fill class={styles.indicator} />
				<SliderPrimitive.Thumb class={styles.thumb} />
			</SliderPrimitive.Track>
		</SliderPrimitive>
	);
}

export { Slider };
