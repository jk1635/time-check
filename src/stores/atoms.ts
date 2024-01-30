import { atom } from "recoil";

import { SummaryTableItem, WeeklySummary, WorkTime } from "../types";
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

export const summaryTableListState = atom<SummaryTableItem[]>({
    key: "summaryTableState",
    default: [],
});

export const showKakaoShareState = atom<boolean>({
    key: "showKakaoShareState",
    default: false,
});

export const showPopupState = atom({
    key: "showPopupState",
    default: false,
});
