"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import CalendarEventSheet from "@/components/sheets/CalendarEventSheet/CalendarEventSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import type { CalendarEvent } from "@/features/timetable/types";
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
import { cn } from "@/lib/utils";
import styles from "@/components/timetable/timetable.module.css";

export default function EventRow({
	event,
	prominent = false,
	showDate = true,
	presentation = "sheet",
}: {
	event: CalendarEvent;
	prominent?: boolean;
	showDate?: boolean;
	presentation?: "sheet" | "drawer";
}) {
	const { openSheet } = useSheet();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const eventRowContent = (
		<>
			<span className={styles.eventSymbol} aria-hidden="true">
				<Symbol name={event.symbol} className={styles.eventSymbolIcon} />
			</span>
			<div>
				<strong>{event.title}</strong>
				{event.notes ? <span>{event.notes}</span> : null}
			</div>
			{showDate ? <time>{displayDate(event)}</time> : null}
		</>
	);

	if (presentation === "drawer") {
		return (
			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerTrigger
					render={
						<Button
							unstyled
							type="button"
							className={cn(
								styles.cardRow,
								prominent ? styles.plannerEvent : styles.eventRow,
							)}
							aria-label={`Open ${event.title}`}
						/>
					}
				>
					{eventRowContent}
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{event.title}</DrawerTitle>
						<DrawerDescription>
							{new Date(
								event.date.year,
								event.date.month - 1,
								event.date.day,
							).toLocaleDateString("en-AU", { dateStyle: "long" })}
						</DrawerDescription>
					</DrawerHeader>
					<div className="min-h-0 overflow-y-auto p-4">
						<CalendarEventSheet
							event={event}
							onChanged={() => undefined}
							onClose={() => setIsDrawerOpen(false)}
							showHeader={false}
						/>
					</div>
					<DrawerFooter>
						<DrawerClose render={<Button type="button" variant="outline" />}>
							<Symbol name="xmark" />
							Close
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}
	return (
		<Button
			unstyled
			type="button"
			className={cn(
				styles.cardRow,
				prominent ? styles.plannerEvent : styles.eventRow,
			)}
			onClick={() =>
				openSheet(
					<CalendarEventSheet event={event} onChanged={() => undefined} />,
				)
			}
			aria-label={`Open ${event.title}`}
		>
			{eventRowContent}
		</Button>
	);
}

function displayDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
