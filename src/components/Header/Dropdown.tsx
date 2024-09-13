import React, { useEffect, useState } from "react";

import styled from "@emotion/styled";
import { useRecoilState } from "recoil";

import { dropdownState } from "../../stores/atoms";

type Mode = "light_mode" | "dark_mode";

const Dropdown = () => {
    const [isActive, setIsActive] = useRecoilState(dropdownState);
    const [selectedMode, setSelectedMode] = useState<Mode>("light_mode");

    const handleModeChange = (mode: "light_mode" | "dark_mode") => {
        setSelectedMode(mode);
        setIsActive(false);
    };

    useEffect(() => {
        const closeDropdown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsActive(false);
            }
        };
        document.addEventListener("keydown", closeDropdown);
        return () => {
            document.removeEventListener("keydown", closeDropdown);
        };
    }, []);

    return (
        <>
            <Trigger onClick={() => setIsActive(!isActive)} className="material-symbols-outlined">
                {selectedMode}
            </Trigger>

            {isActive && (
                <ContentContainer isActive={isActive}>
                    <Item onClick={() => handleModeChange("light_mode")} className="material-symbols-outlined">
                        light_mode
                    </Item>
                    <Item onClick={() => handleModeChange("dark_mode")} className="material-symbols-outlined">
                        dark_mode
                    </Item>
                </ContentContainer>
            )}
        </>
    );
};

const Trigger = styled.span`
    &:hover {
        color: #eaeef4;
    }
`;

const ContentContainer = styled.div<{ isActive: boolean }>`
    visibility: ${({ isActive }) => (isActive ? "visible" : "hidden")};
    position: absolute;
    top: 100%;
    left: 50%;
    width: 4rem;
    margin-top: 0.2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 14px 6px rgba(151, 151, 151, 0.15);
    background-color: white;
    transform: translateX(-50%);
`;

const Item = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    padding: 0.25rem;
    border-bottom: 1px solid #eaeef4;
    font-size: 14px;
    text-decoration: none;

    &:hover {
        background-color: rgb(248, 250, 252, 0.5);
    }
`;

export default Dropdown;
