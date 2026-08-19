import type { CSSProperties } from "react";
import type { Account } from "@/lib/api/contracts";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "../controls.module.css";

type ProfilePictureProps = {
	profile?:
		| Pick<Account, "displayName" | "appearance" | "photo">
		| {
				displayName: string;
				appearance?: Account["appearance"];
				photo?: Account["photo"];
		  };
	size?: number;
	label?: string;
};

export default function ProfilePicture({
	profile,
	size = 56,
	label,
}: ProfilePictureProps) {
	const appearance = profile?.appearance;
	const colours = appearance?.colours?.length
		? appearance.colours
		: [
				{ r: 0.25, g: 0.42, b: 0.72, a: 1 },
				{ r: 0.55, g: 0.32, b: 0.8, a: 1 },
			];
	const foreground = appearance?.foregroundColour ?? { r: 1, g: 1, b: 1, a: 1 };
	const initials =
		appearance?.monogram ||
		profile?.displayName.slice(0, 2).toUpperCase() ||
		"?";
	const content =
		appearance?.contentKind === "photo" && profile?.photo?.url ? (
			<Symbol
				src={profile.photo.url}
				className={styles.profilePictureImage}
				alt=""
			/>
		) : appearance?.contentKind === "emoji" ? (
			appearance.emoji ? (
				<span aria-hidden="true">{appearance.emoji}</span>
			) : (
				<Symbol
					name="person.fill"
					className={styles.profilePictureFallbackIcon}
				/>
			)
		) : (
			<span aria-hidden="true">{initials}</span>
		);

	return (
		<span
			className={styles.profilePicture}
			aria-label={
				label ?? `${profile?.displayName ?? "Profile"} profile picture`
			}
			style={
				{
					width: size,
					height: size,
					color: `rgba(${foreground.r * 255} ${foreground.g * 255} ${foreground.b * 255} / ${foreground.a})`,
					background: `linear-gradient(135deg, ${colour(colours[0])}, ${colour(colours[1] ?? colours[0])})`,
					fontFamily: fontFamily(appearance?.fontDesign),
					fontWeight: fontWeight(appearance?.fontWeight),
					"--profile-speed": appearance?.speed ?? 0.2,
					"--profile-noise": `${appearance?.noise ?? 64}%`,
				} as CSSProperties
			}
		>
			{content}
		</span>
	);
}

function fontFamily(design?: string) {
	switch (design) {
		case "serif":
			return "Georgia, serif";
		case "monospaced":
			return "var(--theme-font-mono)";
		case "rounded":
			return "var(--theme-font-rounded)";
		default:
			return "var(--theme-font-body)";
	}
}

function fontWeight(weight?: string) {
	const values: Record<string, number> = {
		ultraLight: 200,
		thin: 300,
		light: 350,
		regular: 400,
		medium: 500,
		semibold: 650,
		bold: 700,
		heavy: 800,
		black: 900,
	};
	return values[weight ?? "semibold"] ?? 650;
}

function colour(value: { r: number; g: number; b: number; a: number }) {
	return `rgba(${value.r * 255} ${value.g * 255} ${value.b * 255} / ${value.a})`;
}
