import { useEffect, useState } from "react";

function getSavedValue<T>(key: string, initialValue: T): T {
    const savedValue = localStorage.getItem(key);
    if(savedValue)
        return JSON.parse(savedValue);

    if(initialValue instanceof Function)
        return initialValue();

    return initialValue;
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(() => getSavedValue<T>(key, initialValue));

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}

export default useLocalStorage;