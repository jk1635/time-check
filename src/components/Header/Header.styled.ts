import styled from "@emotion/styled";

const InfoContainer = styled.header`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
`;

const IconButton = styled.button`
    position: relative;
    padding: 4px;
    min-width: 0;
    height: 30px;
    border: none;
    background-color: transparent;
    cursor: pointer;

    .material-symbols-outlined {
        color: #0a2c4c;
        font-size: 20px;
    }

    &:hover .material-symbols-outlined {
        color: #eaeef4;
    }
`;

export { InfoContainer, IconButton };
