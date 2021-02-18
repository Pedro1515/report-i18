import React from "react";
import classNames from "classnames";

export interface MenuItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  selected?: boolean;
}

export function MenuItem({ label, selected, ...props }: MenuItemProps) {
  return (
    <a
      // href="#"
      className={classNames(
        "block",
        "px-4",
        "py-2",
        "text-sm",
        "leading-5",
        "text-gray-700",
        "hover:bg-gray-100",
        "hover:text-gray-900",
        "focus:outline-none",
        "focus:bg-gray-100",
        "focus:text-gray-900",
        "cursor-pointer",
        { "border-l-2 border-indigo-600": selected }
      )}
      role="menuitem"
      {...props}
    >
      {label}
    </a>
  );
}

export function Divider() {
  return <div className="border-t border-gray-100"></div>;
}

export interface MenuItemGroup extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function MenuItemGroup({
  children,
  className,
  ...props
}: MenuItemGroup) {
  return (
    <div className={classNames("py-1", className)} role="menu" {...props}>
      {children}
    </div>
  );
}
