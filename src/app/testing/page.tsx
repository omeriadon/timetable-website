"use client";

import { useEffect, useState } from "react";
import {
	BellIcon,
	MenuIcon,
	PanelRightIcon,
	SaveIcon,
	TrashIcon,
} from "lucide-react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	List,
	ListRow,
	ListSection,
	ListSectionHeader,
} from "@/components/ui/list";
import { SectionCard } from "@/components/ui/sectioncard";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";

export default function TestingPage() {
	const setToolbar = useToolbar();
	const [checked, setChecked] = useState(false);
	const [switched, setSwitched] = useState(false);

	useEffect(() => {
		setToolbar({ title: "Testing" });
	}, [setToolbar]);

	return (
		<main>
			<h1>Shared component testing</h1>

			<section>
				<h2>Buttons</h2>

				<div>
					<Button>
						<SaveIcon />
						Save
					</Button>

					<Button variant="outline">
						<BellIcon />
						Notify
					</Button>

					<Button variant="secondary">
						<BellIcon />
						Notify
					</Button>

					<Button variant="destructive">
						<TrashIcon />
						Delete
					</Button>

					<Button variant="link">
						<TrashIcon />
						Delete
					</Button>
				</div>

				<Button disabled>
					<SaveIcon />
					Save
				</Button>

				<Button disabled variant="outline">
					<BellIcon />
					Notify
				</Button>

				<Button disabled variant="secondary">
					<BellIcon />
					Notify
				</Button>

				<Button disabled variant="destructive">
					<TrashIcon />
					Delete
				</Button>

				<Button disabled variant="link">
					<TrashIcon />
					Delete
				</Button>
			</section>

			<section>
				<h2>Fields</h2>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="testing-text">Text input</FieldLabel>
						<Input id="testing-text" placeholder="Enter text" />
					</Field>
					<Field>
						<FieldLabel htmlFor="testing-textarea">Textarea</FieldLabel>
						<Textarea
							id="testing-textarea"
							placeholder="Enter a longer value"
						/>
					</Field>
					<Field>
						<FieldLabel>Select</FieldLabel>
						<Select
							defaultValue="one"
							items={[
								{ value: "one", label: "Option one" },
								{ value: "two", label: "Option two" },
							]}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="one">Option one</SelectItem>
								<SelectItem value="two">Option two</SelectItem>
							</SelectContent>
						</Select>
					</Field>
					<Field orientation="horizontal">
						<Toggle
							id="testing-switch"
							checked={switched}
							onCheckedChange={setSwitched}
						/>
						<FieldLabel htmlFor="testing-switch">Switch</FieldLabel>
					</Field>
				</FieldGroup>
			</section>

			<section>
				<h2>Lists</h2>
				<List>
					<ListSection>
						<ListSectionHeader>Notifications</ListSectionHeader>
						<ListRow>
							<BellIcon />
							<span>Timetable reminders</span>
						</ListRow>
						<ListRow>
							<span>Friend activity</span>
						</ListRow>
					</ListSection>
					<ListSection>
						<ListSectionHeader>Account</ListSectionHeader>
						<ListRow>
							<span>Profile visibility</span>
						</ListRow>
						<ListRow>
							<span>Sign-in security</span>
						</ListRow>
					</ListSection>
				</List>
				<List>
					<ListRow>Single-card list row</ListRow>
					<ListRow>Another direct React child</ListRow>
				</List>
				<SectionCard
					background="surface"
					title="Section card"
					symbolName="rectangle.stack"
				>
					<p>Reusable section-card content.</p>
				</SectionCard>
			</section>

			<section>
				<h2>Overlays</h2>
				<Drawer>
					<DrawerTrigger render={<Button variant="outline" />}>
						<PanelRightIcon />
						Open drawer
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Drawer title</DrawerTitle>
							<DrawerDescription>Drawer description.</DrawerDescription>
						</DrawerHeader>
						<p>Drawer content.</p>
						<DrawerFooter>
							<DrawerClose>Close drawer</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				<Dialog>
					<DialogTrigger render={<Button variant="outline" />}>
						<PanelRightIcon />
						Open dialog
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Dialog title</DialogTitle>
							<DialogDescription>Dialog description.</DialogDescription>
						</DialogHeader>
						<p>Dialog content.</p>
					</DialogContent>
				</Dialog>

				<Popover>
					<PopoverTrigger render={<Button variant="outline" />}>
						<MenuIcon />
						Open popover
					</PopoverTrigger>
					<PopoverContent>
						<PopoverTitle>Popover title</PopoverTitle>
						<PopoverDescription>Popover description.</PopoverDescription>
					</PopoverContent>
				</Popover>

				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="outline" />}>
						<MenuIcon />
						Open menu
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>First menu item</DropdownMenuItem>
						<DropdownMenuItem>Second menu item</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>

			<section>
				<h2>Icons and profiles</h2>
				<Symbol name="star" />
				<Symbol name="person.2" />
				<ProfilePicture
					profile={{
						displayName: "Test Person",
						appearance: {
							contentKind: "monogram",
							monogram: "TP",
							emoji: "",
							foregroundColour: { r: 1, g: 1, b: 1, a: 1 },
							colours: [
								{ r: 0.2, g: 0.4, b: 0.7, a: 1 },
								{ r: 0.5, g: 0.3, b: 0.8, a: 1 },
							],
						},
					}}
					label="Test profile picture"
				/>
			</section>

			<section>
				<h2>Alert dialog</h2>
				<AlertDialog>
					<AlertDialogTrigger render={<Button variant="destructive" />}>
						<TrashIcon />
						Open alert dialog
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this example?</AlertDialogTitle>
							<AlertDialogDescription>
								This demonstrates the reusable modal alert dialog.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction variant="destructive">
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</section>
		</main>
	);
}
