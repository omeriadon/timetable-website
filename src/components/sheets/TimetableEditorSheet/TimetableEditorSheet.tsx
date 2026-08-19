"use client";

import { useState } from "react";
import type {
	OwnerTimetable,
	TimetableSlot,
	TimetableSubject,
} from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
} from "@/features/timetable/layout";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";

const editableSessions = TIMETABLE_SESSIONS.filter(
	(session) => session.value !== 2 && session.value !== 5,
);

export default function TimetableEditorSheet({
	timetable,
	onSaved,
}: {
	timetable: OwnerTimetable;
	onSaved: (timetable: OwnerTimetable) => void;
}) {
	const { closeSheet } = useSheet();
	const [subjects, setSubjects] = useState<TimetableSubject[]>(
		timetable.subjects,
	);
	const [isSearchable, setIsSearchable] = useState(timetable.isSearchable);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateSubject = (id: string, changes: Partial<TimetableSubject>) =>
		setSubjects((current) =>
			current.map((subject) =>
				subject.id === id ? { ...subject, ...changes } : subject,
			),
		);
	const addSubject = () =>
		setSubjects((current) => [
			...current,
			{
				id: `Subject ${current.length + 1}`,
				symbol: "Abc",
				colour: { r: 0.45, g: 0.2, b: 0.8, a: 1 },
				slots: [],
				classroom: { unknown: { rawLocation: "Not provided" } },
				teacher: { unknown: { rawNotes: "Teacher: Unknown" } },
			},
		]);
	const removeSubject = (id: string) =>
		setSubjects((current) => current.filter((subject) => subject.id !== id));
	const toggleSlot = (subjectID: string, slot: TimetableSlot) => {
		const key = `${slot.day}:${slot.session}`;
		setSubjects((current) =>
			current.map((subject) => {
				if (subject.id === subjectID) {
					const hasSlot = subject.slots.some(
						(candidate) =>
							candidate.day === slot.day && candidate.session === slot.session,
					);
					return {
						...subject,
						slots: hasSlot
							? subject.slots.filter(
									(candidate) =>
										!(
											candidate.day === slot.day &&
											candidate.session === slot.session
										),
								)
							: [...subject.slots, slot],
					};
				}
				return subject.slots.some(
					(candidate) => `${candidate.day}:${candidate.session}` === key,
				)
					? {
							...subject,
							slots: subject.slots.filter(
								(candidate) => `${candidate.day}:${candidate.session}` !== key,
							),
						}
					: subject;
			}),
		);
	};

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<OwnerTimetable>("v1/timetables/owner", {
				method: "PUT",
				body: JSON.stringify({
					subjects,
					expectedRevision: timetable.revision,
					isSearchable,
				}),
			});
			onSaved(updated);
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div>
					<h2>Edit Timetable</h2>
					<p>Subjects and weekly periods</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				{subjects.map((subject) => (
					<div key={subject.id} className={styles.editorSubject}>
						<div className={styles.editorFields}>
							<input
								value={subject.id}
								aria-label="Subject name"
								onChange={(event) =>
									updateSubject(subject.id, { id: event.target.value })
								}
							/>
							<input
								value={subject.symbol}
								aria-label="Subject symbol"
								onChange={(event) =>
									updateSubject(subject.id, { symbol: event.target.value })
								}
							/>
							<button
								type="button"
								onClick={() => removeSubject(subject.id)}
								aria-label={`Remove ${subject.id}`}
							>
								×
							</button>
						</div>
						<div className={styles.editorMetadata}>
							<label>
								Teacher
								<input
									value={teacherValue(subject.teacher)}
									onChange={(event) =>
										updateSubject(subject.id, {
											teacher: { unknown: { rawNotes: event.target.value } },
										})
									}
								/>
							</label>
							<label>
								Classroom
								<input
									value={classroomValue(subject.classroom)}
									onChange={(event) =>
										updateSubject(subject.id, {
											classroom: {
												unknown: { rawLocation: event.target.value },
											},
										})
									}
								/>
							</label>
						</div>
						<div className={styles.slotGrid}>
							{TIMETABLE_DAYS.map((day, dayIndex) => (
								<div key={day}>
									<strong>{day}</strong>
									{editableSessions.map((session) => {
										const active = subject.slots.some(
											(slot) =>
												slot.day === dayIndex && slot.session === session.value,
										);
										return (
											<button
												key={session.value}
												type="button"
												className={active ? styles.slotActive : styles.slot}
												onClick={() =>
													toggleSlot(subject.id, {
														day: dayIndex,
														session: session.value,
													})
												}
												aria-label={`${subject.id} ${day} period ${session.label}`}
											>
												{session.label}
											</button>
										);
									})}
								</div>
							))}
						</div>
					</div>
				))}
				<button type="button" className={styles.rowButton} onClick={addSubject}>
					<div className={styles.row}>
						<span className={styles.symbol}>＋</span>
						<span className={styles.label}>Add Subject</span>
					</div>
				</button>
			</section>
			<section className={styles.detailCard}>
				<label className={styles.editorCheck}>
					<input
						type="checkbox"
						checked={isSearchable}
						onChange={(event) => setIsSearchable(event.target.checked)}
					/>{" "}
					Allow friends to compare my timetable
				</label>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<SheetActionButton
				label="Save timetable"
				onClick={() => void save()}
				disabled={saving}
			>
				{saving ? "Saving…" : "Save Timetable"}
			</SheetActionButton>
		</div>
	);
}

function teacherValue(teacher: TimetableSubject["teacher"]) {
	if (!teacher) return "";
	if (typeof teacher === "string") return teacher;
	if (teacher.displayName) return teacher.displayName;
	if (teacher.named) return `Teacher: ${teacher.named.lastName}`;
	return teacher.unknown?.rawNotes ?? "";
}

function classroomValue(classroom: TimetableSubject["classroom"]) {
	if (!classroom) return "";
	if (typeof classroom === "string") return classroom;
	if (classroom.unknown) return classroom.unknown.rawLocation;
	if (classroom.room)
		return `${classroom.room.building} ${classroom.room.number}`;
	return "";
}
