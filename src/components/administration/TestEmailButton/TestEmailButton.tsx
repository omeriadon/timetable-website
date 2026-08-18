"use client";

import { useState } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

export default function TestEmailButton() {
	const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
		<button type="button" className={styles.adminAction} onClick={send} disabled={state === "sending"}>
			<SymbolIcon name="envelope.badge" />
			<span>{state === "sending" ? "Sending…" : state === "sent" ? "Test email sent" : state === "error" ? "Unable to send test email" : "Send test email"}</span>
		</button>
	);
}
