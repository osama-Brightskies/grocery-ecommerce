import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Typography } from "@/components/ui/shared/Typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type UserGrowthChartProps = {
  totalUsers: number;
};

const userGrowthConfig = {
  users: {
    label: "Registered Users",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function UserGrowthChart({ totalUsers }: UserGrowthChartProps) {
  const growthData = [
    { month: "Jan", users: 5 },
    { month: "Feb", users: 8 },
    { month: "Mar", users: 14 },
    { month: "Apr", users: 19 },
    { month: "May", users: 24 },
    { month: "Jun", users: 28 },
    { month: "Jul", users: 31 },
    { month: "Aug", users: totalUsers || 34 },
  ];

  return (
    <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <Typography
            variant="h2"
            className="text-lg font-bold text-sidebar-bg"
          >
            User Registrations Trend
          </Typography>
          <Typography variant="muted" className="text-xs text-text-secondary">
            Cumulative customer growth over the last 8 months
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          <Typography
            variant="caption"
            className="text-xs font-semibold text-sidebar-bg"
          >
            Total Users: {totalUsers}
          </Typography>
        </div>
      </div>

      <ChartContainer config={userGrowthConfig} className="h-72 w-full">
        <AreaChart
          data={growthData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Area
            type="monotone"
            dataKey="users"
            stroke="var(--color-chart-1)"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#userGrad)"
            isAnimationActive={true}
            animationDuration={1200}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export default UserGrowthChart;
