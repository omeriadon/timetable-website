"use client";

import { Field } from "@base-ui/react/field";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea({ className, ...props }, ref) {
		return (
			<Field.Control
				ref={ref}
				className={cn(styles.textarea, className)}
				render={<textarea />}
				{...(props as Field.Control.Props)}
			/>
		);
	},
);

Textarea.displayName = "Textarea";
