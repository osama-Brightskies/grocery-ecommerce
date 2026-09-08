import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { Typography } from "@/components/ui/shared/Typography";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type CartActivityBarChartProps = {
  ordersPlacedCount: number;
  addToCartCount: number;
  removeFromCartCount: number;
  addToFavoritesCount: number;
  removeFromFavoritesCount: number;
};

const activityConfig = {
  actions: {
    label: "Events",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function CartActivityBarChart({
  ordersPlacedCount,
  addToCartCount,
  removeFromCartCount,
  addToFavoritesCount,
  removeFromFavoritesCount,
}: CartActivityBarChartProps) {
  const totalInteractions =
    ordersPlacedCount +
    addToCartCount +
    removeFromCartCount +
    addToFavoritesCount +
    removeFromFavoritesCount;

  const activityData = [
    {
      action: "Orders Placed",
      count: ordersPlacedCount,
      fill: "var(--color-chart-1)", // Emerald Green
    },
    {
      action: "Added to Cart",
      count: addToCartCount,
      fill: "var(--color-chart-2)", // Bright Green
    },
    {
      action: "Removed from Cart",
      count: removeFromCartCount,
      fill: "var(--color-chart-3)", // Amber
    },
    {
      action: "Added to Favorites",
      count: addToFavoritesCount,
      fill: "var(--color-chart-4)", // Purple
    },
    {
      action: "Removed from Favorites",
      count: removeFromFavoritesCount,
      fill: "var(--color-status-danger-text)", // Red
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <Typography
            variant="h2"
            className="text-lg font-bold text-sidebar-bg"
          >
            Customer Store Engagement
          </Typography>
          <Typography variant="muted" className="text-xs text-text-secondary">
            Live breakdown of orders, cart modifications, and wishlist
            interactions
          </Typography>
        </div>
        <Typography
          variant="caption"
          className="text-xs font-semibold text-sidebar-bg font-mono"
        >
          {totalInteractions} Total Events
        </Typography>
      </div>

      {/* Body */}
      {totalInteractions === 0 ? (
        <div className="py-12 text-center">
          <Typography variant="muted" className="text-sm text-text-secondary">
            No customer activity recorded in the timeline yet.
          </Typography>
        </div>
      ) : (
        <ChartContainer config={activityConfig} className="h-72 w-full">
          <BarChart
            data={activityData}
            layout="vertical"
            margin={{ left: 35, right: 30 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="action"
              type="category"
              tickLine={false}
              axisLine={false}
              width={170}
              className="text-xs font-medium"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              barSize={18}
              isAnimationActive={true}
              animationDuration={1000}
            >
              {activityData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}

export default CartActivityBarChart;
