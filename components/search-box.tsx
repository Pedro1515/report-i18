import React from "react";
import classNames from "classnames";
import { SearchIcon } from "components/icons";

export interface SearchBoxProps extends React.HTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export function SearchBox({ className, fullWidth, ...props }: SearchBoxProps) {
  return (
    <div className="relative">
      <input
        type="text"
        className={classNames(
          "shadow-sm",
          "appearance-none",
          "border",
          "rounded-md",
          { "w-full": fullWidth },
          "py-3",
          "px-3",
          "pl-10",
          "text-gray-700",
          "leading-tight",
          "focus:outline-none",
          "focus:shadow-outline",
          "text-sm",
          className
        )}
        {...props}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <div className="w-5 h-5 text-gray-500">
          <SearchIcon />
        </div>
      </div>
    </div>
  );
}
