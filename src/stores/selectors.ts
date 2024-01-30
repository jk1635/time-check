import { selector } from "recoil";

import { workTimeState } from "./atoms";
import { calculateDayOffWorkTime, calculateRestTime, minutesToTime, timeToMinutes } from "../utils/timeCalculator";

export const realWorkTimeMinutesSelector = selector({
    key: "realWorkTimeSelector",
    get: ({ get }) => {
        const workTime = get(workTimeState);
        return workTime.map(dayItem => {
            const totalWorkTimeMinutes = calculateDayOffWorkTime(dayItem);
            const restTimeMinutes = timeToMinutes(calculateRestTime({ start: dayItem.start || "0:00", end: dayItem.end || "0:00" }));
            return Math.max(0, totalWorkTimeMinutes - restTimeMinutes);
        });
    },
});

export const remainingWorkTimeMinutesSelector = selector({
    key: "remainingWorkTimeMinutesSelector",
    get: ({ get }) => {
        const realWorkTimeMinutes = get(realWorkTimeMinutesSelector);
        return timeToMinutes("40:00") - realWorkTimeMinutes.reduce((total, current) => total + current, 0);
    },
});

export const overtimeStatusSelector = selector({
    key: "overtimeStatusSelector",
    get: ({ get }) => {
        const remainingWorkTimeMinutes = get(remainingWorkTimeMinutesSelector);
        return remainingWorkTimeMinutes < 0
            ? `-${minutesToTime(Math.abs(remainingWorkTimeMinutes))}`
            : minutesToTime(remainingWorkTimeMinutes);
    },
});
