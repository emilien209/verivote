'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const resultsData = [
  { candidate: 'Alice J.', votes: 3450231, fill: 'var(--color-chart-1)' },
  { candidate: 'Bob W.', votes: 2890112, fill: 'var(--color-chart-2)' },
  { candidate: 'Carol D.', votes: 1540321, fill: 'var(--color-chart-3)' },
  { candidate: 'David G.', votes: 432327, fill: 'var(--color-chart-4)' },
];

const turnoutData = [
  { time: '8 AM', voters: 120320 },
  { time: '9 AM', voters: 450231 },
  { time: '10 AM', voters: 980432 },
  { time: '11 AM', voters: 1803219 },
  { time: '12 PM', voters: 2893201 },
  { time: '1 PM', voters: 4012394 },
  { time: '2 PM', voters: 5503210 },
  { time: '3 PM', voters: 7012345 },
  { time: '4 PM', voters: 8312991 },
];

const chartConfig = {
  votes: { label: 'Votes', color: 'hsl(var(--chart-1))' },
  voters: { label: 'Voters', color: 'hsl(var(--chart-1))' },
  'Alice J.': { label: 'Alice Johnson', color: 'hsl(var(--chart-1))' },
  'Bob W.': { label: 'Bob Williams', color: 'hsl(var(--chart-2))' },
  'Carol D.': { label: 'Carol Davis', color: 'hsl(var(--chart-3))' },
  'David G.': { label: 'David Garcia', color: 'hsl(var(--chart-4))' },
};

export function AdminCharts({ chartType }: { chartType: 'bar' | 'line' }) {
  if (chartType === 'bar') {
    return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={resultsData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="candidate"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
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

  if (chartType === 'line') {
    return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <LineChart
          accessibilityLayer
          data={turnoutData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(Number(value))}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="voters"
            type="monotone"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  return null;
}
