import { atom } from "recoil";

import { SummaryTable, WeeklySummary, WorkTime } from "../types";
import { getInitialState } from "../utils/localStorage";

export const initialWorkTimesState = Array.from({ length: 5 }, () => ({
    start: "",
    end: "",
    total: "00:00",
    halfDay: false,
    fullDay: false,
}));

export const workTimeState = atom<WorkTime[]>({
    key: "workTimeState",
    default: getInitialState("workTime", initialWorkTimesState),
});

export const savedWorkTimeState = atom<WeeklySummary[]>({
    key: "savedWorkTimeState",
    default: getInitialState("savedWorkTime", []),
});

export const summaryTableState = atom<SummaryTable[]>({
    key: "summaryTableState",
    default: [],
});
