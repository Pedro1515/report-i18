import React, { useEffect, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Project } from "api";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Members,
  Badge,
  SearchBox,
  Button,
  Table,
  MenuIcon,
  Spinner,
  Title,
  useSearchBox,
} from "components";
import { ProtectRoute, useAlert } from "context";
import {
  useModal,
  useProjects,
  usePagination,
  prefetchProject,
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
                onConfirm: () => console.log("eliminar proyecto"),
                action: "Eliminar",
              });
            },
          },
        ],
      ]}
    />
  );
}

function Search({ onSearch }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");

  return (
    <div className="py-4 w-full md:w-2/3 xl:w-1/4">
      <SearchBox
        fullWidth
        inputProps={getInputProps({
          onChange: (e) => console.log(e.target.value),
          placeholder: "Buscar",
        })}
        resetterProps={getResetterProps({ onClick: () => {} })}
      />
    </div>
  );
}

export function Home() {
  const [filters, setFilters] = React.useState({
    page: 0,
  });
  const { projects, isLoading } = useProjects(filters);
  const { PaginationComponent, currentPage } = usePagination<Project[]>({
    paginatedObject: projects,
  });

  React.useEffect(() => {
    setFilters({ ...filters, page: currentPage });
  }, [currentPage]);

  const columns = useMemo(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
        Cell: ({ row }) => {
          const { name, runQuantity, testQuantity, id } = row.original;
          return (
            <div className="flex flex-col">
              <Link href={`/projects/${id}`}>
                <a
                  className="text-sm leading-5 font-medium text-gray-900 hover:text-gray-700 underline"
                  onMouseEnter={() => prefetchProject(id)}
                >
                  {name}
                </a>
              </Link>
              <div className="text-sm leading-8 text-gray-600">
                {runQuantity} Runs &middot; {testQuantity} Tests
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
        Cell: ({ row }) => {
          const {
            lastRun: { status },
          } = row.original;
          return (
            <Badge label={status} color={status === "pass" ? "green" : "red"} />
          );
        },
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
        <div className="px-6 py-4">
          <Title>filtros</Title>
          <Search onSearch={(search) => console.log(search)} />
        </div>
        <div className="flex flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex-center flex-1">
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
