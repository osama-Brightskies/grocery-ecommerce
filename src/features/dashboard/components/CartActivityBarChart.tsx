import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { Typography } from "@/components/ui/shared/Typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type CartActivityBarChartProps = {
  addToCartCount: number;
  removeFromCartCount: number;
};

const activityConfig = {
  actions: {
    label: "Interactions",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function CartActivityBarChart({
  addToCartCount,
  removeFromCartCount,
}: CartActivityBarChartProps) {
  const cartActivityData = [
    {
      action: "Added to Cart",
      count: addToCartCount,
      fill: "var(--color-chart-1)",
    },
    {
      action: "Removed from Cart",
      count: removeFromCartCount,
      fill: "var(--color-chart-3)",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
      <div className="border-b border-border pb-4">
        <Typography variant="h2" className="text-lg font-bold text-sidebar-bg">
          Customer Cart Behavior
        </Typography>
        <Typography variant="muted" className="text-xs text-text-secondary">
          Total products added to cart vs removed from cart
        </Typography>
      </div>

      <ChartContainer config={activityConfig} className="h-56 w-full">
        <BarChart
          data={cartActivityData}
          layout="vertical"
          margin={{ left: 30, right: 30 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--color-border)"
            strokeDasharray="3 3"
          />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            dataKey="action"
            type="category"
            tickLine={false}
            axisLine={false}
            width={130}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            radius={[0, 8, 8, 0]}
            barSize={24}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {cartActivityData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default CartActivityBarChart;
