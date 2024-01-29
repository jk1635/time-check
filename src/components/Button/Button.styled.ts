import styled from "@emotion/styled";

const ButtonWrapper = styled.section`
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    margin-bottom: 24px;
    gap: 5px;
`;

const BaseButton = styled.button`
    padding: 0 15px;
    min-width: 80px;
    height: 40px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
`;

const DefaultButton = styled(BaseButton)`
    border: none;
    color: #ffffff;
    background-color: #0a2c4c;
`;

const OutlineButton = styled(BaseButton)`
    border: 1px solid #d7e4e6;
    background-color: transparent;
`;

const KakaoButton = styled(BaseButton)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 135px;
    border: none;
    color: #000000;
    background-color: #fee500;

    img {
        width: 15px;
        padding-right: 5px;
    }
`;

export { DefaultButton, OutlineButton, ButtonWrapper, KakaoButton };
