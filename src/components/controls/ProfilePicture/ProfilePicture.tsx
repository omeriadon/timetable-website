import type { Account } from "@/lib/api/contracts";
import styles from "../controls.module.css";

type ProfilePictureProps = {
	profile?: Pick<Account, "displayName" | "appearance" | "photo"> | {
		displayName: string;
		appearance?: Account["appearance"];
		photo?: Account["photo"];
	};
	size?: number;
	label?: string;
};

export default function ProfilePicture({ profile, size = 56, label }: ProfilePictureProps) {
	const appearance = profile?.appearance;
	const colours = appearance?.colours?.length
		? appearance.colours
		: [
				{ r: 0.25, g: 0.42, b: 0.72, a: 1 },
				{ r: 0.55, g: 0.32, b: 0.8, a: 1 },
			];
	const foreground = appearance?.foregroundColour ?? { r: 1, g: 1, b: 1, a: 1 };
	const initials = appearance?.monogram || profile?.displayName.slice(0, 2).toUpperCase() || "?";
	const content = appearance?.contentKind === "photo" && profile?.photo?.url ? (
		<img className={styles.profilePictureImage} src={profile.photo.url} alt="" />
	) : appearance?.contentKind === "emoji" ? (
		<span aria-hidden="true">{appearance.emoji || "👤"}</span>
	) : (
		<span aria-hidden="true">{initials}</span>
	);

	return (
		<span
			className={styles.profilePicture}
			aria-label={label ?? `${profile?.displayName ?? "Profile"} profile picture`}
			style={{
				width: size,
				height: size,
				color: `rgba(${foreground.r * 255} ${foreground.g * 255} ${foreground.b * 255} / ${foreground.a})`,
				background: `linear-gradient(135deg, ${colour(colours[0])}, ${colour(colours[1] ?? colours[0])})`,
			}}
		>
			{content}
		</span>
	);
}

function colour(value: { r: number; g: number; b: number; a: number }) {
	return `rgba(${value.r * 255} ${value.g * 255} ${value.b * 255} / ${value.a})`;
}
