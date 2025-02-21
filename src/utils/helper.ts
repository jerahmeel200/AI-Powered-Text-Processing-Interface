export const formatTimestamp = (timestamp: string): string => {
	return new Date(timestamp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const truncateText = (text: string, length: number): string => {
	if (text.length <= length) return text;
	return text.slice(0, length) + "...";
};