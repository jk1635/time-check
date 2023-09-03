/* eslint-disable @typescript-eslint/no-explicit-any */
export const getInitialState: <T>(key: string, initialValue: T) => T = (key, initialValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
};

export const saveLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const convertToMinutes = (time: string) => {
    if (!time) return 0;
    const [hours, mins] = time.split(":").map(Number);
    return hours * 60 + mins;
};

export const formatTime = (totalMins: number) => {
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

export const calculateTotalMinutes = (start: string, end: string) => {
    if (!start || !end) return 0;

    const startMinutes = convertToMinutes(start) + 1;
    const endMinutes = convertToMinutes(end);

    return endMinutes - startMinutes;
};

export const calculateTotalWorkTime = (start: string, end: string) => {
    const totalMins = calculateTotalMinutes(start, end);
    return formatTime(totalMins);
};

export const calculateWorkTimeWithLeave = (time1: string, time2: string) => {
    const totalMins = convertToMinutes(time1) + convertToMinutes(time2);
    return formatTime(totalMins);
};

export const calculateRestTime = (start: string, end: string) => {
    const totalMins = calculateTotalMinutes(start, end);

    if (totalMins >= 780) {
        return "1:30";
    }
    if (totalMins >= 510) {
        return "1:00";
    }
    if (totalMins >= 240) {
        return "0:30";
    }
    return "0:00";
};
