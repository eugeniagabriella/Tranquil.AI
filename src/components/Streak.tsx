// "use client";
import React from "react";

interface Streak {
  date: string;
}

const STREAKS: Streak[] = [
  { date: "2024-07-08" },
  { date: "2024-07-09" },
  // { date: "2024-07-10" },
  { date: "2024-07-11" },
  { date: "2024-07-12" },
];

const getDayOfWeek = (dateString: string): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = new Date(dateString).getDay();
  return days[dayIndex] ?? "Unknown";
};

const getWeekDates = (): string[] => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split("T")[0];
  }) as string[];
};

// const countStreak = (dates: string[]) => {
//   const today = new Date();
//   const yesterday = new Date(today).toISOString().split("T")[0];
//   if (dates[dates.length - 1] == || dates[dates.length - 2])
//   return 10
// }

const Streak: React.FC = () => {
  const weekDates = getWeekDates();
  const streakDates = STREAKS.map((streak) => streak.date);
  const today = new Date().toISOString().split("T")[0];
  console.log(streakDates);
  // console.log(today);
  // console.log(weekDates);

  return (
    <div className="flex w-full flex-col gap-2 rounded border-[1.3px] border-gray-200 bg-white p-3">
      <h1 className="text-xl font-bold">Streaks:</h1>
      <div className="flex items-center justify-between">
        {weekDates.map((date, index) => {
          const isStreak = streakDates.includes(date);
          const nextDate = weekDates[index + 1] ?? "";
          const showConnector =
            isStreak &&
            streakDates.includes(nextDate) &&
            index > 1 && // Don't show connector for Monday and Tuesday
            index < weekDates.length - 1;

          return (
            <div key={date} className="relative flex flex-col items-center">
              <div className="flex flex-col items-center gap-[6px]">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${
                    isStreak ? "bg-indigo-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {getDayOfWeek(date).charAt(0)}
                </div>
                <div
                  className={`h-1 w-4 rounded ${date == today ? "bg-indigo-600" : "bg-none"}`}
                ></div>
              </div>
              {showConnector && (
                <div
                  className="absolute left-1/2 top-4 h-1 w-full bg-indigo-600"
                  style={{ transform: "translateX(50%)" }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Streak;
