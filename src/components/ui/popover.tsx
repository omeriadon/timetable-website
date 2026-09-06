import { Popover as Primitive } from "@kobalte/core/popover";
import { cn } from "@/lib/utils";
import styles from "./popover.module.css";

export function Popover(props: any) { return <Primitive {...props} />; }
export function PopoverTrigger(props: any) { return <Primitive.Trigger {...props} data-slot="popover-trigger" />; }
export function PopoverContent(props: any) {
	return <Primitive.Portal><Primitive.Content {...props} data-slot="popover-content" class={cn(styles.content, props.class ?? props.className)} /></Primitive.Portal>;
}
export function PopoverHeader(props: any) { return <div {...props} data-slot="popover-header" class={cn(styles.header, props.class ?? props.className)} />; }
export function PopoverTitle(props: any) { return <Primitive.Title {...props} data-slot="popover-title" class={cn(styles.title, props.class ?? props.className)} />; }
export function PopoverDescription(props: any) { return <Primitive.Description {...props} data-slot="popover-description" class={cn(styles.description, props.class ?? props.className)} />; }
