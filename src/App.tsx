import React, { useEffect } from "react";

import styled from "@emotion/styled";
import { inject } from "@vercel/analytics";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useRecoilState } from "recoil";

import { ActionButtons } from "./components/Button";
import { Header } from "./components/Header";
import { HtmlToCanvas } from "./components/HtmlToCanvas";
import { Popup } from "./components/Popup";
import { Table } from "./components/Table";
import { TimeLogs } from "./components/TimeLogs";
import { savedWorkTimeState, showKakaoShareState, workTimeState } from "./stores/atoms";
import { OldWorkTime } from "./types";
import { saveLocalStorage } from "./utils/localStorage";

inject();

const App: React.FC = () => {
    const [workTime, setWorkTime] = useRecoilState(workTimeState);
    const [savedWorkTime, setSavedWorkTime] = useRecoilState(savedWorkTimeState);
    const [showKakaoShare] = useRecoilState(showKakaoShareState);

    const hasMigrated = JSON.parse(localStorage.getItem("hasMigrated") || "false");

    const migrateData = () => {
        localStorage.removeItem("hidePopup");

        const oldWorkTimes = JSON.parse(localStorage.getItem("workTimes") || "[]");
        const oldHalfDays = JSON.parse(localStorage.getItem("halfDays") || "[]");
        const oldFullDays = JSON.parse(localStorage.getItem("fullDays") || "[]");
        const oldTotalWorkTimes = JSON.parse(localStorage.getItem("totalWorkTimes") || "[]");
        const oldSavedData = JSON.parse(localStorage.getItem("savedData") || "[]");

        if (oldWorkTimes.length > 0 && oldFullDays.length > 0 && oldHalfDays.length > 0 && oldTotalWorkTimes.length > 0) {
            const newWorkTime = oldWorkTimes.map((item: OldWorkTime, index: number) => ({
                start: item.start,
                end: item.end,
                total: oldTotalWorkTimes[index],
                halfDay: oldHalfDays[index],
                fullDay: oldFullDays[index],
            }));

            setWorkTime(newWorkTime);
            saveLocalStorage("workTime", newWorkTime);
        }

        if (oldSavedData.length > 0) {
            const newSavedWorkTime = oldSavedData.map((item: string) => JSON.parse(item));

            setSavedWorkTime(newSavedWorkTime);
            saveLocalStorage("savedWorkTime", newSavedWorkTime);
        }

        localStorage.removeItem("fullDays");
        localStorage.removeItem("halfDays");
        localStorage.removeItem("totalWorkTimes");
        localStorage.removeItem("workTimes");
        localStorage.removeItem("savedData");
        localStorage.setItem("hasMigrated", "true");
    };

    useEffect(() => {
        if (!hasMigrated) {
            migrateData();
        } else {
            saveLocalStorage("workTime", workTime);
            saveLocalStorage("savedWorkTime", savedWorkTime);
        }
    }, [workTime, savedWorkTime]);

    return (
        <Container>
            <Popup />
            <Header />
            <main>
                <Table />
                <ActionButtons />
                {showKakaoShare && <HtmlToCanvas />}
                <TimeLogs />
            </main>
            <SpeedInsights />
        </Container>
    );
};

const Container = styled.div`
    padding: 0 12px;
`;

export default App;
