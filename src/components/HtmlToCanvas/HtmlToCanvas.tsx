import React, { useEffect, useRef, useState } from "react";

import html2canvas from "html2canvas";
import { useRecoilState } from "recoil";

import * as S from "./HtmlToCanvas.styled";
import useCloudUploader from "../../hooks/useCloudUploader";
import { summaryTableListState } from "../../stores/atoms";
import * as BS from "../Button/Button.styled";
import SummaryTable from "../Table/SummaryTable";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Kakao: any;
    }
}

const HtmlToCanvas = () => {
    const tableRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [summaryTableList] = useRecoilState(summaryTableListState);
    const { uploadCloud } = useCloudUploader();

    const appKey = process.env.REACT_APP_KAKAO_SHARE_KEY;

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(appKey);
        }
    }, [appKey]);

    const shareKakao = (uploadedUrl: string) => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Link.sendDefault({
                objectType: "feed",
                content: {
                    title: "스케줄",
                    description: "",
                    imageUrl: uploadedUrl,
                    link: {
                        webUrl: uploadedUrl,
                        mobileWebUrl: uploadedUrl,
                    },
                },
            });
        }
    };

    const captureAndShare = async () => {
        setIsLoading(true);

        try {
            if (tableRef.current) {
                const canvas = await html2canvas(tableRef.current);
                const blob = await new Promise<Blob | null>(resolve => {
                    canvas.toBlob(result => {
                        resolve(result);
                    });
                });

                if (blob) {
                    const uploadedUrl = await uploadCloud(blob);
                    shareKakao(uploadedUrl);
                }
            }
        } catch (error) {
            console.error(error);
        }

        setIsLoading(false);
    };

    return (
        <S.CanvasWrapper>
            <S.SummaryContainer>
                {summaryTableList.length > 0 && <SummaryTable ref={tableRef} summaryTableList={summaryTableList} />}
                <S.ButtonWrapper>
                    <BS.KakaoButton onClick={captureAndShare}>
                        <img alt="" src="/kakao.png" />
                        {isLoading ? "이미지 생성 중.." : "카카오 공유하기"}
                    </BS.KakaoButton>
                </S.ButtonWrapper>
            </S.SummaryContainer>
        </S.CanvasWrapper>
    );
};

export default HtmlToCanvas;
