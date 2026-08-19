"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/ui/ContentActions.module.css";

export default function TestEmailButton() {
	const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
		"idle",
	);

	const send = async () => {
		setState("sending");
		try {
			await apiRequest("v1/administration/test-email", { method: "POST" });
			setState("sent");
		} catch {
			setState("error");
		}
	};

	return (
		<Button
			unstyled
			type="button"
			className={styles.action}
			onClick={send}
			disabled={state === "sending"}
		>
			<Symbol name="envelope.badge" />
			<span>
				{state === "sending"
					? "Sending…"
					: state === "sent"
						? "Test email sent"
						: state === "error"
							? "Unable to send test email"
							: "Send test email"}
			</span>
		</Button>
	);
}
