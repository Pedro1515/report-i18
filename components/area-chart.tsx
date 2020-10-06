import React from "react";
import {
  Area,
  AreaChart as RAreaCharts,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type Data = {
  name: string;
  [key: string]: string | number;
};

export interface AreaChartProps {
  data: Data[];
  height: number;
  xAxisDataKey: keyof Data;
  areaDataKey: keyof Data;
}

export function AreaChart({
  data,
  height,
  xAxisDataKey,
  areaDataKey,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaCharts data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisDataKey} />
        <XAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={areaDataKey}
          stroke="#8884d8"
          fill="#8884d8"
        />
      </RAreaCharts>
    </ResponsiveContainer>
  );
}
