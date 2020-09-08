import React from "react";
import useSWR from "swr";
import { VictoryPie } from "victory";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
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
} from "components";
import { ArchiveIcon, HomeIcon } from "components/icons";
import { config } from "utils/tailwind";

// function useProject(id) {
//   const { data, error } = useSWR(`/rest/projects/select/${id}`, fetcher);
//   return {
//     user: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

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

export default function Project() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Build",
        id: "name",
        Cell: ({ row }) => (
          <div className="text-sm leading-5 font-medium text-gray-900">
            {row.original.name}
          </div>
        ),
      },
      {
        Header: "% de exito",
        id: "members",
        accessor: "members",
      },
      {
        Header: "Estado",
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
          <span className="text-sm leading-5 text-gray-500" title={row.original.created}>
            {formatDistanceToNow(row.original.created, {
              addSuffix: true,
              locale: es
            })}
          </span>
        ),
      },
      {
        Header: () => null,
        id: "edit",
        Cell: ({ row }) => (
          <MenuIcon
            items={[[{ label: "Eliminar", onClick: () => console.log("asd") }]]}
          />
        ),
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
        <div className="flex space-x-4">
          <span className="font-medium text-lg">React-project</span>
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
          <Table {...{ columns, data, sticky: true }} />
        </div>
      </LayoutContent>
    </Layout>
  );
}
