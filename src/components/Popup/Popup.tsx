import React, { useEffect, useState } from "react";

import * as S from "./Popup.styled";

const Popup = () => {
    const [showPopup, setShowPopup] = useState(false);
    // const [neverShowAgain, setNeverShowAgain] = useState(false);
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
        // if (neverShowAgain) {}
        localStorage.setItem("hidePopup", "true");
        setShowPopup(false);
    };

    // const handleCheckboxChange = () => {
    //     setNeverShowAgain(prevState => !prevState);
    // };

    if (!showPopup) {
        return null;
    }

    return (
        <>
            <S.ModalOverlay />
            <S.PopupWrapper>
                <span>
                    안녕하세요. 베일리입니다.
                    <br />
                    버그를 발견하시면 개인적으로 연락부탁드립니다.
                    <br />
                </span>
                <S.CloseComment>
                    {/* <CheckboxWrapper> */}
                    {/*    <CloseCheckbox */}
                    {/*        type="checkbox" */}
                    {/*        className="close-checkbox" */}
                    {/*        id="never-show-again" */}
                    {/*        checked={neverShowAgain} */}
                    {/*        onChange={handleCheckboxChange} */}
                    {/*    /> */}
                    {/*    <CloseLabel htmlFor="never-show-again">다시 보지 않기</CloseLabel> */}
                    {/* </CheckboxWrapper> */}
                    <span
                        role="button"
                        tabIndex={0}
                        className="material-symbols-outlined"
                        onClick={handleClose}
                        style={{ cursor: "pointer", fontSize: "18px" }}
                    >
                        close
                    </span>
                </S.CloseComment>
            </S.PopupWrapper>
        </>
    );
};

export default Popup;
