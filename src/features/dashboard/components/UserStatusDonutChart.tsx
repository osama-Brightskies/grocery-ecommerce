import { useState } from "react";
import { Pie, PieChart, Cell } from "recharts";
import { Typography } from "@/components/ui/shared/Typography";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const userStatusData = [
    {
      name: "Active Users",
      value: activeUsers,
      color: "var(--color-chart-1)", // Brand Green
    },
    {
      name: "Inactive Users",
      value: inactiveUsers,
      color: "var(--color-chart-3)", // Amber / Warning
    },
  ].filter((item) => item.value > 0);

  const currentItem =
    hoveredIndex !== null && userStatusData[hoveredIndex]
      ? userStatusData[hoveredIndex]
      : null;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4 flex flex-col justify-between">
      {/* Header */}
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
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={4}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  isAnimationActive={true}
                  animationDuration={1000}
                  className="cursor-pointer outline-none"
                >
                  {userStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-opacity duration-200 hover:opacity-85"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* 🪄 Seamless Interactive Center Display (Zero Overlap!) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-200">
              <span
                className="text-2xl font-bold font-mono transition-colors duration-200"
                style={{
                  color: currentItem
                    ? currentItem.color
                    : "var(--color-sidebar-bg)",
                }}
              >
                {currentItem ? currentItem.value : totalUsers}
              </span>
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">
                {currentItem ? currentItem.name : "Total Users"}
              </span>
            </div>
          </div>

          {/* Bottom Legend */}
          <div className="flex items-center justify-around pt-2 border-t border-border/50 text-xs">
            <div
              className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              <span className="font-medium text-sidebar-bg">
                Active ({activeUsers})
              </span>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={() => setHoveredIndex(1)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
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
