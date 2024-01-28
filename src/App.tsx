import React, { useEffect } from "react";

import styled from "@emotion/styled";
import { inject } from "@vercel/analytics";
import { useRecoilState } from "recoil";

import { ActionButtons } from "./components/Button";
import { Header } from "./components/Header";
import { HtmlToCanvas } from "./components/HtmlToCanvas";
import { Popup } from "./components/Popup";
import { Table } from "./components/Table";
import { TimeLogs } from "./components/TimeLogs";
import { savedWorkTimeState, showKakaoShareState, workTimeState } from "./stores/atoms";
import { saveLocalStorage } from "./utils/localStorage";

inject();

const App: React.FC = () => {
    const [workTime] = useRecoilState(workTimeState);
    const [savedWorkTime] = useRecoilState(savedWorkTimeState);
    const [showKakaoShare] = useRecoilState(showKakaoShareState);

    useEffect(() => {
        saveLocalStorage("workTime", workTime);
        saveLocalStorage("savedWorkTime", savedWorkTime);
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
        </Container>
    );
};

const Container = styled.div`
    padding: 0 12px;
`;

export default App;
