import React, { useEffect } from "react";

import styled from "@emotion/styled";
import { inject } from "@vercel/analytics";
import { useRecoilState } from "recoil";

import ActionButtons from "./components/ActionButtons";
import HtmlToCanvas from "./components/HtmlToCanvas";
import InfoAndReport from "./components/InfoAndReport";
import Popup from "./components/Popup";
import SavedList from "./components/SavedList";
import Table from "./components/Table";
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
            <InfoAndReport />
            <main>
                <TableWrapper>
                    <Table />
                </TableWrapper>
                <ActionButtons />
                {showKakaoShare && <HtmlToCanvas />}
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
