import { createSignal, onCleanup } from "solid-js";

const debugOffsetKey = "timetable.debug-offset";
const debugOffsetEvent = "timetable:debug-offset";

export function timetableNow() {
	const now = new Date();

	if (typeof window === "undefined") {
		return now;
	}

	const offset = Number(window.localStorage.getItem(debugOffsetKey) ?? "0");
	return Number.isFinite(offset)
		? new Date(now.getTime() + offset * 1000)
		: now;
}

export function useTimetableNow() {
	const [now, setNow] = createSignal(new Date());

	const update = () => setNow(timetableNow());
	if (typeof window !== "undefined") {
		const interval = window.setInterval(update, 60_000);

		update();
		window.addEventListener(debugOffsetEvent, update);

		onCleanup(() => {
			window.clearInterval(interval);
			window.removeEventListener(debugOffsetEvent, update);
		});
	}

	return now;
}

export function notifyTimetableClockChanged() {
	window.dispatchEvent(new Event(debugOffsetEvent));
}
