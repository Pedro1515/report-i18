import React, { useState, useCallback, useEffect } from "react";

export const useInputValue = (initialValue: string) => {
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
};

export const useModal = () => {
  const [visibility, setVisibility] = useState(false);
  const toggle = useCallback(() => setVisibility(!visibility), [visibility]);

  return {
    visibility,
    toggle,
  };
};

export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
