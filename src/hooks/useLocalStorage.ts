import { useEffect, useState } from "react";

const PREFIX = "WhatsApp_Clone-";

export function useLocalStorage<T>(key:string, initialState:T) {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(prefixedKey);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    },
    [value, prefixedKey]
  );

  return [value, setValue];
}
