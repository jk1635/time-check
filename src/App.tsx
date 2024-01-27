import React, { useEffect, useState } from "react";

import { inject } from "@vercel/analytics";
import "./App.css";
import { useRecoilState, useRecoilValue } from "recoil";

import HtmlToCanvas from "./components/HtmlToCanvas";
import InfoAndReport from "./components/InfoAndReport";
import Popup from "./components/Popup";
import Table from "./components/Table";
import { weekdays } from "./constants";
import { initialWorkTimesState, savedWorkTimeState, summaryTableState, workTimeState } from "./stores/atoms";
import { overtimeStatusSelector, realWorkTimeMinutesSelector } from "./stores/selectors";
import { WeeklySummary } from "./types";
import { saveLocalStorage } from "./utils/localStorageUtils";
import { minutesToTime } from "./utils/timeUtils";

inject();

const App: React.FC = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const [summaryTable, setSummaryTable] = useRecoilState(summaryTableState);

    const realWorkTimeMinutes = useRecoilValue(realWorkTimeMinutesSelector);
    const overtime = useRecoilValue(overtimeStatusSelector);

    const [capturedImageURL, setCapturedImageURL] = useState("");
    const [showKakaoShareList, setShowKakaoShareList] = useState(false);

    useEffect(() => {
        saveLocalStorage("workTime", workTime);
        saveLocalStorage("savedWorkTime", savedWorkTime);
    }, [workTime, savedWorkTime]);

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
                <Table />
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
