import classNames from "classnames";

export interface DotProps {
  color: string;
  className?: string;
}

export function Dot({ color, className }: DotProps) {
  return (
    <div
      className={classNames(
        "flex-shrink-0",
        "w-2",
        "h-2",
        "rounded-full",
        `bg-${color}-500`,
        className
      )}
    />
  );
}
