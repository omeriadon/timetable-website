import { Show } from "solid-js";

export default function StaleIndicator(props: {
	active: boolean;
	label?: string;
}) {
	return (
		<Show when={props.active}>
			<p
				role="status"
				aria-live="polite"
				style={{
					"font-size": "0.8rem",
					opacity: "0.65",
					margin: "0.25rem 0 0.75rem",
				}}
			>
				{props.label ?? "Updating…"}
			</p>
		</Show>
	);
}
