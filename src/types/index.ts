type TimeChange = "start" | "end";
type DayOffChange = "halfDay" | "fullDay";

interface WorkTimePeriod {
    start: string;
    end: string;
}

interface WorkTime extends WorkTimePeriod {
    total: string;
    halfDay: boolean;
    fullDay: boolean;
}

interface SummaryTableItem extends WorkTimePeriod {
    title: string;
    real: string;
    remain: string;
}

interface WeeklySummary {
    [key: string]: string;
}

interface OldWorkTime {
    start: string;
    end: string;
}

export type { WorkTimePeriod, WorkTime, SummaryTableItem, WeeklySummary, TimeChange, DayOffChange, OldWorkTime };
