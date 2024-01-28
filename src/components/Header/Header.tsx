import React from "react";

import * as S from "./Header.styled";

const Header = () => {
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
        <S.InfoContainer>
            <S.IconButton onClick={copyEmail}>
                <span className="material-symbols-outlined">bug_report</span>
            </S.IconButton>
            <S.IconButton onClick={openLink}>
                <span className="material-symbols-outlined">info</span>
            </S.IconButton>
        </S.InfoContainer>
    );
};

export default Header;
