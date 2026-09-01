import { useState } from "react";

import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/client";
import { DrawerFooter } from "@/components/ui/drawer";

export default function TestEmailButton() {
	const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
		"idle",
	);

	const send = async () => {
		setState("sending");

		try {
			await apiRequest("v1/administration/test-email", {
				method: "POST",
			});
			setState("sent");
		} catch {
			setState("error");
		}
	};

	const label = {
		idle: "Send test email",
		sending: "Sending…",
		sent: "Test email sent",
		error: "Unable to send test email",
	}[state];

	return (
		<DrawerFooter>
			<Button
				fullWidth
				type="button"
				onClick={() => void send()}
				disabled={state === "sending"}
			>
				<Symbol name="envelope.badge" />
				{label}
			</Button>
		</DrawerFooter>
	);
}
