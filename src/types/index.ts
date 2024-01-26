interface WorkTimePeriod {
    start: string;
    end: string;
}

interface WorkTime extends WorkTimePeriod {
    total: string;
    halfDay: boolean;
    fullDay: boolean;
}

interface SummaryTable extends WorkTimePeriod {
    title: string;
    real: string;
    remain: string;
}

interface WeeklySummary {
    [key: string]: string;
}

export type { WorkTimePeriod, WorkTime, SummaryTable, WeeklySummary };
