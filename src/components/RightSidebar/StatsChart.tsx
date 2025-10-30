import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useAreaStore } from "@/store/area-store";
import { TabularData } from "@/types/api";
import { consolidateStats } from "@/utils/consolidateStats";
import { getAttributes } from "@/utils/getAttributes";

type StatsChartType = {
  stats: TabularData[];
};

const COLORS = ["blue", "red", "green", "orange", "pink", "teal", "gray"];

export function StatsChart({ stats }: StatsChartType) {
  const { province } = useAreaStore();
  const series = getAttributes(stats).map((i, index) => ({
    name: i,
    color: `${COLORS[index]}.solid`,
    stackId: "a",
  }));
  const chart = useChart({
    data: consolidateStats(stats, province ? "area_council" : "province"),
    series: series,
  });

  return (
    <Chart.Root maxH="sm" mt={4} chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis axisLine={false} tickLine={false} dataKey={chart.key("place")} />
        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        {chart.series.map((item) => (
          <Bar
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            stackId={item.stackId}
          />
        ))}
      </BarChart>
    </Chart.Root>
  );
}
