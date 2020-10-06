import React from "react";
import { useTable } from "react-table";
import format from "date-fns/format";
import { useRouter } from "next/router";
import { removeRun } from "api";
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Title,
  Card,
  TableCell,
  TableHeader,
  TableRow,
  Badge,
  MenuIcon,
  Spinner,
  PieChart,
  AreaChart,
} from "components";
import {
  ClockIcon,
  TagSolidIcon,
  ExclamationSolidIcon,
} from "components/icons";
import { ProtectRoute, useAlert, useNotification } from "context";
import { useProject, useRuns } from "utils/hooks";
import { customFormatDuration, getTotalBy, mutateFromCache } from "utils";

const data1 = [
  { name: "Pass", value: 100, color: "green" },
  { name: "Fail", value: 30, color: "red" },
];

const data = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 3490,
  },
];

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

function DataDisplayWrapper(props) {
  return <div className="flex flex-wrap mt-4 -mx-6" {...props} />;
}

function DataDisplay({ label, value }) {
  return (
    <div className="flex flex-col my-3 mx-6 xs:w-full">
      <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
        {label}
      </div>
      <div className="mt-2 font-medium text-2xl leading-none">{value}</div>
    </div>
  );
}

function Caption(props) {
  return <div className="mt-1 text-xs text-gray-500 font-medium" {...props} />;
}

function Project() {
  const { query } = useRouter();
  const { project, mutateProject } = useProject(query.id as string);
  const { runs, isLoading: isLoadingRuns, mutateRuns } = useRuns(
    query.id as string
  );
  const alert = useAlert();
  const notitication = useNotification();

  const handleDeleteRun = ({ name, id }) => (e) => {
    const onConfirm = async () => {
      try {
        const response = await removeRun(id);
        console.log(response);
        mutateProject();
        mutateRuns();
        notitication.show({
          title: "Exito",
          type: "success",
          message: `El run ${name} ha sido eliminado correctamente.`,
        });
      } catch (error) {
        notitication.show({
          title: "Error",
          type: "error",
          message: `Se produjo un error al intentar eliminar el run. Intente mas tarde.`,
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Run",
        id: "name",
        Cell: ({ row }) => {
          const { name, duration } = row.original;
          return (
            <div className="flex flex-col text-sm">
              <span className="leading-5 font-medium text-gray-900">
                {name}
              </span>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 text-gray-500 mr-2">
                    <ClockIcon />
                  </div>
                  <span
                    className="block text-gray-500 text-sm"
                    title="Duration"
                  >
                    {customFormatDuration({ start: 0, end: duration })}
                  </span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Status",
        id: "status",
        Cell: ({ row }) => (
          <Badge
            label={row.original.status}
            color={row.original.status === "pass" ? "green" : "red"}
          />
        ),
      },
      {
        Header: "Start time",
        id: "start_time",
        Cell: ({ row }) => (
          <span
            className="text-sm leading-5 text-gray-500"
            title={row.original.created}
          >
            {format(new Date(row.original.startTime), "dd/MM/yyyy HH:ss")}
          </span>
        ),
      },
      {
        Header: "Total features",
        id: "total_features",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-gray-500">
            {getTotalBy("feature", row.original)}
          </span>
        ),
      },
      {
        Header: "Total scenarios",
        id: "total_scenarios",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-gray-500">
            {getTotalBy("scenario", row.original)}
          </span>
        ),
      },
      {
        Header: "Passed",
        id: "passed",
        Cell: ({ row }) => (
          <span className="text-sm leading-5 text-green-600">
            {row.original.passChildLength}
          </span>
        ),
      },
      {
        Header: "Failed",
        id: "failed",
        Cell: ({ row }) => (
          <span
            className="text-sm leading-5 text-red-600 text-center"
            title={row.original.created}
          >
            {row.original.failChildLength}
          </span>
        ),
      },
      {
        Header: "Skipped",
        id: "skipped",
        Cell: ({ row }) => (
          <span
            className="text-sm leading-5 text-yellow-600 text-center"
            title={row.original.created}
          >
            {row.original.skipChildLength}
          </span>
        ),
      },
      {
        Header: () => null,
        id: "edit",
        Cell: ({ row }) => (
          <MenuIcon
            items={[
              [{ label: "Eliminar", onClick: handleDeleteRun(row.original) }],
            ]}
          />
        ),
      },
    ],
    []
  );

  const {
    name,
    createdAt,
    runQuantity,
    testQuantity,
    errorState,
    lastRun: { startTime = "", status = "", categoryNameList = [] } = {},
  } = project ?? {};

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex space-x-4">
          <span className="font-medium text-lg">{project?.name}</span>
        </div>
      </LayoutHeader>
      <LayoutContent scrollable>
        <div className="flex border-b">
          <Card className="flex-col w-1/3 border-r divide-y">
            <div className="flex-1 p-6">
              <Title className="text-gray-700 font-semibold">General</Title>
              <Caption>
                Creado el{" "}
                {format(new Date(createdAt || null), "dd/MM/yyyy HH:ss")}
              </Caption>
              <DataDisplayWrapper>
                <DataDisplay label="Project Runs" value={runQuantity} />
                <DataDisplay label="Project Tests" value={testQuantity} />
              </DataDisplayWrapper>
            </div>
            <div className="flex-1 p-6">
              <Title className="text-gray-700 font-semibold">Tags</Title>
              <div className="flex flex-wrap mt-4">
                {categoryNameList?.map((tag) => (
                  <Badge
                    key={tag}
                    IconComponent={
                      <div className="text-gray-700 w-3 h-3 mr-2">
                        <TagSolidIcon />
                      </div>
                    }
                    className="m-2"
                    uppercase={false}
                    color="gray"
                    label={tag}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 p-6">
              <Title className="text-gray-700 font-semibold">Excepciones</Title>
              <div className="flex flex-wrap mt-4">
                {errorState?.map((error) => (
                  <Badge
                    key={error}
                    IconComponent={
                      <div className="text-red-700 w-3 h-3 mr-2">
                        <ExclamationSolidIcon />
                      </div>
                    }
                    className="m-2"
                    uppercase={false}
                    color="red"
                    label={error}
                  />
                ))}
              </div>
            </div>
          </Card>
          <Card className="flex-col w-1/3 border-r p-6">
            <div className="flex flex-col">
              <div className="inline-flex items-baseline">
                <Title className="text-gray-700 font-semibold">
                  Ultimo run
                </Title>
                <Badge
                  className="ml-2"
                  label={status}
                  color={status === "pass" ? "green" : "red"}
                />
              </div>
              <Caption>
                Iniciado el{" "}
                {format(new Date(startTime || null), "dd/MM/yyyy HH:ss")}
              </Caption>
            </div>
            <DataDisplayWrapper>
              <DataDisplay
                label="Total features"
                value={getTotalBy("feature", project?.lastRun)}
              />
              <DataDisplay
                label="Total scenarios"
                value={getTotalBy("scenario", project?.lastRun)}
              />
              <DataDisplay
                label="Total steps"
                value={getTotalBy("steps", project?.lastRun)}
              />
            </DataDisplayWrapper>
            <div className="flex items-center justify-center">
              <PieChart height={250} data={data1} />
            </div>
          </Card>
          <Card className="flex-col w-1/3 p-6">
            <Title className="text-gray-700 font-semibold">Fallos</Title>
            <Caption>De los ultimos X runs</Caption>
            <div className="flex items-center justify-center flex-1">
              <AreaChart
                data={data}
                areaDataKey="uv"
                xAxisDataKey="name"
                height={300}
              />
            </div>
          </Card>
        </div>
        <div className="flex flex-1">
          {isLoadingRuns ? (
            <div className="flex items-center justify-center flex-1">
              <Spinner className="h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <Table {...{ columns }} data={runs?.content} sticky />
          )}
        </div>
      </LayoutContent>
    </Layout>
  );
}

export default ProtectRoute(Project);
