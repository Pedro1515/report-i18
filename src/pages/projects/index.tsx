import React, { useEffect, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Project, removeProject } from "src/api";
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
} from "src/components";
import { ProtectRoute, useAlert, useNotification } from "src/context";
import {
  useModal,
  useProjects,
  usePagination,
  prefetchProject,
  useProject,
  useRuns,
} from "src/utils/hooks";
import { useRouter } from "next/router";

function Search({ onSearch }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");

  const filter = (e) => {
    const searchText = e.target.value;

      onSearch(searchText);
    
  
  };
  
  return (
    <div className="py-4 w-full md:w-2/3 xl:w-1/4">
      <SearchBox
        fullWidth
        inputProps={getInputProps({
          onChange: filter,
          placeholder: "Buscar",
        })}
        resetterProps={getResetterProps({ onClick: () => {} })}
      />
    </div>
  );
}

// Principal
export function Home() {
  const [filters, setFilters] = React.useState({
    page: 0,
    size: 5,
    name: ""
  });
  const { projects, isLoading } = useProjects(filters);
  const { PaginationComponent, currentPage } = usePagination<Project[]>({
    paginatedObject: projects,
  });

  React.useEffect(() => {
    setFilters({ ...filters, page: currentPage });
  }, [currentPage]);


  const handleDeleteProject = ({ name, id }) => (e) => {
    const { query, route, asPath } = useRouter();
    const { mutateProject } = useProject(query.id as string);
    const { runs, isLoading: isLoadingRuns, mutateRuns } = useRuns(filters);
    const alert = useAlert();
    const notitication = useNotification();
    const onConfirm = async () => {
      try {
        await removeProject(id);
        mutateProject();
        mutateRuns();
        notitication.show({
          title: "Exito",
          type: "success",
          message: `El proyecto ${name} ha sido eliminado correctamente.`,
        });
      } catch (error) {
        notitication.show({
          title: "Error",
          type: "error",
          message: `Se produjo un error al intentar eliminar el proyecto. Intente mas tarde.`,
        });
      }
    };

    alert.show({
      title: `Eliminar ${name}`,
      body:
        "Estas seguro que quieres eliminarlo? Se perderan todos los datos asociados.",
      onConfirm,
      action: "Eliminar",
    });
  };

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
        Cell: ({ row }) => (
          <MenuIcon
            items={[
              [{ label: "Eliminar", onClick: handleDeleteProject(row.original) }],
            ]}
          />
        ),
      },
    ],
    []
  );

  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">Proyectos</span>
        <div>
          &nbsp;
          {/* <Button label="Crear proyecto" variant="primary" color="indigo" /> */}
        </div>
      </LayoutHeader>
      <LayoutContent>
        <div className="px-6 py-4">
          <Title>filtros</Title>
          <Search onSearch={(search: string) => setFilters({page:0, size: 5, name: search})} />
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
