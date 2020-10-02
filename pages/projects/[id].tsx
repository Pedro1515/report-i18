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
  Dot,
} from "components";
import {
  ArchiveIcon,
  HomeIcon,
  ClockIcon,
  TagIcon,
  ExclamationIcon,
} from "components/icons";
import classNames from "classnames";
import { config } from "utils/tailwind";
import { useProject, useRuns } from "utils/hooks";
import { customFormatDuration, sum, percentage } from "utils";
import { useRouter } from "next/router";
import { ProtectRoute, useAlert } from "context";
import format from "date-fns/format";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const { green, red, yellow } = config.theme.colors;

const data1 = [
  { name: "Pass", value: 100, color: "green" },
  { name: "Fail", value: 30, color: "red" },
  { name: "Skip", value: 10, color: "yellow" },
];

interface LabelWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const CustomTooltip = ({ active, payload, label, ...props }) => {
  const [data] = payload;
  const { payload: { name, value, color } = {} } = data ?? {};
  console.log({ active, payload, label, ...props });
  if (active) {
    return (
      <div className="flex px-3 py-2 bg-gray-800 text-xs rounded-md shadow-sm items-center opacity-90">
        <Dot {...{ color }} className="mr-2" />
        <div className="text-gray-400 font-medium">{name}:</div>
        <div className="ml-2 font-semibold text-gray-100">{value}</div>
      </div>
    );
  }

  return null;
};

function LegendWrapper({ className, ...props }: LabelWrapperProps) {
  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "justify-end",
        "text-md",
        "text-xs",
        "divide-y",
        className
      )}
      {...props}
    />
  );
}

function Legend({ label, value, percentage, color }) {
  return (
    <div
      className={classNames("flex", "items-center", "justify-between", "py-3")}
    >
      <div className="flex items-center w-1/3">
        <Dot className="mr-3" {...{ color }} />
        <div className="truncate">{label}</div>
      </div>
      <div className="w-1/3 font-medium text-right">{value}</div>
      <div className="w-1/3 text-right text-gray-500">{percentage}%</div>
    </div>
  );
}

function PieCharts() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <div style={{ height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data1}
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
            >
              {data1.map((entry, index) => {
                console.log(entry);
                return (
                  <Cell
                    key={`cell-${index}`}
                    className={`text-${entry.color}-500`}
                    fill="currentColor"
                  />
                );
              })}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <LegendWrapper>
        {data1.map(({ color, name, value }) => (
          <Legend
            key={name}
            label={name}
            {...{ color, value }}
            percentage={percentage(value, sum(data1.map((x) => x.value)))}
          />
        ))}
      </LegendWrapper>
    </div>
  );
}

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
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function AreaCharts() {
  return (
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
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

  const {
    name,
    createdAt,
    lastRun: { childLength, parentLength, startTime, status } = {},
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
          <Card className="flex-col w-1/3 border-r">
            <Title className="text-gray-700 font-semibold">General</Title>
            <div className="mt-1 text-xs text-gray-500 font-medium">
              Creado el{" "}
              {format(new Date(createdAt || null), "dd/MM/yyyy HH:ss")}
            </div>
            <div className="flex flex-wrap 3 mt-4 space-x-10">
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Runs
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">2</div>
              </div>
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Features
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">8</div>
              </div>
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Tests
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">30</div>
              </div>
            </div>
          </Card>
          <Card className="flex-col w-1/3 border-r">
            <div className="flex items-center justify-between">
              <div>
                <Title className="text-gray-700 font-semibold">
                  Ultimo run
                </Title>
                <div className="mt-1 text-xs text-gray-500 font-medium">
                  Inicio{" "}
                  {format(new Date(startTime || null), "dd/MM/yyyy HH:ss")}
                </div>
              </div>
              <Badge
                label={status}
                color={status === "pass" ? "green" : "red"}
              />
            </div>
            <div className="flex flex-wrap mt-4 space-x-10">
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Total features
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">4</div>
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
              <PieCharts />
            </div>
          </Card>
          <Card className="flex-col w-1/3">
            <Title className="text-gray-700 font-semibold">Fallos</Title>
            <div className="flex flex-wrap mt-4 space-x-10">
              <div className="flex flex-col my-3 xs:w-full">
                <div className="font-medium text-xs uppercase tracking-wider leading-none text-gray-500">
                  Total features
                </div>
                <div className="mt-2 font-medium text-2xl leading-none">4</div>
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
              <ResponsiveContainer>
                <AreaCharts />
              </ResponsiveContainer>
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
