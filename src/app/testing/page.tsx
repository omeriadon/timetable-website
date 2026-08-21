"use client";

import { useEffect, useState } from "react";
import {
	BellIcon,
	CalendarIcon,
	CheckIcon,
	CopyIcon,
	MenuIcon,
	PanelRightIcon,
	SaveIcon,
	Settings2Icon,
	TrashIcon,
	XIcon,
} from "lucide-react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	List,
	ListRow,
	ListSection,
	ListSectionHeader,
} from "@/components/ui/list";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { SectionCard } from "@/components/ui/sectioncard";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import styles from "./page.module.css";

export default function TestingPage() {
	const setToolbar = useToolbar();
	const [switched, setSwitched] = useState(false);
	const [menuChecked, setMenuChecked] = useState(true);
	const [menuTheme, setMenuTheme] = useState("system");
	const [settingEnabled, setSettingEnabled] = useState(true);

	useEffect(() => {
		setToolbar({ title: "Testing" });
	}, [setToolbar]);

	return (
		<main className={styles.page}>
			<section>
				<h2>Buttons</h2>

				<div className={styles.exampleRow}>
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
					<Button variant="ghost">
						<Settings2Icon />
						Settings
					</Button>
				</div>

				<div className={styles.exampleRow}>
					<Button size="xs">
						<CheckIcon />
						Extra small
					</Button>
					<Button size="sm">
						<CheckIcon />
						Small
					</Button>
					<Button size="lg">
						<CheckIcon />
						Large
					</Button>
				</div>

				<div className={styles.exampleRow}>
					<Button size="icon-xs" aria-label="Small calendar button">
						<CalendarIcon />
					</Button>
					<Button size="icon-sm" aria-label="Calendar button">
						<CalendarIcon />
					</Button>
					<Button size="icon" aria-label="Large calendar button">
						<CalendarIcon />
					</Button>
					<Button size="icon-lg" aria-label="Extra large calendar button">
						<CalendarIcon />
					</Button>
				</div>

				<div className={styles.exampleRow}>
					<Button disabled>
						<SaveIcon />
						Disabled
					</Button>
					<Button disabled variant="outline">
						<BellIcon />
						Disabled
					</Button>
					<Button disabled variant="destructive">
						<TrashIcon />
						Disabled
					</Button>
				</div>
			</section>

			<section>
				<h2>Fields</h2>
				<FieldSet>
					<FieldLegend>Field primitives</FieldLegend>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="testing-text">Text input</FieldLabel>
							<Input id="testing-text" placeholder="Enter text" />
							<FieldDescription>
								Field descriptions sit below the control.
							</FieldDescription>
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
							<Select defaultValue="one">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Options</SelectLabel>
										<SelectItem value="one">Option one</SelectItem>
										<SelectItem value="two">Option two</SelectItem>
									</SelectGroup>
									<SelectSeparator />
									<SelectGroup>
										<SelectLabel>More options</SelectLabel>
										<SelectItem value="three">Option three</SelectItem>
									</SelectGroup>
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
						<Field orientation="responsive">
							<FieldContent>
								<FieldTitle>Responsive field</FieldTitle>
								<FieldDescription>
									Content and controls can share a responsive row.
								</FieldDescription>
							</FieldContent>
							<Toggle aria-label="Responsive field toggle" />
						</Field>
						<FieldError
							errors={[
								{ message: "Example validation error" },
								{ message: "Example validation error" },
							]}
						/>
					</FieldGroup>
				</FieldSet>
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
			</section>

			<section>
				<List>
					<ListRow>Single-card list row</ListRow>
					<ListRow>Another direct React child</ListRow>
				</List>
			</section>

			<section>
				<SectionCard
					background="surface"
					title="Section card"
					symbolName="rectangle.stack"
				>
					<p>Reusable section-card content.</p>
				</SectionCard>
			</section>

			<section>
				<h2>Separators</h2>
				<div className={styles.separatorExample}>
					<span>Top content</span>
					<Separator />
					<span>bottom content</span>
				</div>
				<div className={styles.verticalSeparatorExample}>
					<span>Left</span>
					<Separator orientation="vertical" />
					<span>Right</span>
				</div>
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
							<DrawerClose>
								<XIcon />
								Close drawer
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				<Popover>
					<PopoverTrigger render={<Button variant="outline" />}>
						<MenuIcon />
						Open popover
					</PopoverTrigger>
					<PopoverContent>
						<PopoverHeader>
							<PopoverTitle>Popover title</PopoverTitle>
							<PopoverDescription>Popover description.</PopoverDescription>
						</PopoverHeader>
					</PopoverContent>
				</Popover>

				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="outline" />}>
						<MenuIcon />
						Open menu
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Menu controls</DropdownMenuLabel>
							<DropdownMenuItem>
								<CopyIcon />
								Copy
								<DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuCheckboxItem
								checked={menuChecked}
								onCheckedChange={setMenuChecked}
							>
								Show reminders
							</DropdownMenuCheckboxItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup
							value={menuTheme}
							onValueChange={(value) => {
								if (value) {
									setMenuTheme(value);
								}
							}}
						>
							<DropdownMenuRadioItem value="system">
								System appearance
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="paper">
								Paper appearance
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuItem variant="destructive">
									<TrashIcon />
									Reset example
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>

			<section>
				<h2>Alert dialog</h2>
				<AlertDialog>
					<AlertDialogTrigger render={<Button variant="destructive" />}>
						<TrashIcon />
						Open alert dialog
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogMedia>
							<TrashIcon />
						</AlertDialogMedia>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this example?</AlertDialogTitle>
							<AlertDialogDescription>
								This demonstrates the reusable modal alert dialog.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction variant="destructive">
								<TrashIcon />
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</section>
		</main>
	);
}
