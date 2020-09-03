import React from "react";
import classNames from "classnames";
import { Button, Sidebar } from "components";

function Wrapper({ children }) {
  return <div className="flex flex-col flex-1">{children}</div>;
}

function Header() {
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
      <div className="flex items-center justify-between px-6">
        <span className="font-medium text-lg">Proyectos</span>
        <div>
          <Button label="Crear proyecto" variant="primary" color="indigo" />
        </div>
      </div>
    </header>
  );
}

function Main({ children }) {
  return (
    <main
      className={classNames("flex", "flex-col", "h-full", "overflow-hidden")}
    >
      {children}
    </main>
  );
}

export function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <Wrapper>
        <Header />
        <Main>{children}</Main>
      </Wrapper>
    </div>
  );
}
