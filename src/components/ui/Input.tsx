"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";

export type InputProps = ComponentPropsWithoutRef<typeof BaseInput>;

export const Input = forwardRef<ElementRef<typeof BaseInput>, InputProps>(
	function Input({ className: _className, ...props }, ref) {
		return <BaseInput ref={ref} {...props} />;
	},
);

Input.displayName = "Input";
