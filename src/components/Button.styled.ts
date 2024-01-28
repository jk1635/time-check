import styled from "@emotion/styled";

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

export { DefaultButton, OutlineButton };
