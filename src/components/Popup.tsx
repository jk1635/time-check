import React, { useEffect, useState } from "react";

import styled from "@emotion/styled";

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
            <ModalOverlay />
            <PopupWrapper>
                <span>
                    안녕하세요. 베일리입니다.
                    <br />
                    버그를 발견하시면 개인적으로 연락 부탁드립니다.
                    <br />
                </span>
                <CloseComment>
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
                </CloseComment>
            </PopupWrapper>
        </>
    );
};

const PopupWrapper = styled.div`
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    width: 300px;
    height: 200px;
    border: 1px solid #eaeef4;
    border-radius: 5px;
    background-color: #ffffff;
    font-size: 14px;
    z-index: 1000;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(234, 238, 244, 0.4);
    z-index: 999;
`;

const CloseComment = styled.div`
    display: flex;
    justify-content: flex-end;

    .material-symbols-outlined {
        cursor: pointer;
        font-size: 18px;
    }
`;

// const CheckboxWrapper = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;
//
// const CloseCheckbox = styled.input`
//     width: 12px;
//     height: 12px;
//     cursor: pointer;
// `;
//
// const CloseLabel = styled.label`
//     font-size: 11px;
// `;

export default Popup;
