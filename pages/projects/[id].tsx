import React from "react";
import { useTable } from "react-table";
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
} from "components";
import { ClockIcon, TagSolidIcon, ExclamationSolidIcon } from "components/icons";
import { useProject, useRuns } from "utils/hooks";
import { customFormatDuration, sum } from "utils";
import { useRouter } from "next/router";
import { ProtectRoute, useAlert } from "context";
import format from "date-fns/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data1 = [
  { name: "Pass", value: 100, color: "green" },
  { name: "Fail", value: 30, color: "red" },
];

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
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

function AreaCharts() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
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

function Project() {
  const { query } = useRouter();
  const { project } = useProject(query.id as string);
  const { runs, isLoading: isLoadingRuns } = useRuns(query.id as string);
  const { show } = useAlert();

  const handleDeleteRun = ({ name, id }) => (e) => {
    show({
      title: `Eliminar ${name}`,
      body:
        "Estas seguro que quieres eliminarlo? Se perderan todos los datos asociados.",
      onConfirm: () => console.log("ale"),
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
        Cell: ({ row }) => {
          const { parentLength } = row.original;
          return (
            <span
              className="text-sm leading-5 text-gray-500"
              title={row.original.created}
            >
              {sum([parentLength])}
            </span>
          );
        },
      },
      {
        Header: "Total scenarios",
        id: "total_scenarios",
        Cell: ({ row }) => {
          const { parentLength, childLength, child } = row.original;

          return (
            <span
              className="text-sm leading-5 text-gray-500"
              title={row.original.created}
            >
              {sum([childLength, parentLength])}
            </span>
          );
        },
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
    lastRun: {
      childLength = 0,
      parentLength = 0,
      grandChildLength = 0,
      startTime = "",
      status = "",
      categoryNameList = [],
    } = {},
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
              <div className="mt-1 text-xs text-gray-500 font-medium">
                Creado el{" "}
                {format(new Date(createdAt || null), "dd/MM/yyyy HH:ss")}
              </div>
              <div className="flex flex-wrap 3 mt-4 justify-between">
                <div className="flex flex-col my-3 xs:w-full">
                  <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                    Runs
                  </div>
                  <div className="mt-2 font-medium text-2xl leading-none">
                    {runQuantity}
                  </div>
                </div>
                <div className="flex flex-col my-3 xs:w-full">
                  <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                    Tests
                  </div>
                  <div className="mt-2 font-medium text-2xl leading-none">
                    {testQuantity}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <Title className="text-gray-700 font-semibold">Tags</Title>
              <div className="flex flex-wrap mt-4">
                {categoryNameList?.map((tag) => (
                  <Badge
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
            <div className="flex items-center justify-between">
              <div>
                <div>
                  <Title className="text-gray-700 font-semibold">
                    Ultimo run
                  </Title>
                  <Badge
                    className="ml-2"
                    label={status}
                    color={status === "pass" ? "green" : "red"}
                  />
                </div>

                <div className="mt-1 text-xs text-gray-500 font-medium">
                  Iniciado el{" "}
                  {format(new Date(startTime || null), "dd/MM/yyyy HH:ss")}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap mt-4 justify-between">
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Total features
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">{}</div>
              </div>
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Total scenarios
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">15</div>
              </div>
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Total steps
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">80</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <PieChart height={250} data={data1} />
            </div>
          </Card>
          <Card className="flex-col w-1/3 p-6">
            <Title className="text-gray-700 font-semibold">Fallos</Title>
            <div className="flex items-center justify-center flex-1">
              <AreaCharts />
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
