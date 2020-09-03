import classNames from "classnames";

export interface BadgeProps {
  label: string;
  color: string;
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className={classNames(
        "px-2",
        "inline-flex",
        "text-xs",
        "leading-5",
        "font-semibold",
        "rounded-full",
        `bg-${color}-100`,
        `text-${color}-800`
      )}
    >
      {label}
    </span>
  );
}
