"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export type InputProps = ComponentPropsWithoutRef<typeof BaseInput>;

export const Input = forwardRef<ElementRef<typeof BaseInput>, InputProps>(
	function Input({ className, ...props }, ref) {
		return (
			<BaseInput ref={ref} className={cn(styles.input, className)} {...props} />
		);
	},
);

Input.displayName = "Input";
