"use client";

import { Field } from "@base-ui/react/field";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	function Textarea({ className: _className, ...props }, ref) {
		return (
			<Field.Control
				ref={ref}
				render={<textarea />}
				{...(props as Field.Control.Props)}
			/>
		);
	},
);

Textarea.displayName = "Textarea";
