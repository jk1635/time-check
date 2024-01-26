import { WorkTime } from "../types";

export const timeToMinutes = (time: string) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const calculateTotalWorkTime = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startMinutes = timeToMinutes(start) + 1;
    const endMinutes = timeToMinutes(end);
    return endMinutes - startMinutes;
};

export const calculateRestTime = (start: string, end: string) => {
    const totalMinutes = calculateTotalWorkTime(start, end);
    if (totalMinutes >= 780) {
        return "1:30";
    }
    if (totalMinutes >= 510) {
        return "1:00";
    }
    if (totalMinutes >= 240) {
        return "0:30";
    }
    return "0:00";
};

export const calculateDayOffWorkTime = (dayItem: WorkTime) => {
    let totalMinutes = timeToMinutes(dayItem.total);
    if (dayItem.halfDay) {
        totalMinutes += timeToMinutes("04:00");
    }
    if (dayItem.fullDay) {
        totalMinutes += timeToMinutes("08:00");
    }
    return totalMinutes;
};
