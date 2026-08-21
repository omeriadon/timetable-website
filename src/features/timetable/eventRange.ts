export function futureEventEndDate(range: string | undefined, start: Date) {
	const end = new Date(start);

	switch (range) {
		case "oneWeek":
			end.setDate(end.getDate() + 7);
			break;
		case "twoWeeks":
			end.setDate(end.getDate() + 14);
			break;
		case "oneMonth":
			end.setMonth(end.getMonth() + 1);
			break;
		case "threeMonths":
			end.setMonth(end.getMonth() + 3);
			break;
		case "endOfYear":
			return new Date(start.getFullYear(), 11, 31);
		case "twoMonths":
		default:
			end.setMonth(end.getMonth() + 2);
			break;
	}

	return end;
}
