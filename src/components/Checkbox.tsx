import React, { ChangeEvent } from "react";

import { DayOffChange } from "../types";

type CheckboxProps = {
    type: DayOffChange;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({ type, checked, onChange }) => {
    return <input type="checkbox" className="checkbox-input" tabIndex={-1} name={type} checked={checked} onChange={onChange} />;
};

export default Checkbox;
