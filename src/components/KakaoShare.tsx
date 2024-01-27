import React, { useEffect } from "react";

import * as S from "./Button.styled";

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
    imageCheck: boolean;
}

const KakaoShareButton: React.FC<KakaoShareProps> = ({ title = "스케줄", description = "", imageUrl = "", imageCheck }) => {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(appKey);
        }
    }, []);

    const share = () => {
        if (!imageCheck) {
            alert("이미지를 먼저 생성해 주세요.");
        } else if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Link.sendDefault({
                objectType: "feed",
                content: { title, description, imageUrl, link: { webUrl: imageUrl, mobileWebUrl: imageUrl } },
            });
        }
    };

    return (
        <S.Button className="default-button" onClick={share}>
            2. 카카오 공유
        </S.Button>
    );
};

export default KakaoShareButton;
