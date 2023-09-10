import React, { useEffect } from "react";
import "./KakaoShare.css";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Kakao: any;
    }
}

const appKey = process.env.REACT_APP_KAKAO_SHARE_KEY;

interface KakaoShareProps {
    title?: string;
    description?: string;
    imageUrl?: string;
}

const KakaoShare: React.FC<KakaoShareProps> = ({ title = "스케줄", description = "", imageUrl = "" }) => {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(appKey);
        }
    }, []);

    const share = () => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Link.sendDefault({
                objectType: "feed",
                content: {
                    title,
                    description,
                    imageUrl,
                    link: {
                        webUrl: imageUrl,
                        mobileWebUrl: imageUrl,
                    },
                },
            });
        }
    };

    return (
        <div>
            {/* <button className="kakao-button" onClick={share}>
                <img alt="" src="/kakao.png" width="15px" />
                <span style={{ paddingLeft: "5px" }}>카카오 공유</span>
            </button> */}
            <button className="default-button" onClick={share}>
                2. 카카오 공유
            </button>
        </div>
    );
};

export default KakaoShare;
