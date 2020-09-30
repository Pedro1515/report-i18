import React, { useEffect, useMemo } from "react";
import { useTable } from "react-table";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { Project } from "api";
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
  Spinner,
  FilterLabel,
} from "components";
import { ProtectRoute, useAlert } from "context";
import {
  useModal,
  useInputValue,
  useProjects,
  usePagination,
} from "utils/hooks";

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

interface TableProps {
  columns: any;
  data?: Project[];
  sticky?: boolean;
}

function Table({ columns, data, sticky }: TableProps) {
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

export function Home() {
  const { projects, isLoading } = useProjects();
  const { PaginationComponent, currentPage } = usePagination<Project[]>({
    paginatedObject: projects,
  });
  console.log(currentPage)
  const router = useRouter();
  const columns = useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
        Cell: ({ row }) => {
          const { name, builds, tests, id } = row.original;
          return (
            <div className="flex items-center">
              <div>
                <a
                  onClick={() =>
                    router.push({ pathname: "/project/[id]", query: { id } })
                  }
                  className="text-sm leading-5 font-medium text-gray-900 hover:text-gray-700 underline"
                >
                  {name}
                </a>
                <div className="text-sm leading-8 text-gray-600">
                  {builds} Builds &middot; {tests} Tests
                </div>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Usuarios",
        id: "members",
        Cell: ({ row }) => <Members members={row.original.users} />,
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
            {format(new Date(row.original.createdAt), "dd/MM/yyyy HH:ss")}
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
          <FilterLabel>filtros</FilterLabel>
          <Search onSearch={(search) => console.log(search)} />
        </div>
        <div className="flex flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Spinner className="h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <Table {...{ columns, data: projects?.content }} sticky />
          )}
        </div>
        {PaginationComponent}
      </LayoutContent>
    </Layout>
  );
}

export default ProtectRoute(Home);
