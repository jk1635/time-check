import React from "react";

import { track } from "@vercel/analytics";
import { reportValue } from "@vercel/flags";
import { useRecoilState } from "recoil";

import Dropdown from "./Dropdown";
import * as S from "./Header.styled";
import i18next from "../../lang/i18n";
import { langState, showPopupState } from "../../stores/atoms";
import { saveLocalStorage } from "../../utils/localStorage";
import { Circle } from "../Circle";

const Header = () => {
    const [language, setLanguage] = useRecoilState(langState);
    const [showPopup] = useRecoilState(showPopupState);

    const toggleLanguage = () => {
        const newLang = language === "ko" ? "en" : "ko";
        i18next.changeLanguage(newLang);
        setLanguage(newLang);
        saveLocalStorage("language", newLang);
        reportValue("language", newLang);
        track("language", {
            category: "language",
            action: `change language to ${newLang}`,
        });
    };

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
            {/* <S.IconButton> */}
            {/*    <Dropdown /> */}
            {/* </S.IconButton> */}
            <S.IconButton onClick={toggleLanguage}>
                <span className="material-symbols-outlined icon">language</span>
            </S.IconButton>
            <S.IconButton onClick={copyEmail}>
                {showPopup && <Circle />}
                <span className="material-symbols-outlined icon">bug_report</span>
            </S.IconButton>
            <S.IconButton onClick={openLink}>
                <span className="material-symbols-outlined icon">info</span>
            </S.IconButton>
        </S.InfoContainer>
    );
};

export default Header;
