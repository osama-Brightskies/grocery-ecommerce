import { Pie, PieChart, Cell } from "recharts";
import { Typography } from "@/components/ui/shared/Typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type UserStatusDonutChartProps = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
};

const donutConfig = {
  users: {
    label: "Users",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function UserStatusDonutChart({
  totalUsers,
  activeUsers,
  inactiveUsers,
}: UserStatusDonutChartProps) {
  const userStatusData = [
    { name: "Active Users", value: activeUsers, color: "var(--color-chart-1)" },
    {
      name: "Inactive Users",
      value: inactiveUsers,
      color: "var(--color-chart-3)",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4 flex flex-col justify-between">
      <div className="border-b border-border pb-4">
        <Typography variant="h2" className="text-lg font-bold text-sidebar-bg">
          Account Status Split
        </Typography>
        <Typography variant="muted" className="text-xs text-text-secondary">
          Active vs inactive customer ratio
        </Typography>
      </div>

      {totalUsers === 0 ? (
        <div className="h-52 flex items-center justify-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            No user accounts found.
          </Typography>
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center h-52">
            <ChartContainer config={donutConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={userStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>

            {/* Centered Real Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-sidebar-bg">
                {totalUsers}
              </span>
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                Total Users
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-border/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <span className="font-medium text-sidebar-bg">
                Active ({activeUsers})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-medium text-sidebar-bg">
                Inactive ({inactiveUsers})
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserStatusDonutChart;
