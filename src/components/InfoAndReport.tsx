import React from "react";
import "./InfoAndReport.css";

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
        <div className="info">
            <button className="icon-button" onClick={copyEmail}>
                <span className="material-symbols-outlined">bug_report</span>
            </button>
            <button className="icon-button" onClick={openLink}>
                <span className="material-symbols-outlined">info</span>
            </button>
        </div>
    );
};

export default InfoAndReport;
