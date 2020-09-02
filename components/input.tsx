import React from "react";
import classNames from "classnames";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={classNames(
        "border-gray-300",
        "placeholder-gray-500",
        "appearance-none",
        "rounded-none",
        "relative",
        "block",
        "w-full",
        "px-3",
        "py-2",
        "border",
        "text-gray-900",
        "focus:outline-none",
        "focus:shadow-outline",
        "focus:border-indigo-300",
        "focus:z-10",
        "sm:text-sm",
        "sm:leading-5",
        className
      )}
      {...props}
    />
  );
}
