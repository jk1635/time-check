import { WorkTime } from "../types";

export const getInitialState: <T>(key: string, initialValue: T) => T = (key, initialValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
};

export const saveLocalStorage = (key: string, data: Array<string | boolean | WorkTime>) => {
    localStorage.setItem(key, JSON.stringify(data));
};
