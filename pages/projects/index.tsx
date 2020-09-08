import React, { useEffect } from "react";
import Link from "next/link";
import classNames from "classnames";
import { format } from "date-fns";
import { useTable } from "react-table";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Members,
  Badge,
  SearchBox,
  RCPagination,
  Button,
  TableCell,
  TableRow,
  TableHeader,
  MenuIcon,
} from "components";
import { useAlert } from "context";
import { useModal, useInputValue } from "utils/hooks";

function MenuIconButton() {
  const popover = useModal();
  const { show } = useAlert();

  return (
    <MenuIcon
      items={[
        [
          {
            label: "Agregar usuarios",
            onClick: () => console.log("Agregar Usuarios"),
          },
          {
            label: "Configuracion",
            onClick: () => console.log("config"),
          },
        ],
        [
          {
            label: "Eliminar",
            onClick: () => {
              popover.toggle();
              show({
                title: "Eliminar proyecto",
                body:
                  "Estas seguro que quieres eliminar el proyecto? Se perderan todos los datos asociados.",
                onConfirm: () => console.log("ale"),
                action: "Eliminar",
              });
            },
          },
        ],
      ]}
    />
  );
}

function Table({ columns, data, sticky }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table className="min-w-full divide-y divide-gray-200" {...getTableProps()}>
      <thead className="border-b">
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableHeader {...column.getHeaderProps()} {...{ sticky }}>
                {column.render("Header")}
              </TableHeader>
            ))}
          </TableRow>
        ))}
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()} hover>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
}

function Search({ onSearch }) {
  const search = useInputValue("");

  useEffect(() => {
    onSearch(search.value);
  }, [search.value]);

  return (
    <div className="py-4 w-full md:w-2/3 xl:w-1/4">
      <SearchBox
        placeholder="Buscar"
        value={search.value}
        fullWidth
        onChange={search.onChange}
        onClear={search.clear}
      />
    </div>
  );
}

export default function Home() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <div>
              <Link href="/projects/1">
                <a className="text-sm leading-5 font-medium text-gray-900 hover:text-gray-700 underline">
                  {row.original.name}
                </a>
              </Link>
              <div className="text-sm leading-8 text-gray-600">
                {row.original.builds} Builds &middot; {row.original.tests} Tests
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: "Usuarios",
        id: "members",
        Cell: ({ row }) => <Members members={row.original.members} />,
      },
      {
        Header: "Ultimo build",
        id: "status",
        Cell: ({ row }) => (
          <Badge
            label={row.original.status}
            color={row.original.status === "Pass" ? "green" : "red"}
          />
        ),
      },
      {
        Header: "Creado",
        id: "created",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-gray-500">
            {format(row.original.created, "MM/dd/yyyy")}
          </span>
        ),
      },
      {
        Header: () => null,
        id: "edit",
        Cell: ({ row }) => <MenuIconButton />,
      },
    ],
    []
  );

  const data = [
    {
      name: "cucumber4-Adapter-Stress",
      members: ["Leandro Dragani", "Juan Manuel Spoleti", "Victor Hugo Quiroz"],
      status: "Pass",
      created: new Date(),
      builds: 5,
      tests: 234,
    },
    {
      name: "cypress",
      members: ["Juan Manuel Spoleti", "Victor Hugo Quiroz"],
      status: "Pass",
      created: new Date(),
      builds: 25,
      tests: 24,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "cypress",
      members: ["Juan Manuel Spoleti", "Victor Hugo Quiroz"],
      status: "Pass",
      created: new Date(),
      builds: 25,
      tests: 24,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "cypress",
      members: ["Juan Manuel Spoleti", "Victor Hugo Quiroz"],
      status: "Pass",
      created: new Date(),
      builds: 25,
      tests: 24,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
    {
      name: "React",
      members: ["Leandro Dragani"],
      status: "Fail",
      created: new Date(),
      builds: 15,
      tests: 2,
    },
  ];

  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Proyectos</span>
        <div>
          <Button label="Crear proyecto" variant="primary" color="indigo" />
        </div>
      </LayoutHeader>
      <LayoutContent>
        <div className="px-6 py-4 border-b">
          <span
            className={classNames(
              "py-3",
              "text-left",
              "text-xs",
              "leading-4",
              "font-medium",
              "text-gray-500",
              "uppercase",
              "tracking-wider"
            )}
          >
            FILTROS
          </span>
          <Search onSearch={(search) => console.log(search)} />
        </div>
        <div className="flex flex-1 overflow-y-auto">
          <Table {...{ columns, data, sticky: true }} />
        </div>
        <div className="flex justify-end items-end p-6">
          <RCPagination total={50} />
        </div>
      </LayoutContent>
    </Layout>
  );
}
