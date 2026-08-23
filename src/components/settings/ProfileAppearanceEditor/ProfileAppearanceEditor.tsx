"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import type { ProfileAppearance, ProfilePhoto } from "@/lib/api/contracts";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import MessageDrawer from "@/components/drawers/MessageDrawer/MessageDrawer";
import {
	ProfileColourGrid,
	ProfileForegroundColourGrid,
} from "../ProfileColourGrid/ProfileColourGrid";
import ProfileFontPicker from "../ProfileFontPicker/ProfileFontPicker";
import { Slider } from "@/components/ui/slider";
import styles from "./ProfileAppearanceEditor.module.css";

type ProfileResponse = {
	displayName: string;
	appearance: ProfileAppearance;
	photo?: ProfilePhoto | null;
	revision: number;
};

type Props = {
	profile: ProfileResponse;
	save: (appearance: ProfileAppearance) => Promise<void>;
};

const emojiOptions = ["👤", "⭐️", "⚡️", "📚", "🏃", "🎵", "🎮", "🎨", "✈️"];

export default function ProfileAppearanceEditor({ profile, save }: Props) {
	const { openDrawer } = useDrawer();
	const [draft, setDraft] = useState<ProfileAppearance>(
		withDefaults(profile.appearance),
	);
	const [photo, setPhoto] = useState(profile.photo);
	const [uploading, setUploading] = useState(false);
	const [removingPhoto, setRemovingPhoto] = useState(false);
	const update = (changes: Partial<ProfileAppearance>) =>
		setDraft((current) => withDefaults({ ...current, ...changes }));

	const uploadPhoto = async (file: File) => {
		setUploading(true);
		try {
			const updated = await apiRequest<ProfileResponse>(
				"v1/friends/profile/photo",
				{
					method: "PUT",
					headers: { "Content-Type": "image/jpeg" },
					body: await file.arrayBuffer(),
				},
			);
			setPhoto(updated.photo);
		} catch (requestError) {
			openDrawer(
				<MessageDrawer
					title="Photo upload failed"
					message={(requestError as Error).message}
				/>,
			);
		} finally {
			setUploading(false);
		}
	};

	const removePhoto = async () => {
		setRemovingPhoto(true);
		try {
			await apiRequest("v1/friends/profile/photo", { method: "DELETE" });
			setPhoto(null);
			update({ contentKind: "emoji" });
		} catch (requestError) {
			openDrawer(
				<MessageDrawer
					title="Photo removal failed"
					message={(requestError as Error).message}
				/>,
			);
		} finally {
			setRemovingPhoto(false);
		}
	};

	return (
		<section className={styles.card}>
			<div className={styles.preview}>
				<ProfilePicture
					profile={{
						displayName: profile.displayName,
						appearance: draft,
						photo,
					}}
					size={82}
				/>
				<div>
					<strong>{profile.displayName}</strong>
					<span>Profile appearance</span>
				</div>
			</div>
			<div className={styles.segmented} aria-label="Profile content">
				{(["photo", "monogram", "emoji"] as const).map((kind) => (
					<Button
						key={kind}
						type="button"
						className={
							draft.contentKind === kind ? styles.segmentActive : styles.segment
						}
						onClick={() => update({ contentKind: kind })}
						aria-pressed={draft.contentKind === kind}
					>
						<Symbol
							name={
								kind === "photo"
									? "photo"
									: kind === "monogram"
										? "character"
										: "face.smiling"
							}
							fallback={
								kind === "photo" ? "◉" : kind === "monogram" ? "A" : "☺"
							}
						/>
						{kind[0].toUpperCase() + kind.slice(1)}
					</Button>
				))}
			</div>
			{draft.contentKind === "photo" ? (
				<div className={styles.row}>
					<Symbol name="photo" fallback="◉" />
					<span className={styles.label}>Photo</span>
					<Input
						type="file"
						accept="image/jpeg,image/png"
						disabled={uploading || removingPhoto}
						onChange={(event) => {
							const file = event.target.files?.[0];
							if (file) void uploadPhoto(file);
						}}
					/>
					{photo ? (
						<Button
							type="button"
							className={styles.removePhoto}
							onClick={() => void removePhoto()}
							disabled={uploading || removingPhoto}
						>
							<Symbol name="trash" fallback="−" />
							Remove
						</Button>
					) : null}
				</div>
			) : null}
			{draft.contentKind === "emoji" ? (
				<div className={styles.emojiPicker}>
					<div className={styles.row}>
						<Symbol name="face.smiling" fallback="☺" />
						<label className={styles.label} htmlFor="profile-emoji">
							Emoji
						</label>
						<Input
							id="profile-emoji"
							className={styles.inlineInput}
							value={draft.emoji}
							maxLength={4}
							onChange={(event) =>
								update({ emoji: event.target.value.slice(0, 4) })
							}
						/>
					</div>
					<div className={styles.emojiOptions}>
						{emojiOptions.map((emoji) => (
							<Button
								type="button"
								key={emoji}
								onClick={() => update({ emoji })}
								aria-label={`Use ${emoji}`}
							>
								{emoji}
							</Button>
						))}
					</div>
				</div>
			) : null}
			{draft.contentKind !== "photo" ? (
				<>
					<div className={styles.subheading}>Foreground</div>
					<ProfileForegroundColourGrid
						selection={draft.foregroundColour}
						onChange={(foregroundColour) => update({ foregroundColour })}
					/>
					{draft.contentKind === "monogram" ? (
						<div className={styles.monogram}>
							<div className={styles.row}>
								<Symbol name="character" fallback="A" />
								<label className={styles.label} htmlFor="profile-monogram">
									Monogram
								</label>
								<Input
									id="profile-monogram"
									className={styles.inlineInput}
									value={draft.monogram}
									maxLength={3}
									onChange={(event) =>
										update({
											monogram: event.target.value.slice(0, 3).toUpperCase(),
										})
									}
								/>
							</div>
							<ProfileFontPicker
								design={draft.fontDesign ?? "rounded"}
								weight={draft.fontWeight ?? "semibold"}
								onDesignChange={(fontDesign) => update({ fontDesign })}
								onWeightChange={(fontWeight) => update({ fontWeight })}
							/>
						</div>
					) : null}
					<div className={styles.subheading}>Background</div>
					<ProfileColourGrid
						selection={draft.colours}
						onChange={(colours) => update({ colours })}
					/>
					<div className={styles.sliderList}>
						<label>
							Animation Speed <output>{(draft.speed ?? 0.2).toFixed(2)}</output>
							<Slider
								ariaLabel="Animation Speed"
								min={0}
								max={5}
								step={0.05}
								value={draft.speed ?? 0.2}
								onValueChange={(value) => update({ speed: value })}
							/>
						</label>
						<label>
							Texture Noise <output>{Math.round(draft.noise ?? 64)}</output>
							<Slider
								ariaLabel="Texture Noise"
								min={0}
								max={100}
								step={1}
								value={draft.noise ?? 64}
								onValueChange={(value) => update({ noise: value })}
							/>
						</label>
					</div>
				</>
			) : null}
			<Button type="button" className={styles.save} onClick={() => save(draft)}>
				<Symbol name="checkmark" fallback="✓" />
				Save Profile Appearance
			</Button>
		</section>
	);
}

function withDefaults(appearance: ProfileAppearance): ProfileAppearance {
	return {
		...appearance,
		foregroundColour: appearance.foregroundColour ?? { r: 1, g: 1, b: 1, a: 1 },
		colours: appearance.colours?.length
			? appearance.colours
			: [
					{ r: 0.416, g: 0.655, b: 1, a: 1 },
					{ r: 0.69, g: 0.424, b: 1, a: 1 },
				],
		fontDesign: appearance.fontDesign ?? "rounded",
		fontWeight: appearance.fontWeight ?? "semibold",
		speed: appearance.speed ?? 0.2,
		noise: appearance.noise ?? 64,
	};
}
