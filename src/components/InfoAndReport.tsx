import React from "react";

import styled from "@emotion/styled";

const InfoAndReport = () => {
    const copyEmail = async () => {
        const email = "jkwak1635@gmail.com";

        try {
            await navigator.clipboard.writeText(email);
            alert("메일 주소가 복사되었습니다. 버그는 해당 메일 주소로 알려주세요.");
        } catch (error) {
            alert("메일 주소 복사에 실패했습니다.");
        }
    };

    const openLink = () => {
        window.open("sample.png", "_blank", "noopener,noreferrer");
    };

    return (
        <InfoContainer>
            <IconButton onClick={copyEmail}>
                <span className="material-symbols-outlined">bug_report</span>
            </IconButton>
            <IconButton onClick={openLink}>
                <span className="material-symbols-outlined">info</span>
            </IconButton>
        </InfoContainer>
    );
};

const InfoContainer = styled.header`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
`;

const IconButton = styled.button`
    padding: 4px;
    min-width: 0;
    height: 30px;
    border: none;
    background-color: transparent;
    cursor: pointer;

    .material-symbols-outlined {
        color: #0a2c4c;
        font-size: 20px;
    }

    &:hover .material-symbols-outlined {
        color: #eaeef4;
    }
`;

export default InfoAndReport;
