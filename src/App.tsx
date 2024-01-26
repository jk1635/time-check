import React, { ChangeEvent, useEffect, useState } from "react";

import { inject } from "@vercel/analytics";
import "./App.css";
import { useRecoilState, useRecoilValue } from "recoil";

import HtmlToCanvas from "./components/HtmlToCanvas";
import InfoAndReport from "./components/InfoAndReport";
import Popup from "./components/Popup";
import { tableHeaders, weekdays } from "./constants";
import { initialWorkTimesState, savedWorkTimeState, summaryTableState, workTimeState } from "./stores/atoms";
import { overtimeStatusSelector, realWorkTimeMinutesSelector, remainingWorkTimeMinutesSelector } from "./stores/selectors";
import { WeeklySummary } from "./types";
import { saveLocalStorage } from "./utils/localStorageUtils";
import { calculateRestTime, calculateTotalWorkTime, minutesToTime, timeToMinutes } from "./utils/timeUtils";

inject();

const App: React.FC = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const [summaryTable, setSummaryTable] = useRecoilState(summaryTableState);

    const realWorkTimeMinutes = useRecoilValue(realWorkTimeMinutesSelector);
    const remainingWorkTimeMinutes = useRecoilValue(remainingWorkTimeMinutesSelector);
    const overtime = useRecoilValue(overtimeStatusSelector);

    const [capturedImageURL, setCapturedImageURL] = useState("");
    const [showKakaoShareList, setShowKakaoShareList] = useState(false);

    useEffect(() => {
        saveLocalStorage("workTime", workTime);
        saveLocalStorage("savedWorkTime", savedWorkTime);
    }, [workTime, savedWorkTime]);

    const isValidWorkTime = (start: string, end: string) => {
        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);
        return start && end && startMinutes < endMinutes ? minutesToTime(calculateTotalWorkTime(start, end)) : "00:00";
    };

    const handleTimeChange = (dayIndex: number, type: "start" | "end", event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isValidValue = inputValue && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue);

        const updatedWorkTime = workTime.map((dayItem, index) => {
            if (index === dayIndex) {
                const updatedDay = {
                    ...dayItem,
                    [type]: isValidValue ? inputValue : "",
                };
                const updatedTotal = isValidWorkTime(updatedDay.start, updatedDay.end);
                return { ...updatedDay, total: updatedTotal };
            }
            return dayItem;
        });

        setWorkTime(updatedWorkTime);
    };

    const handleDayOffChange = (type: "halfDay" | "fullDay", dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const updatedWorkTime = workTime.map((dayItem, index) => {
            if (index === dayIndex) {
                const updatedDay = {
                    ...dayItem,
                    [type]: event.target.checked,
                };
                const updatedTotal = isValidWorkTime(updatedDay.start, updatedDay.end);
                return { ...updatedDay, total: updatedTotal };
            }
            return dayItem;
        });

        setWorkTime(updatedWorkTime);
    };

    const handleClearInputs = () => {
        setWorkTime(initialWorkTimesState);
        saveLocalStorage("workTime", initialWorkTimesState);
        window.location.reload();
    };

    const handleSave = () => {
        const summaryData = createWeeklySummary();
        setSavedWorkTime(prevData => [summaryData, ...prevData]);
    };

    const handleDelete = (targetIndex: number) => {
        setSavedWorkTime(prevData => prevData.filter((_, index) => index !== targetIndex));
    };

    const handleCapture = (url: string) => {
        setCapturedImageURL(url);
    };

    const handleShareTable = async () => {
        const summaryData = createWeeklySummary();
        const headOrder = [...weekdays, "잔여 근무 시간"];

        const mergedData = headOrder.map(title => {
            const workTimeData = workTime[weekdays.indexOf(title)] || {};
            return {
                title,
                start: workTimeData.start || "",
                end: workTimeData.end || "",
                real: title !== "잔여 근무 시간" ? summaryData[title] : "00:00",
                remain: title === "잔여 근무 시간" ? summaryData[title] : "40:00",
            };
        });

        setSummaryTable(mergedData);
        setShowKakaoShareList(prevState => !prevState);
    };

    const createWeeklySummary = () => {
        const weeklySummary: WeeklySummary = {};

        workTime.forEach((dayItem, index) => {
            const realWorkTime = minutesToTime(realWorkTimeMinutes[index]);
            const dayStatus = [];

            if (dayItem.halfDay) {
                dayStatus.push("반차");
            }
            if (dayItem.fullDay) {
                dayStatus.push("연차");
            }

            const day = weekdays[index];
            weeklySummary[day] = dayStatus.length ? `${realWorkTime} (${dayStatus.join("/")})` : `${realWorkTime}`;
        });

        weeklySummary["잔여 근무 시간"] = overtime;

        return weeklySummary;
    };

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
                                        {j === 5 ? minutesToTime(realWorkTimeMinutes[i]) : null}
                                        {j === 6 ? calculateRestTime(workTime[i].start, workTime[i].end) : null}
                                        {j === 7 ? workTime[i].total : null}
                                        {j === 8 && i === 0 ? (
                                            <span style={{ color: remainingWorkTimeMinutes < 0 ? "#EF4444" : "#37516A" }}>{overtime}</span>
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
            {savedWorkTime.map((savedItem: WeeklySummary, targetIndex: number) => (
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
