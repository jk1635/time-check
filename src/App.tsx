import React, { useEffect, useState } from "react";

import styled from "@emotion/styled";
import { inject } from "@vercel/analytics";
import { useRecoilState } from "recoil";

import ActionButtons from "./components/ActionButtons";
import HtmlToCanvas from "./components/HtmlToCanvas";
import InfoAndReport from "./components/InfoAndReport";
import Popup from "./components/Popup";
import SavedList from "./components/SavedList";
import Table from "./components/Table";
import { weekdays } from "./constants";
import useCreateSummary from "./hooks/useCreateSummary";
import { initialWorkTimesState, savedWorkTimeState, showKakaoShareState, summaryTableListState, workTimeState } from "./stores/atoms";
import { saveLocalStorage } from "./utils/localStorage";

inject();

const App: React.FC = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const [summaryTableList, setSummaryTableList] = useRecoilState(summaryTableListState);

    const [capturedImageURL, setCapturedImageURL] = useState("");
    const [showKakaoShare, setShowKakaoShare] = useRecoilState(showKakaoShareState);

    const workTimeSummary = useCreateSummary();

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
        const summaryData = workTimeSummary();
        setSavedWorkTime(prevData => [summaryData, ...prevData]);
    };

    const handleCapture = (url: string) => {
        setCapturedImageURL(url);
    };

    const handleShareTable = async () => {
        const summaryData = workTimeSummary();
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

        setSummaryTableList(mergedData);
        setShowKakaoShare(prevState => !prevState);
    };

    return (
        <Container>
            <Popup />
            <InfoAndReport />
            <main>
                <TableWrapper>
                    <Table />
                </TableWrapper>
                <ActionButtons onShareTable={handleShareTable} onClearInputs={handleClearInputs} onSave={handleSave} />
                {showKakaoShare && (
                    <HtmlToCanvas summaryTableList={summaryTableList} onCapture={handleCapture} capturedImageURL={capturedImageURL} />
                )}
                <SavedList />
            </main>
        </Container>
    );
};

const Container = styled.div`
    padding: 0 12px;
`;

const TableWrapper = styled.section`
    margin-top: 2px;
    min-width: 300px;
    overflow-x: scroll;
`;

export default App;
