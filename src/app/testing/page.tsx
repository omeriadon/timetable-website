"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { SectionCard } from "@/components/ui/SectionCard";
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
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	List,
	ListRow,
	ListSection,
	ListSectionHeader,
} from "@/components/ui/List";
import styles from "./page.module.css";

export default function TestingPage() {
	const setToolbar = useToolbar();
	const [checked, setChecked] = useState(false);
	const [switched, setSwitched] = useState(false);
	const [alertVisible, setAlertVisible] = useState(true);

	useEffect(() => {
		setToolbar({ title: "Testing" });
	}, [setToolbar]);

	return (
		<main className={styles.page}>
			<h1>Shared component testing</h1>

			<section>
				<h2>Buttons</h2>
				<Button type="button">Button</Button>
				<Button type="button" disabled>
					Disabled button
				</Button>
			</section>

			<section>
				<h2>Fields</h2>
				<label>
					Text input
					<Input placeholder="Enter text" />
				</label>
				<label>
					Textarea
					<Textarea placeholder="Enter a longer value" />
				</label>
				<label>
					Select
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
				</label>
				<label>
					<Checkbox checked={checked} onCheckedChange={setChecked} />
					Checkbox
				</label>
				<label>
					<Switch checked={switched} onCheckedChange={setSwitched} />
					Switch
				</label>
			</section>

			<section>
				<h2>Lists</h2>
				<List>
					<ListSection>
						<ListSectionHeader>Section</ListSectionHeader>
						<ListRow>First row</ListRow>
						<ListRow>Second row</ListRow>
					</ListSection>
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
					<DrawerTrigger>Open drawer</DrawerTrigger>
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
					<DialogTrigger>Open dialog</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Dialog title</DialogTitle>
							<DialogDescription>Dialog description.</DialogDescription>
						</DialogHeader>
						<p>Dialog content.</p>
					</DialogContent>
				</Dialog>

				<Sheet>
					<SheetTrigger>Open sheet</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Sheet title</SheetTitle>
							<SheetDescription>Sheet description.</SheetDescription>
						</SheetHeader>
						<p>Sheet content.</p>
						<SheetFooter>
							<SheetClose>Close sheet</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>

				<Popover>
					<PopoverTrigger>Open popover</PopoverTrigger>
					<PopoverContent>
						<PopoverTitle>Popover title</PopoverTitle>
						<PopoverDescription>Popover description.</PopoverDescription>
					</PopoverContent>
				</Popover>

				<DropdownMenu>
					<DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
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
				<h2>Alerts</h2>
				{alertVisible ? (
					<Alert>
						<AlertTitle>Example alert</AlertTitle>
						<AlertDescription>Example alert message.</AlertDescription>
						<AlertAction>
							<Button type="button" onClick={() => setAlertVisible(false)}>
								Dismiss
							</Button>
						</AlertAction>
					</Alert>
				) : (
					<Button type="button" onClick={() => setAlertVisible(true)}>
						Show alert
					</Button>
				)}
			</section>
		</main>
	);
}
