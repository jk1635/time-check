interface WorkTime {
    start: string;
    end: string;
    total: string;
    halfDay: boolean;
    fullDay: boolean;
}

interface SummaryTable {
    title: string;
    start: string;
    end: string;
    real: string;
    remain: string;
}

interface WeeklySummary {
    [key: string]: string;
}

export type { WorkTime, SummaryTable, WeeklySummary };
