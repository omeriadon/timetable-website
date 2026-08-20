"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";

export type NativeSelectProps = ComponentPropsWithoutRef<"select">;

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
	function NativeSelect(props, ref) {
		return <select ref={ref} {...props} />;
	},
);

NativeSelect.displayName = "NativeSelect";
