import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { List, ListRow } from "@/components/ui/list";
import { DrawerFooter } from "@/components/ui/drawer";
import { createSignal } from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "./FeedbackEditor.module.css";

export default function FeedbackEditor() {
	const [category, setCategory] = createSignal("Feedback");
	const [message, setMessage] = createSignal("");
	const [status, setStatus] = createSignal<string | null>(null);
	const [sending, setSending] = createSignal(false);

	const submit = async () => {
		if (!message().trim() || sending()) return;
		setSending(true);
		setStatus(null);
		try {
			await apiRequest("v1/report/feedback", {
				method: "POST",
				body: JSON.stringify({ category: category(), message: message().trim() }),
			});
			setMessage("");
			setStatus("Feedback sent.");
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			<List>
				<ListRow class={styles.categoryRow}>
					<Symbol name="exclamationmark.bubble" />
					<label for="feedback-category">Type</label>
					<Select
						value={category}
						onValueChange={(value) => {
							if (value !== null) {
								setCategory(value);
							}
						}}
					>
						<SelectTrigger id="feedback-category">
							<SelectValue>{category()}</SelectValue>
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="Feedback">Feedback</SelectItem>
							<SelectItem value="Bug Report">Bug Report</SelectItem>
						</SelectContent>
					</Select>
				</ListRow>
				<div class={styles.messageField}>
					<label for="feedback-message">
						Describe the {category().toLowerCase()}
					</label>
					<Textarea
						id="feedback-message"
						value={message()}
						maxLength={4000}
						rows={8}
						onChange={(event) => setMessage(event.target.value)}
					/>
				</div>
				{status() ? (
					<p class={styles.status} role="status">
						{status()}
					</p>
				) : null}
			</List>
			<DrawerFooter>
				<Button
					type="button"
					fullWidth
					aria-label="Send feedback"
					onClick={() => void submit()}
					disabled={sending() || !message().trim()}
				>
					<Symbol name="checkmark" fallback="✓" />
					{sending() ? "Sending…" : "Send Feedback"}
				</Button>
			</DrawerFooter>
		</>
	);
}
