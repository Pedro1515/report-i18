import classNames from "classnames";

export interface FilterLabelProps {
  children: React.ReactNode;
}

export function FilterLabel({ children }: FilterLabelProps) {
  return (
    <span
      className={classNames(
        "py-3",
        "text-left",
        "text-xs",
        "leading-4",
        "font-medium",
        "text-gray-500",
        "uppercase",
        "tracking-wider"
      )}
    >
      {children}
    </span>
  );
}
