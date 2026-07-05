/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import React, { useMemo } from "react";
import { PieChart, Pie, Label, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

export type EmotionData = Record<string, number>;

interface EmotionEntry {
  emotion: string;
  value: number;
  fill: string;
}

interface EmotionChartProps {
  emotionData: EmotionData;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const EmotionChart: React.FC<EmotionChartProps> = ({ emotionData }) => {
  const chartData: EmotionEntry[] = useMemo(() => {
    return Object.entries(emotionData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([emotion, value], index) => ({
        emotion,
        value: value * 100,
        fill: COLORS[index % COLORS.length] ?? COLORS[0]!, // Fallback to first color if undefined
      }));
  }, [emotionData]);

  type ChartConfigItem = {
    label: string;
    color: string;
  };

  const chartConfig: ChartConfig = useMemo(() => {
    return chartData.reduce<Record<string, ChartConfigItem>>(
      (acc, { emotion, fill }) => {
        acc[emotion] = { label: emotion, color: fill };
        return acc;
      },
      {},
    );
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Emotions</CardTitle>
        <CardDescription>
          Showing the most prominent emotions detected
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-40"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="emotion"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    // const tmpCx: number = viewBox.cx;
                    // console.log(view)
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData[0]!.emotion}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        ></tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {chartData.length > 0 && (
          <div className="flex items-center gap-2 font-medium leading-none">
            Top emotion: {chartData[0]!.emotion} (
            {chartData[0]!.value.toFixed(2)}
            %)
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing top 5 emotions detected across all messages
        </div>
      </CardFooter>
    </Card>
  );
};
