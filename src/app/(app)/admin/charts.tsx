'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { VoteCount } from '@/lib/types';

const chartConfig = {
  votes: { label: 'Votes' },
};

export function AdminCharts({ resultsData }: { resultsData: VoteCount[] }) {
  // Dynamically generate chartConfig for colors and labels based on candidate names
  resultsData.forEach((item, index) => {
    chartConfig[item.candidateName as keyof typeof chartConfig] = {
      label: item.candidateName,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    // Also add a fill property to the data for the Bar component
    item.fill = `var(--color-chart-${(index % 5) + 1})`;
  });

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={resultsData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="candidateName"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval={0}
          tick={({ x, y, payload }) => (
            <g transform={`translate(${x},${y})`}>
              <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
                {payload.value}
              </text>
            </g>
          )}
        />
        <YAxis
          tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(Number(value))}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="votes" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
