import React, { useState, useCallback } from "react";

export function useInputValue(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    [value]
  );
  const clear = () => setValue("");

  return {
    value,
    onChange,
    clear,
    setValue,
  };
}
