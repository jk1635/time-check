import React, { useEffect } from "react";

declare global {
    interface Window {
        Kakao: any;
    }
}

const appKey = process.env.REACT_APP_KAKAO_SHARE_KEY;

const KakaoShareList = ({
    title = "스케줄",
    description = "",
    imageUrl = "",
}) => {
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
                    {/* <button */}
                {/*    className="kakao-button" */}
                {/*    style={{ */}
                {/*        display: "flex", */}
                {/*        justifyContent: "space-between", */}
                {/*        alignItems: "center", */}
                {/*    }} */}
                {/*    onClick={() => share(title, description, imageUrl)} */}
                {/* > */}
                {/*    <img alt="" src="/kakao.png" width="15px" /> */}
                {/*    <span style={{ paddingLeft: "5px" }}>카카오 공유</span> */}
                {/* </button> */}
        </div>
    );
};

export default KakaoShareList;
