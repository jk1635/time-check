interface WorkTime {
    start: string;
    end: string;
}

interface SummaryData {
    day: string;
    start?: string;
    end?: string;
    total: string;
}

export type { WorkTime, SummaryData };
