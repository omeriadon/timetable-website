import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import type { AboutContributor } from "@/lib/api/contracts";
import styles from "./AdminAboutContributorsEditor.module.css";
import { List, ListRow } from "@/components/ui/list";
import { DrawerFooter } from "@/components/ui/drawer";

type Draft = {
	name: string;
	role: string;
};

const emptyDraft: Draft = { name: "", role: "" };

export default function AdminAboutContributorsEditor() {
	const [contributors, setContributors] = useState<AboutContributor[]>([]);
	const [draft, setDraft] = useState<Draft>(emptyDraft);
	const [editingID, setEditingID] = useState<string | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		apiRequest<AboutContributor[]>("v1/administration/about-contributors")
			.then(setContributors)
			.catch((error: Error) => setStatus(error.message));
	}, []);

	const reset = () => {
		setDraft(emptyDraft);
		setEditingID(null);
	};

	const save = async () => {
		if (!draft.name.trim() || !draft.role.trim() || saving) {
			return;
		}
		setSaving(true);
		setStatus(null);
		try {
			const endpoint = editingID
				? `v1/administration/about-contributors/${editingID}`
				: "v1/administration/about-contributors";
			const saved = await apiRequest<AboutContributor[]>(endpoint, {
				method: editingID ? "PUT" : "POST",
				body: JSON.stringify(draft),
			});
			setContributors(saved);
			setStatus(editingID ? "Contributor updated." : "Contributor added.");
			reset();
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async (id: string) => {
		if (saving) {
			return;
		}
		setSaving(true);
		setStatus(null);
		try {
			setContributors(
				await apiRequest<AboutContributor[]>(
					`v1/administration/about-contributors/${id}`,
					{ method: "DELETE" },
				),
			);
			setStatus("Contributor removed.");
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const move = async (index: number, direction: -1 | 1) => {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= contributors.length || saving) {
			return;
		}
		const previous = contributors;
		const next = [...contributors];
		[next[index], next[nextIndex]] = [next[nextIndex], next[index]];
		setContributors(next);
		setSaving(true);
		try {
			setContributors(
				await apiRequest<AboutContributor[]>(
					"v1/administration/about-contributors/order",
					{
						method: "PUT",
						body: JSON.stringify({ contributorIDs: next.map(({ id }) => id) }),
					},
				),
			);
		} catch (error) {
			setContributors(previous);
			setStatus((error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className={styles.page}>
			<section aria-labelledby="contributors-heading">
				<div className={styles.heading}>
					<div>
						<p className={styles.eyebrow}>About Timetable</p>
						<h2 id="contributors-heading">Contributors</h2>
					</div>
					<Symbol name="person.3" />
				</div>
				<List>
					{contributors.map((contributor, index) => (
						<ListRow className={styles.contributor} key={contributor.id}>
							<div className={styles.contributorCopy}>
								<strong>{contributor.name}</strong>
								<span>{contributor.role}</span>
							</div>
							<div className={styles.actions}>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Move ${contributor.name} up`}
									disabled={index === 0 || saving}
									onClick={() => void move(index, -1)}
								>
									<Symbol name="chevron.up" />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Move ${contributor.name} down`}
									disabled={index === contributors.length - 1 || saving}
									onClick={() => void move(index, 1)}
								>
									<Symbol name="chevron.down" />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Edit ${contributor.name}`}
									onClick={() => {
										setEditingID(contributor.id);
										setDraft({
											name: contributor.name,
											role: contributor.role,
										});
									}}
								>
									<Symbol name="pencil" />
								</Button>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									aria-label={`Remove ${contributor.name}`}
									disabled={saving}
									onClick={() => void remove(contributor.id)}
								>
									<Symbol name="trash" />
								</Button>
							</div>
						</ListRow>
					))}
				</List>
			</section>
			<section
				className={styles.card}
				aria-labelledby="contributor-editor-heading"
			>
				<h2 id="contributor-editor-heading">
					{editingID ? "Edit contributor" : "Add contributor"}
				</h2>
				<label className={styles.field}>
					<span>Name</span>
					<Input
						value={draft.name}
						onChange={(event) =>
							setDraft({ ...draft, name: event.target.value })
						}
						placeholder="Contributor name"
					/>
				</label>
				<label className={styles.field}>
					<span>Role</span>
					<Input
						value={draft.role}
						onChange={(event) =>
							setDraft({ ...draft, role: event.target.value })
						}
						placeholder="Contribution or role"
					/>
				</label>
			</section>
			{status ? (
				<p className={styles.status} role="status">
					{status}
				</p>
			) : null}
			<DrawerFooter className={styles.formActions}>
				{editingID ? (
					<Button type="button" variant="ghost" onClick={reset}>
						<Symbol name="xmark" />
						Cancel
					</Button>
				) : null}
				<Button type="button" onClick={() => void save()} disabled={saving}>
					<Symbol name={editingID ? "checkmark" : "plus"} />
					{saving
						? "Saving…"
						: editingID
							? "Save contributor"
							: "Add contributor"}
				</Button>
			</DrawerFooter>
		</main>
	);
}
