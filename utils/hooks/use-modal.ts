import { useState, useCallback } from "react";

export function useModal() {
  const [visibility, setVisibility] = useState(false);
  const toggle = useCallback(() => setVisibility(!visibility), [visibility]);

  return {
    visibility,
    toggle,
  };
}
