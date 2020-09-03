import React, { useEffect } from "react";
import classNames from "classnames";
import { format } from "date-fns";
import { useTable } from "react-table";
import {
  Layout,
  Members,
  MenuItemGroup,
  MenuItem,
  Divider,
  Badge,
  IconButton,
  PopOver,
  SearchBox,
} from "components";
import { DotsVerticalIcon } from "components/icons";
import { useAlert } from "context";
import { useModal, useInputValue } from "utils/hooks";

function DotsVerticalIconButton() {
  const popover = useModal();
  const { show } = useAlert();

  return (
    <div className="relative inline-block">
      <IconButton
        active={popover.visibility}
        onClick={popover.toggle}
        IconComponent={
          <div className="h-5 w-5">
            <DotsVerticalIcon />
          </div>
        }
      />
      <PopOver
        visible={popover.visibility}
        onClose={popover.toggle}
        className="origin-top-right right-0 mt-2"
      >
        <MenuItemGroup
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <MenuItem label="Agregar usuarios" />
          <MenuItem label="Configuracion" />
        </MenuItemGroup>
        <Divider />
        <MenuItemGroup>
          <MenuItem
            label="Eliminar"
            onClick={() => {
              popover.toggle();
              show({
                title: "Eliminar proyecto",
                body:
                  "Estas seguro que quieres eliminar el proyecto? Se perderan todos los datos asociados.",
                onConfirm: () => console.log("ale"),
                action: "Eliminar",
              });
            }}
          />
        </MenuItemGroup>
      </PopOver>
    </div>
  );
}

function Table({ columns, data }) {
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
              <TableHeader {...column.getHeaderProps()}>
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
            <TableRow {...row.getRowProps()}>
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

function TableHeader({ children, ...props }) {
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
        "tracking-wider"
      )}
      {...props}
    >
      {children}
    </th>
  );
}

function TableRow({
  children,
  hover,
  ...props
}: {
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <tr className={classNames({ "hover:bg-gray-100": hover })} {...props}>
      {children}
    </tr>
  );
}

function TableCell({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}) {
  return (
    <td
      className={classNames("px-6", "py-4", "whitespace-no-wrap", className)}
      {...props}
    >
      {children}
    </td>
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
              <div className="text-sm leading-5 font-medium text-gray-900">
                {row.original.name}
              </div>
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
        Cell: ({ row }) => <DotsVerticalIconButton />,
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
  ];

  return (
    <Layout>
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
      <Table {...{ columns, data }} />
    </Layout>
  );
}
