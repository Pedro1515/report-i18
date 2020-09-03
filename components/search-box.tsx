import React from "react";
import classNames from "classnames";
import { SearchIcon, CrossIcon } from "components/icons";

export interface SearchBoxProps extends React.HTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  value: string;
  onClear: () => void;
}

export function SearchBox({
  className,
  value,
  fullWidth,
  onClear,
  ...props
}: SearchBoxProps) {
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
        value={value}
        {...props}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <div className="w-5 h-5 text-gray-500">
          <SearchIcon />
        </div>
      </div>
      {value && (
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={onClear}
        >
          <div className="w-5 h-5 text-gray-500 hover:text-gray-600">
            <CrossIcon />
          </div>
        </div>
      )}
    </div>
  );
}
