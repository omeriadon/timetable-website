"use client";

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
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "./FeedbackEditor.module.css";

export default function FeedbackEditor() {
	const [category, setCategory] = useState("Feedback");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [sending, setSending] = useState(false);

	const submit = async () => {
		if (!message.trim() || sending) return;
		setSending(true);
		setStatus(null);
		try {
			await apiRequest("v1/report/feedback", {
				method: "POST",
				body: JSON.stringify({ category, message: message.trim() }),
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
		<List>
			<ListRow className={styles.categoryRow}>
				<Symbol name="exclamationmark.bubble" />
				<label htmlFor="feedback-category">Type</label>
				<Select
					value={category}
					onValueChange={(value) => {
						if (value !== null) {
							setCategory(value);
						}
					}}
				>
					<SelectTrigger id="feedback-category">
						<SelectValue>{category}</SelectValue>
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="Feedback">Feedback</SelectItem>
						<SelectItem value="Bug Report">Bug Report</SelectItem>
					</SelectContent>
				</Select>
			</ListRow>
			<div className={styles.messageField}>
				<label htmlFor="feedback-message">
					Describe the {category.toLowerCase()}
				</label>
				<Textarea
					id="feedback-message"
					value={message}
					maxLength={4000}
					rows={8}
					onChange={(event) => setMessage(event.target.value)}
				/>
			</div>
			<div className={styles.actions}>
				<Button
					type="button"
					aria-label="Send feedback"
					onClick={() => void submit()}
					disabled={sending || !message.trim()}
				>
					<Symbol name="checkmark" fallback="✓" />
					{sending ? "Sending…" : "Send Feedback"}
				</Button>
			</div>
			{status ? (
				<p className={styles.status} role="status">
					{status}
				</p>
			) : null}
		</List>
	);
}
