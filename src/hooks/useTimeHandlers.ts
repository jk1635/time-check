import { ChangeEvent } from "react";

import { useRecoilState } from "recoil";

import { workTimeState } from "../stores/atoms";
import { WorkTime } from "../types";
import { isValidWorkTime } from "../utils/timeUtils";

const useTimeHandlers = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);

    const updateWorkTime = (dayIndex: number, updates: Partial<WorkTime>) => {
        const updatedWorkTime = workTime.map((dayItem, index) => {
            if (index === dayIndex) {
                const updatedDay = { ...dayItem, ...updates };
                const updatedTotal = isValidWorkTime({ start: updatedDay.start, end: updatedDay.end });
                return { ...updatedDay, total: updatedTotal };
            }
            return dayItem;
        });
        setWorkTime(updatedWorkTime);
    };

    const handleTimeChange = (type: "start" | "end", dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isValidValue = inputValue && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue);
        updateWorkTime(dayIndex, { [type]: isValidValue ? inputValue : "" });
    };

    const handleDayOffChange = (type: "halfDay" | "fullDay", dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        updateWorkTime(dayIndex, { [type]: event.target.checked });
    };
    return { handleTimeChange, handleDayOffChange };
};

export default useTimeHandlers;
