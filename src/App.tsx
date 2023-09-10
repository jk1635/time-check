import React, { ChangeEvent, useEffect, useState } from "react";

import "./App.css";
import HtmlToCanvas from "./components/HtmlToCanvas";
import Popup from "./components/Popup";
import { days, initialFullDays, initialHalfDays, initialTotalWorkTimes, initialWorkTimes } from "./constants";
import { SummaryData, WorkTime } from "./types";
import { getInitialState, saveLocalStorage } from "./utils/localStorageUtils";
import { formatTime, calculateRestTime, calculateTotalWorkTime, calculateWorkTimeWithDayOff, convertToMinutes } from "./utils/timeUtils";

interface WorkTimeData {
    [key: string]: string;
}

const tableHeaders = ["요일", "출근 시간", "퇴근 시간", "반차", "연차", "실 근무 시간", "휴게 시간", "전체 근무 시간", "잔여 근무 시간"];

const App: React.FC = () => {
    const [workTimes, setWorkTimes] = useState<WorkTime[]>(getInitialState("workTimes", initialWorkTimes));
    const [totalWorkTimes, setTotalWorkTimes] = useState<string[]>(getInitialState("totalWorkTimes", initialTotalWorkTimes));
    const [halfDays, setHalfDays] = useState<boolean[]>(getInitialState("halfDays", initialHalfDays));
    const [fullDays, setFullDays] = useState<boolean[]>(getInitialState("fullDays", initialFullDays));

    const [remainingWorkTime, setRemainingWorkTime] = useState<string>("40:00");
    const [savedData, setSavedData] = useState<Array<string>>(getInitialState("savedData", []));
    const [summaryTable, setSummaryTable] = useState<SummaryData[]>([]);
    const [capturedImageURL, setCapturedImageURL] = useState<string>();
    const [showKakaoShareList, setShowKakaoShareList] = useState(false);

    useEffect(() => {
        saveLocalStorage("workTimes", workTimes);
        saveLocalStorage("totalWorkTimes", totalWorkTimes);
        saveLocalStorage("halfDays", halfDays);
        saveLocalStorage("fullDays", fullDays);
        saveLocalStorage("savedData", savedData);
    }, [workTimes, totalWorkTimes, halfDays, fullDays, savedData]);

    useEffect(() => {
        let totalRealWorkTimeMinute = 0;

        workTimes.forEach((_, index) => {
            totalRealWorkTimeMinute += convertToMinutes(calculateRealWorkTime(index));
        });

        const remainingWorkTimeMinute = convertToMinutes("40:00") - totalRealWorkTimeMinute;

        setRemainingWorkTime(formatTime(remainingWorkTimeMinute));
    }, [totalWorkTimes, halfDays, fullDays, workTimes]);

    const handleTimeChange = (dayIndex: number, type: keyof WorkTime, event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isValidValue = inputValue && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(inputValue);

        const updatedWorkTimes = [...workTimes];
        updatedWorkTimes[dayIndex][type] = isValidValue ? inputValue : "0:00";
        const hasValidTimes = updatedWorkTimes[dayIndex].start !== "0:00" && updatedWorkTimes[dayIndex].end !== "0:00";

        const totalWorkTime = hasValidTimes
            ? calculateTotalWorkTime(updatedWorkTimes[dayIndex].start, updatedWorkTimes[dayIndex].end)
            : "00:00";

        const updatedTotalTimes = [...totalWorkTimes];
        updatedTotalTimes[dayIndex] = totalWorkTime;

        setWorkTimes(updatedWorkTimes);
        setTotalWorkTimes(updatedTotalTimes);
    };

    const handleDayOffChange = (type: "half" | "full", dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const currentDayStatus = type === "half" ? halfDays : fullDays;
        const updatedDayStatus = [...currentDayStatus];
        updatedDayStatus[dayIndex] = event.target.checked;

        const setDaysFunction = type === "half" ? setHalfDays : setFullDays;
        setDaysFunction(updatedDayStatus);

        saveLocalStorage(`${type}Days`, updatedDayStatus);
    };

    const handleClearInputs = () => {
        setWorkTimes(initialWorkTimes);
        setTotalWorkTimes(initialTotalWorkTimes);
        setHalfDays(initialHalfDays);
        setFullDays(initialFullDays);

        saveLocalStorage("workTimes", initialWorkTimes);
        saveLocalStorage("totalWorkTimes", initialTotalWorkTimes);
        saveLocalStorage("halfDays", initialHalfDays);
        saveLocalStorage("fullDays", initialFullDays);
        window.location.reload();
    };

    const handleSave = () => {
        const data = createWorkTimeData();
        setSavedData(prevData => [JSON.stringify(data, null, 2), ...prevData]);
    };

    const handleDelete = (index: number) => {
        setSavedData(prevData => prevData.filter((_, i) => i !== index));
    };

    const handleCapture = (url: string) => {
        setCapturedImageURL(url);
    };

    const handleShareTable = async () => {
        const workTimeData = createWorkTimeData();

        const daysOrder = ["월", "화", "수", "목", "금", "잔여 근무 시간"];
        const mergedData: SummaryData[] = daysOrder.map((day, index) => {
            if (day !== "잔여 근무 시간") {
                return {
                    day,
                    start: workTimes[index]?.start || "",
                    end: workTimes[index]?.end || "",
                    total: workTimeData[day] || "00:00",
                };
            }
            return {
                day: "잔여 근무 시간",
                total: workTimeData["잔여 근무 시간"],
            };
        });

        setSummaryTable(mergedData);
        setShowKakaoShareList(prevState => !prevState);
    };

    const calculateRealWorkTime = (dayIndex: number) => {
        let totalWorkTime = totalWorkTimes[dayIndex];
        const restTime = calculateRestTime(workTimes[dayIndex]?.start || "0:00", workTimes[dayIndex]?.end || "0:00");

        if (halfDays[dayIndex]) {
            totalWorkTime = calculateWorkTimeWithDayOff(totalWorkTime, "04:00");
        }

        if (fullDays[dayIndex]) {
            totalWorkTime = calculateWorkTimeWithDayOff(totalWorkTime, "08:00");
        }

        const totalWorkTimeMinutes = convertToMinutes(totalWorkTime);
        const restTimeMinutes = convertToMinutes(restTime);

        const realWorkTimeMinutes = totalWorkTimeMinutes - restTimeMinutes;

        return formatTime(realWorkTimeMinutes);
    };

    const createWorkTimeData = () => {
        const data: WorkTimeData = {};

        days.forEach((day, index) => {
            const realWorkTime = calculateRealWorkTime(index);
            const dayStatus = [];

            if (halfDays[index]) {
                dayStatus.push("반차");
            }

            if (fullDays[index]) {
                dayStatus.push("연차");
            }

            data[day] = dayStatus.length ? `${realWorkTime} (${dayStatus.join("/")})` : realWorkTime;
        });

        data["잔여 근무 시간"] = convertToMinutes(remainingWorkTime) < 0 ? "근무시간초과" : `${remainingWorkTime}`;

        return data;
    };

    const weeklyTimeStatus = convertToMinutes(remainingWorkTime) < 0 ? "근무시간초과" : remainingWorkTime;

    return (
        <div className="container">
            <Popup />
            <div className="info">
                <a href="sample.png" target="_blank" rel="noopener noreferrer">
                    <span className="material-symbols-outlined">info</span>
                </a>
            </div>
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
                                        {j === 0 ? days[i] : null}
                                        {j === 1 && (
                                            <input
                                                type="text"
                                                className="text-input"
                                                placeholder="출근시간"
                                                defaultValue={workTimes[i] ? workTimes[i].start : ""}
                                                onChange={event => handleTimeChange(i, "start", event)}
                                            />
                                        )}
                                        {j === 2 && (
                                            <input
                                                type="text"
                                                className="text-input"
                                                placeholder="퇴근시간"
                                                defaultValue={workTimes[i] ? workTimes[i].end : ""}
                                                onChange={event => handleTimeChange(i, "end", event)}
                                            />
                                        )}
                                        {j === 3 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name={`halfDay-${i}`}
                                                id={`halfDay-${i}`}
                                                checked={halfDays[i]}
                                                onChange={event => handleDayOffChange("half", i, event)}
                                            />
                                        ) : null}
                                        {j === 4 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name={`fullDay-${i}`}
                                                id={`fullDay-${i}`}
                                                checked={fullDays[i]}
                                                onChange={event => handleDayOffChange("full", i, event)}
                                            />
                                        ) : null}
                                        {j === 5 ? calculateRealWorkTime(i) : null}
                                        {j === 6 ? calculateRestTime(workTimes[i].start, workTimes[i].end) : null}
                                        {j === 7 ? totalWorkTimes[i] : null}
                                        {j === 8 && i === 0 ? weeklyTimeStatus : null}
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
                    <HtmlToCanvas savedData={summaryTable} onCapture={handleCapture} capturedImageURL={capturedImageURL} />
                </div>
            )}
            {savedData.map((savedItem, index) => (
                <div className="data-wrapper">
                    <pre>{savedItem}</pre>
                    <button className="outline-button" onClick={() => handleDelete(index)}>
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
};

export default App;
