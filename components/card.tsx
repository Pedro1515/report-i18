import React from "react";
import classNames from "classnames";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={classNames(
        "flex",
        "bg-white",
        "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
