import React from "react";
import classNames from "classnames";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  sticky?: boolean;
}

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export interface TableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export function TableHeader({
  sticky,
  children,
  className,
  ...props
}: TableHeaderProps) {
  return (
    <th
      className={classNames(
        "px-6",
        "py-3",
        "bg-gray-100",
        "text-left",
        "text-xs",
        "leading-4",
        "font-medium",
        "text-gray-500",
        "uppercase",
        "tracking-wider",
        { "sticky top-0 z-10": sticky },
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableRow({ children, hover, ...props }: TableRowProps) {
  return (
    <tr className={classNames({ "hover:bg-gray-100": hover })} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={classNames("px-6", "py-4", "whitespace-no-wrap", className)}
      {...props}
    >
      {children}
    </td>
  );
}
