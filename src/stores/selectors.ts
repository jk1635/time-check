import { selector } from "recoil";

import { workTimeState } from "./atoms";
import { calculateDayOffWorkTime, calculateRestTime, minutesToTime, timeToMinutes } from "../utils/timeUtils";

export const totalWorkTimeMinutesSelector = selector({
    key: "totalWorkTimeMinutesSelector",
    get: ({ get }) => {
        const workTime = get(workTimeState);
        let totalMinutes = 0;
        workTime.forEach(dayItem => {
            totalMinutes += calculateDayOffWorkTime(dayItem);
        });
        return totalMinutes;
    },
});

export const remainingWorkTimeMinutesSelector = selector({
    key: "remainingWorkTimeMinutesSelector",
    get: ({ get }) => {
        const totalWorkTimeMinutes = get(totalWorkTimeMinutesSelector);
        return timeToMinutes("40:00") - totalWorkTimeMinutes;
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

export const realWorkTimeMinutesSelector = selector({
    key: "realWorkTimeSelector",
    get: ({ get }) => {
        const workTime = get(workTimeState);
        return workTime.map(dayItem => {
            const totalWorkTimeMinutes = calculateDayOffWorkTime(dayItem);
            const restTimeMinutes = timeToMinutes(calculateRestTime(dayItem.start || "0:00", dayItem.end || "0:00"));
            return Math.max(0, totalWorkTimeMinutes - restTimeMinutes);
        });
    },
});
