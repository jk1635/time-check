import React, { ChangeEvent, useEffect, useState } from "react";

import { inject } from "@vercel/analytics";
import "./App.css";

import HtmlToCanvas from "./components/HtmlToCanvas";
import InfoAndReport from "./components/InfoAndReport";
import Popup from "./components/Popup";
import { weekdays } from "./constants";
import { SummaryTable, WeeklySummary, WorkTime } from "./types";
import { getInitialState, saveLocalStorage } from "./utils/localStorageUtils";
import { calculateRestTime, calculateTotalWorkTime, minutesToTime, timeToMinutes } from "./utils/timeUtils";

inject();

const tableHeaders = ["요일", "출근 시간", "퇴근 시간", "반차", "연차", "실 근무 시간", "휴게 시간", "전체 근무 시간", "잔여 근무 시간"];

const initialWorkTimesState = Array.from({ length: 5 }, () => ({
    start: "",
    end: "",
    total: "00:00",
    halfDay: false,
    fullDay: false,
}));

const App: React.FC = () => {
    const [workTime, setWorkTime] = useState<WorkTime[]>(() => getInitialState("workTime", initialWorkTimesState));
    const [remainingWorkTime, setRemainingWorkTime] = useState("40:00");
    const [savedWorkTime, setSavedWorkTime] = useState<WeeklySummary[]>(getInitialState("savedWorkTime", []));
    const [overtime, setOvertime] = useState("00:00");
    const [summaryTable, setSummaryTable] = useState<SummaryTable[]>([]);
    const [capturedImageURL, setCapturedImageURL] = useState("");
    const [showKakaoShareList, setShowKakaoShareList] = useState(false);

    useEffect(() => {
        saveLocalStorage("workTime", workTime);
        saveLocalStorage("savedWorkTime", savedWorkTime);
    }, [workTime, savedWorkTime]);

    useEffect(() => {
        let totalRealWorkTimeMinutes = 0;

        workTime.forEach((dayItem, index) => {
            if (dayItem.total !== "00:00" || dayItem.halfDay || dayItem.fullDay) {
                totalRealWorkTimeMinutes += timeToMinutes(calculateRealWorkTime(index));
            }
        });

        const weeklyWorkTime = "40:00";
        const remainingWorkTimeMinutes = timeToMinutes(weeklyWorkTime) - totalRealWorkTimeMinutes;

        setOvertime(remainingWorkTimeMinutes < 0 ? minutesToTime(Math.abs(remainingWorkTimeMinutes)) : "00:00");
        setRemainingWorkTime(minutesToTime(remainingWorkTimeMinutes));
    }, [workTime]);

    const handleTimeChange = (dayIndex: number, type: "start" | "end", event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isValidValue = inputValue && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue);

        const updatedWorkTime = [...workTime];

        updatedWorkTime[dayIndex] = {
            ...updatedWorkTime[dayIndex],
            [type]: isValidValue ? inputValue : "",
        };

        const currentDay = updatedWorkTime[dayIndex];

        if (currentDay.start !== "0:00" && currentDay.end !== "0:00") {
            currentDay.total = isValidValue ? calculateTotalWorkTime(currentDay.start, currentDay.end) : "00:00";
        }

        setWorkTime(updatedWorkTime);
    };

    const handleDayOffChange = (type: "halfDay" | "fullDay", dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const updatedWorkTime = [...workTime];
        const currentDay = updatedWorkTime[dayIndex];

        if (type === "halfDay") {
            updatedWorkTime[dayIndex] = {
                ...currentDay,
                halfDay: event.target.checked,
            };
        } else if (type === "fullDay") {
            updatedWorkTime[dayIndex] = {
                ...currentDay,
                fullDay: event.target.checked,
            };
        }

        if (currentDay.start && currentDay.end) {
            currentDay.total = calculateTotalWorkTime(currentDay.start, currentDay.end);
        }

        setWorkTime(updatedWorkTime);
    };

    const handleClearInputs = () => {
        setWorkTime(initialWorkTimesState);
        saveLocalStorage("workTime", initialWorkTimesState);
        window.location.reload();
    };

    const handleSave = () => {
        const workTimeData = createWeeklySummary();
        setSavedWorkTime(prevData => [workTimeData, ...prevData]);
    };

    const handleDelete = (targetIndex: number) => {
        setSavedWorkTime(prevData => prevData.filter((_, index) => index !== targetIndex));
    };

    const handleCapture = (url: string) => {
        setCapturedImageURL(url);
    };

    const handleShareTable = async () => {
        const workTimeData = createWeeklySummary();
        const summaryHeadOrder = [...weekdays, "잔여 근무 시간"];

        const mergedData = summaryHeadOrder.map(title => {
            const dayData = workTime[weekdays.indexOf(title)] || {};
            return {
                title,
                start: dayData.start || "",
                end: dayData.end || "",
                real: title !== "잔여 근무 시간" ? workTimeData[title] : "00:00",
                remain: title === "잔여 근무 시간" ? workTimeData[title] : "40:00",
            };
        });

        setSummaryTable(mergedData);
        setShowKakaoShareList(prevState => !prevState);
    };

    const calculateRealWorkTime = (dayIndex: number) => {
        const dayData = workTime[dayIndex];

        let totalWorkTimeMinutes = timeToMinutes(dayData.total);
        const restTimeMinutes = timeToMinutes(calculateRestTime(dayData.start || "0:00", dayData.end || "0:00"));

        if (dayData.halfDay) {
            totalWorkTimeMinutes += timeToMinutes("04:00");
        }
        if (dayData.fullDay) {
            totalWorkTimeMinutes += timeToMinutes("08:00");
        }

        const realWorkTimeMinutes = totalWorkTimeMinutes - restTimeMinutes;

        return minutesToTime(realWorkTimeMinutes);
    };

    const createWeeklySummary = () => {
        const weeklySummary: WeeklySummary = {};

        workTime.forEach((dayData, index) => {
            const realWorkTime = calculateRealWorkTime(index);
            const dayStatus = [];

            if (dayData.halfDay) {
                dayStatus.push("반차");
            }
            if (dayData.fullDay) {
                dayStatus.push("연차");
            }

            const day = weekdays[index];
            weeklySummary[day] = dayStatus.length ? `${realWorkTime} (${dayStatus.join("/")})` : realWorkTime;
        });

        weeklySummary["잔여 근무 시간"] = overtimeStatus;

        return weeklySummary;
    };

    const overtimeStatus = timeToMinutes(remainingWorkTime) < 0 ? `-${overtime}` : remainingWorkTime;

    return (
        <div className="container">
            <Popup />
            <InfoAndReport />
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {tableHeaders.map(header => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }, (_row, i) => (
                            <tr key={i}>
                                {Array.from({ length: 10 }, (_col, j) => (
                                    <td key={j}>
                                        {j === 0 ? weekdays[i] : null}
                                        {j === 1 && (
                                            <input
                                                type="text"
                                                className="text-input"
                                                placeholder="출근시간"
                                                defaultValue={workTime[i] ? workTime[i].start : ""}
                                                onChange={event => handleTimeChange(i, "start", event)}
                                            />
                                        )}
                                        {j === 2 && (
                                            <input
                                                type="text"
                                                className="text-input"
                                                placeholder="퇴근시간"
                                                defaultValue={workTime[i] ? workTime[i].end : ""}
                                                onChange={event => handleTimeChange(i, "end", event)}
                                            />
                                        )}
                                        {j === 3 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                tabIndex={-1}
                                                name={`halfDay-${i}`}
                                                id={`halfDay-${i}`}
                                                checked={workTime[i].halfDay}
                                                onChange={event => handleDayOffChange("halfDay", i, event)}
                                            />
                                        ) : null}
                                        {j === 4 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                tabIndex={-1}
                                                name={`fullDay-${i}`}
                                                id={`fullDay-${i}`}
                                                checked={workTime[i].fullDay}
                                                onChange={event => handleDayOffChange("fullDay", i, event)}
                                            />
                                        ) : null}
                                        {j === 5 ? calculateRealWorkTime(i) : null}
                                        {j === 6 ? calculateRestTime(workTime[i].start, workTime[i].end) : null}
                                        {j === 7 ? workTime[i].total : null}
                                        {j === 8 && i === 0 ? (
                                            <span style={{ color: timeToMinutes(remainingWorkTime) < 0 ? "#EF4444" : "#37516A" }}>
                                                {overtimeStatus}
                                            </span>
                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="button-wrapper">
                <button className="outline-button" onClick={handleShareTable}>
                    {showKakaoShareList ? "닫기" : "공유"}
                </button>
                <button className="outline-button" onClick={handleClearInputs}>
                    초기화
                </button>
                <button className="default-button" onClick={handleSave}>
                    저장
                </button>
            </div>
            {showKakaoShareList && (
                <div className="summary-table">
                    <HtmlToCanvas summaryTable={summaryTable} onCapture={handleCapture} capturedImageURL={capturedImageURL} />
                </div>
            )}
            {savedWorkTime.map((savedItem, targetIndex) => (
                <div className="data-wrapper">
                    <pre>{JSON.stringify(savedItem, null, 2)}</pre>
                    <button className="outline-button" onClick={() => handleDelete(targetIndex)}>
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
};

export default App;
