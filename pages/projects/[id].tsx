import React from "react";
import { VictoryPie } from "victory";
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
} from "components";
import {
  ArchiveIcon,
  HomeIcon,
  ClockIcon,
  TagIcon,
  ExclamationIcon,
} from "components/icons";
import { config } from "utils/tailwind";
import { useProject, useRuns } from "utils/hooks";
import { customFormatDuration, sum } from "utils";
import { useRouter } from "next/router";
import { ProtectRoute, useAlert } from "context";
import format from "date-fns/format";

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
            label={row.original.status.toUpperCase()}
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
          const { parentLength, childLength } = row.original;

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

  return (
    <Layout>
      <LayoutHeader>
        <div className="flex space-x-4">
          <span className="font-medium text-lg">{project?.name}</span>
        </div>
      </LayoutHeader>
      <LayoutContent>
        <div className="px-6 py-4 border-b">
          <Title>resumen</Title>
          <div className="grid grid-cols-4 gap-12 mt-4 grid-flow-row">
            <Card IconComponent={<ArchiveIcon />} label="Builds" value={1} />
            <Card IconComponent={<HomeIcon />} label="Tests" value={13} />
            <Card
              IconComponent={<ArchiveIcon />}
              label="Builds ejecutados hoy"
              value={0}
            />
            <Card
              IconComponent={<HomeIcon />}
              label="Tests ejecutados hoy"
              value={5}
            />
          </div>
          <div>
            <div className="w-64">
              <VictoryPie
                padding={50}
                colorScale={[
                  config.theme.colors.green[600],
                  config.theme.colors.red[600],
                ]}
                data={[
                  { x: "PASS", y: 6 },
                  { x: "FAIL", y: 5 },
                ]}
                style={{
                  labels: {
                    fill: config.theme.colors.gray[600],
                    fontSize: 20,
                    fontWeight: "bold",
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 overflow-y-auto">
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
