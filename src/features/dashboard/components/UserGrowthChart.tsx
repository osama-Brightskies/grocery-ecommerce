import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Typography } from "@/components/ui/shared/Typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type UserGrowthChartProps = {
  data: { month: string; users: number; newUsers: number }[];
  totalUsers: number;
};

const userGrowthConfig = {
  users: {
    label: "Total Users",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function UserGrowthChart({ data, totalUsers }: UserGrowthChartProps) {
  return (
    <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <Typography
            variant="h2"
            className="text-lg font-bold text-sidebar-bg"
          >
            User Growth (Past 3 Months)
          </Typography>
          <Typography variant="muted" className="text-xs text-text-secondary">
            Cumulative store customer growth leading to today
          </Typography>
        </div>

        {/* Matches the 546 total */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <Typography
            variant="caption"
            className="text-xs font-semibold text-sidebar-bg font-mono"
          >
            Total Users: {totalUsers}
          </Typography>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            No registration history available.
          </Typography>
        </div>
      ) : (
        <ChartContainer config={userGrowthConfig} className="h-72 w-full">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              domain={["auto", "auto"]}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#userGrad)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}

export default UserGrowthChart;
