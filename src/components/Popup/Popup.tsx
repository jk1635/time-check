import React, { useEffect, useState } from "react";

import { useRecoilState } from "recoil";

import * as S from "./Popup.styled";
import { showPopupState } from "../../stores/atoms";

const Popup = () => {
    const [showPopup, setShowPopup] = useRecoilState(showPopupState);
    const [neverShowAgain, setNeverShowAgain] = useState(false);
    const [scrollPosition, setScrollPosition] = useState<number>(0);

    useEffect(() => {
        const hide = localStorage.getItem("hidePopup");
        if (!hide) {
            setShowPopup(true);
        }
    }, []);

    useEffect(() => {
        if (showPopup) {
            setScrollPosition(window.scrollY);
            window.scrollTo(0, 0);
            document.body.style.overflow = "hidden";
        } else {
            window.scrollTo(0, scrollPosition);
            document.body.style.overflow = "auto";
        }
    }, [showPopup]);

    const handleClose = () => {
        if (neverShowAgain) {
            localStorage.setItem("hidePopup", "true");
            setShowPopup(false);
        }
        setShowPopup(false);
    };

    const handleCheckboxChange = () => {
        setNeverShowAgain(prevState => !prevState);
    };

    if (!showPopup) {
        return null;
    }

    return (
        <>
            <S.ModalOverlay />
            <S.PopupWrapper>
                <S.FlexBox>
                    <span>
                        안녕하세요. 베일리입니다.
                        <br />
                        시간 계산 기능이 전체적으로 업데이트되었습니다.
                        <br />
                        버그가 발견되면, 메일로 연락 부탁드립니다.
                        <br />
                    </span>
                    <span role="button" tabIndex={0} className="material-symbols-outlined" onClick={handleClose}>
                        close
                    </span>
                </S.FlexBox>
                <S.CloseComment>
                    <S.CheckboxWrapper>
                        <S.CloseCheckbox type="checkbox" id="never-show-again" checked={neverShowAgain} onChange={handleCheckboxChange} />
                        <S.CloseLabel htmlFor="never-show-again">다시 보지 않기</S.CloseLabel>
                    </S.CheckboxWrapper>
                </S.CloseComment>
            </S.PopupWrapper>
        </>
    );
};

export default Popup;
