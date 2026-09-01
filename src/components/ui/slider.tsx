import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";
import styles from "./slider.module.css";

type SliderProps = Omit<SliderPrimitive.Root.Props<number>, "children"> & {
	ariaLabel: string;
};

function Slider({ ariaLabel, className, ...props }: SliderProps) {
	return (
		<SliderPrimitive.Root {...props} className={cn(styles.root, className)}>
			<SliderPrimitive.Control className={styles.control}>
				<SliderPrimitive.Track className={styles.track}>
					<SliderPrimitive.Indicator className={styles.indicator} />
					<SliderPrimitive.Thumb
						getAriaLabel={() => ariaLabel}
						className={styles.thumb}
					/>
				</SliderPrimitive.Track>
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
