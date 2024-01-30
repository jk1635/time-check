import React, { ChangeEvent } from "react";

import { TimeChange } from "../../types";

type TextInputProps = {
    type: TimeChange;
    defaultValue: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const TextInput: React.FC<TextInputProps> = ({ type, defaultValue, onChange }) => {
    return (
        <input
            type="text"
            className="text-input"
            placeholder={type === "start" ? "출근시간" : "퇴근시간"}
            defaultValue={defaultValue}
            onChange={onChange}
        />
    );
};

export default TextInput;
