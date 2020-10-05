import { Dot } from "./dot";
import classNames from "classnames";
import { m } from "framer-motion";

export interface BadgeProps {
  label: string;
  color: string;
  IconComponent?: React.ReactNode;
  uppercase?: boolean;
  className?: string;
}

export function Badge({
  label,
  color,
  IconComponent,
  uppercase = true,
  className,
}: BadgeProps) {
  return (
    <span
      className={classNames(
        "px-2",
        "py-px",
        "inline-flex",
        "text-xs",
        "leading-5",
        "font-semibold",
        "rounded-full",
        `bg-${color}-100`,
        `text-${color}-800`,
        "tracking-wide",
        "items-center",
        { uppercase: uppercase },
        className
      )}
    >
      {IconComponent ? IconComponent : <Dot {...{ color }} className="mr-2" />}
      {label}
    </span>
  );
}
