import React from "react";
import classNames from "classnames";
import { Button, Sidebar } from "components";

function Wrapper({ children }) {
  return <div className="flex flex-col flex-1">{children}</div>;
}

export function LayoutHeader({ children }) {
  return (
    <header
      className={classNames(
        "z-10",
        "py-8",
        "bg-white",
        "dark:bg-gray-800",
        "border-b",
        "border-gray-300"
      )}
    >
      <div
        className={classNames(
          "flex",
          "items-center",
          "justify-between",
          "px-6"
        )}
      >
        {children}
      </div>
    </header>
  );
}

export function LayoutContent({ children, scrollable = false }) {
  return (
    <main
      className={classNames(
        "flex",
        "flex-col",
        "h-full",
        "overflow-hidden",
        {
          "overflow-y-auto": scroll,
        }
      )}
    >
      {children}
    </main>
  );
}

export function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <Wrapper>{children}</Wrapper>
    </div>
  );
}
