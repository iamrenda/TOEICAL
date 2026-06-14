// Hardcoded mock data for the writing study calendar (June 2026).
// This is presentation-only sample data — no fetching / date logic is performed.

export type CalendarWeekday = "sun" | "sat" | "weekday";

export interface CalendarCell {
    // `null` represents an empty leading cell before the 1st of the month.
    day: number | null;
    weekday: CalendarWeekday;
    hasEntry: boolean;
    isToday: boolean;
    isSelected: boolean;
}

export interface CalendarEntry {
    dateLabel: string;
    score: number;
    title: string;
    snippet: string;
}

export const MONTH_LABEL = "2026年6月";

export const WEEKDAY_LABELS: { label: string; weekday: CalendarWeekday }[] = [
    { label: "日", weekday: "sun" },
    { label: "月", weekday: "weekday" },
    { label: "火", weekday: "weekday" },
    { label: "水", weekday: "weekday" },
    { label: "木", weekday: "weekday" },
    { label: "金", weekday: "weekday" },
    { label: "土", weekday: "sat" },
];

// June 1, 2026 falls on a Monday, so the grid starts with one empty Sunday cell.
// Entry days: 2, 4, 5, 8, 9, 11, 12, 13, 14. Today: 14. Selected: 12.
export const CALENDAR_CELLS: CalendarCell[] = [
    { day: null, weekday: "sun", hasEntry: false, isToday: false, isSelected: false },
    { day: 1, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 2, weekday: "weekday", hasEntry: true, isToday: false, isSelected: false },
    { day: 3, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 4, weekday: "weekday", hasEntry: true, isToday: false, isSelected: false },
    { day: 5, weekday: "weekday", hasEntry: true, isToday: false, isSelected: false },
    { day: 6, weekday: "sat", hasEntry: false, isToday: false, isSelected: false },

    { day: 7, weekday: "sun", hasEntry: false, isToday: false, isSelected: false },
    { day: 8, weekday: "weekday", hasEntry: true, isToday: false, isSelected: false },
    { day: 9, weekday: "weekday", hasEntry: true, isToday: false, isSelected: false },
    { day: 10, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 11, weekday: "weekday", hasEntry: true, isToday: false, isSelected: false },
    { day: 12, weekday: "weekday", hasEntry: true, isToday: false, isSelected: true },
    { day: 13, weekday: "sat", hasEntry: true, isToday: false, isSelected: false },

    { day: 14, weekday: "sun", hasEntry: true, isToday: true, isSelected: false },
    { day: 15, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 16, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 17, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 18, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 19, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 20, weekday: "sat", hasEntry: false, isToday: false, isSelected: false },

    { day: 21, weekday: "sun", hasEntry: false, isToday: false, isSelected: false },
    { day: 22, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 23, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 24, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 25, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 26, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 27, weekday: "sat", hasEntry: false, isToday: false, isSelected: false },

    { day: 28, weekday: "sun", hasEntry: false, isToday: false, isSelected: false },
    { day: 29, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
    { day: 30, weekday: "weekday", hasEntry: false, isToday: false, isSelected: false },
];

export const SELECTED_ENTRY: CalendarEntry = {
    dateLabel: "6月12日 (記録済み)",
    score: 88,
    title: "Describe a memorable trip.",
    snippet: "Last summer I traveled to Okinawa and the clear blue ocean was the most beautiful thing I have seen…",
};
