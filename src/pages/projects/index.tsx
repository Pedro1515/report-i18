import React, { useContext, useEffect, useMemo } from "react";
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
  MenuDropdown,
  Spinner,
  Title,
  useSearchBox,
  DotsVerticalIcon,
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
import { useTranslation } from 'react-i18next'
import { LocationContext } from "src/context/location-context";

function Search({ onSearch }) {
  const { value, getInputProps, getResetterProps } = useSearchBox("");

  const filter = (e) => {
    const searchText = e.target.value;

      onSearch(searchText);
    
  
  };
  const [t] = useTranslation("global")
  
  return (
    <div className="py-4 w-full md:w-2/3 xl:w-1/4">
      <SearchBox
        fullWidth
        inputProps={getInputProps({
          onChange: filter,
          placeholder: t("projects.input.search"),
        })}
        resetterProps={getResetterProps({ onClick: () => {} })}
      />
    </div>
  );
}

// Principal
export function Home() {
  const [t] = useTranslation("global")
  const [filters, setFilters] = React.useState({
    page: 0,
    size: 5,
    name: ""
  });
  const { query, route, asPath } = useRouter();
  const { mutateProject } = useProject(query.id as string);
  const { runs, isLoading: isLoadingRuns, mutateRuns } = useRuns(filters);
  const alert = useAlert();
  const notitication = useNotification();
  const { projects, isLoading } = useProjects(filters);
  const { PaginationComponent, currentPage } = usePagination<Project[]>({
    paginatedObject: projects,
  });

  //@ts-ignore
  const { handleLocation } = useContext(LocationContext)
  const location = localStorage.getItem('location')
  useEffect(() => {
    handleLocation(location)
  }, [])

  React.useEffect(() => {
    setFilters({ ...filters, page: currentPage });
  }, [currentPage]);
  
  
  const handleDeleteProject = ({ name, id }) => (e) => {
    
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

  const columns = [{
    Header: t("projects.headerTable.name"),
    accessor: "name",
    headerClassName: "px-6 w-1/3",
    className: "px-6",
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
    Header: t("projects.headerTable.users"),
    id: "members",
    headerClassName: "px-6",
    className: "px-6",
    Cell: ({ row }) => <Members members={row.original.users} />,
  },
  {
    Header: t("projects.headerTable.last_build"),
    id: "status",
    headerClassName: "px-6",
    className: "px-6",
    Cell: ({ row }) => {
      const {
        lastRun: { status },
      } = row.original;
      return (
        <Badge label={status} color={status.toUpperCase() === "pass".toUpperCase() ? "green" : "red"} />
      );
    },
  },
  {
    Header: t("projects.headerTable.created"),
    id: "created",
    headerClassName: "px-6",
    className: "px-6",
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
      <MenuDropdown
        items={[
          [{ label: t("projects.iconDropTable.delete"), style: {paddingRight:'3rem', paddingBottom:'0.25rem', paddingTop:'0.25rem'}, onClick: handleDeleteProject(row.original) }],
        ]}
        label={
          <div className="h-5 w-5">
            <DotsVerticalIcon />
          </div>
        }
        className="text-gray-600 hover:bg-gray-300 hover:text-gray-700 py-2 rounded"
        classNamePositionDrop="origin-top-right right-0 mt-2"
      />
    ),
  },]

  return (
    <Layout>
      <LayoutHeader>
        <span className="font-medium text-lg">{t("projects.header.project")}</span>
        <div className="float-right">
          <button onClick={()=>{handleLocation("us")}}>us</button>
          <button className="ml-4" onClick={()=>{handleLocation("ar")}}>ar</button>
          {/* <Button label="Crear proyecto" variant="primary" color="indigo" /> */}
        </div>
      </LayoutHeader>
      <LayoutContent>
        <div className="px-6 py-4">
          <Title>{t("projects.title.filters")}</Title>
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
