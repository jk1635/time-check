/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from "react";

import "./App.css";
import HtmlToCanvas, { SummaryData } from "./HtmlToCanvas";
import Popup from "./Popup";
import {
    getInitialState,
    saveLocalStorage,
    formatTime,
    calculateRestTime,
    calculateTotalWorkTime,
    calculateWorkTimeWithLeave,
    convertToMinutes,
} from "./utils";

interface WorkTime {
    start: string;
    end: string;
}

declare global {
    interface Window {
        Kakao: any;
    }
}

const App: React.FC = () => {
    const days = ["월", "화", "수", "목", "금"];

    const [workTimes, setWorkTimes] = useState<WorkTime[]>(
        getInitialState(
            "workTimes",
            Array.from({ length: 5 }, () => ({ start: "", end: "" })),
        ),
    );
    const [totalWorkTimes, setTotalWorkTimes] = useState<string[]>(
        getInitialState(
            "totalWorkTimes",
            Array.from({ length: 5 }, () => "00:00"),
        ),
    );
    const [halfDays, setHalfDays] = useState<boolean[]>(
        getInitialState(
            "halfDays",
            Array.from({ length: 5 }, () => false),
        ),
    );
    const [fullDays, setFullDays] = useState<boolean[]>(
        getInitialState(
            "fullDays",
            Array.from({ length: 5 }, () => false),
        ),
    );
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
    }, [workTimes, totalWorkTimes, halfDays, fullDays]);

    useEffect(() => {
        saveLocalStorage("savedData", savedData);
    }, [savedData]);

    useEffect(() => {
        let totalRealWorkTimeMins = 0;

        for (let i = 0; i < 5; i += 1) {
            totalRealWorkTimeMins += convertToMinutes(calculateRealWorkTime(i));
        }

        const remainingWorkTimeMins = convertToMinutes("40:00") - totalRealWorkTimeMins;

        setRemainingWorkTime(formatTime(remainingWorkTimeMins));
    }, [totalWorkTimes, halfDays, fullDays, workTimes]);

    const handleHalfDayChange = (dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const newHalfDays = [...halfDays];
        newHalfDays[dayIndex] = event.target.checked;
        setHalfDays(newHalfDays);
        saveLocalStorage("halfDays", newHalfDays);
    };

    const handleFullDayChange = (dayIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const newFullDays = [...fullDays];
        newFullDays[dayIndex] = event.target.checked;
        setFullDays(newFullDays);
        saveLocalStorage("fullDays", newFullDays);
    };

    const handleTimeChange = (dayIndex: number, type: keyof WorkTime, event: ChangeEvent<HTMLInputElement>) => {
        const timeInput = event.target.value;
        const isValidTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeInput);

        const time = isValidTime && timeInput !== "" ? timeInput : "0:00";

        const updatedWorkTimes = [...workTimes];
        updatedWorkTimes[dayIndex][type] = time;

        let updatedTotalWorkTime = "00:00";
        if (updatedWorkTimes[dayIndex].start !== "0:00" && updatedWorkTimes[dayIndex].end !== "0:00") {
            updatedTotalWorkTime = calculateTotalWorkTime(updatedWorkTimes[dayIndex].start, updatedWorkTimes[dayIndex].end);
        }

        const updatedTotalWorkTimes = [...totalWorkTimes];
        updatedTotalWorkTimes[dayIndex] = updatedTotalWorkTime;

        setWorkTimes(updatedWorkTimes);
        setTotalWorkTimes(updatedTotalWorkTimes);
    };

    const handleClearAllInputs = () => {
        const initialWorkTimes = Array.from({ length: 5 }, () => ({
            start: "",
            end: "",
        }));
        const initialTotalWorkTimes = Array.from({ length: 5 }, () => "00:00");
        const initialHalfDays = Array.from({ length: 5 }, () => false);
        const initialFullDays = Array.from({ length: 5 }, () => false);

        setWorkTimes(initialWorkTimes);
        setTotalWorkTimes(initialTotalWorkTimes);
        setHalfDays(initialHalfDays);
        setFullDays(initialFullDays);
        setRemainingWorkTime("40:00");

        saveLocalStorage("workTimes", initialWorkTimes);
        saveLocalStorage("totalWorkTimes", initialTotalWorkTimes);
        saveLocalStorage("halfDays", initialHalfDays);
        saveLocalStorage("fullDays", initialFullDays);
        window.location.reload();
    };

    const handleSave = () => {
        const data: any = createWorkTimeData();
        setSavedData(prevData => [data, ...prevData]);
    };

    const handleDelete = (index: number) => {
        setSavedData(prevData => prevData.filter((_, i) => i !== index));
    };

    const handleCapture = (url: string) => {
        setCapturedImageURL(url);
    };

    const handleWorkTime = async () => {
        const workTimeData = JSON.parse(createWorkTimeData());

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
            totalWorkTime = calculateWorkTimeWithLeave(totalWorkTime, "04:00");
        }

        if (fullDays[dayIndex]) {
            totalWorkTime = calculateWorkTimeWithLeave(totalWorkTime, "08:00");
        }

        const totalWorkTimeMins = convertToMinutes(totalWorkTime);
        const restTimeMins = convertToMinutes(restTime);

        const realWorkTimeMins = totalWorkTimeMins - restTimeMins;

        return formatTime(realWorkTimeMins);
    };

    const createWorkTimeData = () => {
        const data: any = {};

        days.forEach((day, index) => {
            let dayData = `${calculateRealWorkTime(index)}`;
            if (halfDays[index]) {
                dayData += " (반차)";
            }
            if (fullDays[index]) {
                dayData += " (연차)";
            }
            data[day] = dayData;
        });

        data["잔여 근무 시간"] = convertToMinutes(remainingWorkTime) < 0 ? "근무시간초과" : remainingWorkTime;

        return JSON.stringify(data, null, 2);
    };

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
                            {Array.from({ length: 10 }, (_, j) => (
                                <th key={j}>
                                    {j === 0 ? "요일" : null}
                                    {j === 1 ? "출근 시간" : null}
                                    {j === 2 ? "퇴근 시간" : null}
                                    {j === 3 ? "반차" : null}
                                    {j === 4 ? "연차" : null}
                                    {j === 5 ? "실 근무 시간" : null}
                                    {j === 6 ? "휴게 시간" : null}
                                    {j === 7 ? "전체 근무 시간" : null}
                                    {j === 8 ? "잔여 근무 시간" : null}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }, (_, i) => (
                            <tr key={i}>
                                {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
                                {Array.from({ length: 10 }, (_, j) => (
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
                                                onChange={event => handleHalfDayChange(i, event)}
                                            />
                                        ) : null}
                                        {j === 4 ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name={`fullDay-${i}`}
                                                id={`fullDay-${i}`}
                                                checked={fullDays[i]}
                                                onChange={event => handleFullDayChange(i, event)}
                                            />
                                        ) : null}
                                        {j === 5 ? calculateRealWorkTime(i) : null}
                                        {j === 6 ? calculateRestTime(workTimes[i].start, workTimes[i].end) : null}
                                        {j === 7 ? totalWorkTimes[i] : null}
                                        {/* eslint-disable-next-line no-nested-ternary */}
                                        {j === 8 && i === 0
                                            ? convertToMinutes(remainingWorkTime) < 0
                                                ? "근무시간초과"
                                                : remainingWorkTime
                                            : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="button-wrapper">
                <button className="outline-button" onClick={handleWorkTime}>
                    {showKakaoShareList ? "닫기" : "공유"}
                </button>
                <button className="outline-button" onClick={handleClearAllInputs}>
                    초기화
                </button>
                <button className="default-button" onClick={handleSave}>
                    저장
                </button>
            </div>
            {showKakaoShareList && (
                <div
                    style={{
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            right: "0%",
                        }}
                    >
                        <HtmlToCanvas savedData={summaryTable} onCapture={handleCapture} capturedImageURL={capturedImageURL} />
                    </div>
                </div>
            )}
            {savedData.map((data, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="data-wrapper" key={index}>
                    <pre>{data}</pre>
                    <button className="outline-button" onClick={() => handleDelete(index)}>
                        삭제
                    </button>
                </div>
            ))}
        </div>
    );
};

export default App;
