import React, { ChangeEvent } from "react";

import { TimeChange } from "../../types";

type TextInputProps = {
    type: TimeChange;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({ type, value, onChange }: TextInputProps) => {
    return (
        <input type="text" className="text-input" placeholder={type === "start" ? "09:00" : "18:00"} value={value} onChange={onChange} />
    );
};

export default TextInput;
