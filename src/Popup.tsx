import React, { useState, useEffect } from "react";
import "./Popup.css";

const Popup = () => {
    const [showPopup, setShowPopup] = useState(false);
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
            <div className="modal-overlay" />
            <div className="popup-wrapper">
                <span>
                    안녕하세요. 베일리입니다.
                    <br />
                    버그를 발견하시면 개인적으로 연락 부탁드립니다.
                    <br />
                </span>
                <div className="close-comment">
                    <div className="input-wrapper">
                        <input
                            type="checkbox"
                            className="close-checkbox"
                            id="never-show-again"
                            checked={neverShowAgain}
                            onChange={handleCheckboxChange}
                        />
                        <label className="close-label" htmlFor="never-show-again">
                            다시 보지 않기
                        </label>
                    </div>

                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <span className="material-symbols-outlined" onClick={handleClose} style={{ cursor: "pointer", fontSize: "18px" }}>
                        close
                    </span>
                </div>
            </div>
        </>
    );
};

export default Popup;
