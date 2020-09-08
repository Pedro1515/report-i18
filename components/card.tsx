import React from "react";
import classNames from "classnames";

export interface CardProps {
  IconComponent: React.ReactNode;
  label: string;
  value: string | number;
}

export function Card({ IconComponent, label, value }: CardProps) {
  return (
    <div className={classNames("bg-white", "shadow-sm", "rounded-md", "p-4", "border")}>
      <div className="flex items-center text-sm">
        <div className="w-6 h-6 text-gray-500 mr-5">{IconComponent}</div>
        <div className="flex flex-col font-medium">
          <span className="text-gray-600">{label}</span>
          <span className="text-gray-800">{value}</span>
        </div>
      </div>
    </div>
  );
}
