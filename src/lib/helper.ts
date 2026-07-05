import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(isToday);

export function dateConverterCreatedAt(date: Date) {
  const d = date;
  if (dayjs(d).isToday()) {
    return `${dayjs(d).format("HH:mm")}`;
  }
  return dayjs(d).format("DD MMM");
}

export function getEmojiForMood(mood: string): string {
  switch (mood.toLowerCase()) {
    case "happy":
      return "😊";
    case "anxious":
      return "😟";
    case "sad":
      return "😢";
    case "angry":
      return "😠";
    case "confused":
      return "😕";
    default:
      return "🤔"; // Default emoji for unknown moods
  }
}
