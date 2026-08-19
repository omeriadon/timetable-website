import type { Account } from "@/lib/api/contracts";
import Symbol from "@/components/controls/Symbol/Symbol";

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
	size: _size = 56,
	label,
}: ProfilePictureProps) {
	const appearance = profile?.appearance;
	const initials =
		appearance?.monogram ||
		profile?.displayName.slice(0, 2).toUpperCase() ||
		"?";
	const content =
		appearance?.contentKind === "photo" && profile?.photo?.url ? (
			<Symbol src={profile.photo.url} alt="" />
		) : appearance?.contentKind === "emoji" ? (
			appearance.emoji ? (
				<span aria-hidden="true">{appearance.emoji}</span>
			) : (
				<Symbol name="person.fill" />
			)
		) : (
			<span aria-hidden="true">{initials}</span>
		);

	return (
		<span
			aria-label={
				label ?? `${profile?.displayName ?? "Profile"} profile picture`
			}
		>
			{content}
		</span>
	);
}
