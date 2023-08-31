import React, { useEffect } from "react";

declare global {
    interface Window {
        Kakao: any;
    }
}

const appKey = process.env.REACT_APP_KAKAO_SHARE_KEY;

const KakaoShareList = ({ title = "", description = "", imageUrl = "" }) => {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(appKey);
        }
    }, []);

    const share = (title: string, description: string, imageUrl: string) => {
        if (window.Kakao) {
            const kakao = window.Kakao;
            if (!kakao.isInitialized()) {
                kakao.init(appKey);
            }
            kakao.Link.sendDefault({
                objectType: "feed",
                content: {
                    title: title,
                    description: description,
                    imageUrl: imageUrl,
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
            {/* <button
                className="kakao-button"
                onClick={() => share(title, description, imageUrl)}
            >
                <img alt="" src="/kakao.png" width="15px" />
                <span style={{ paddingLeft: "5px" }}>카카오 공유</span>
            </button> */}
            <button
                className="default-button"
                onClick={() => share(title, description, imageUrl)}
            >
                2. 카카오 공유
            </button>
        </div>
    );
};

export default KakaoShareList;
