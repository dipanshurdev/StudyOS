"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Label, ResponsiveContainer, Tooltip, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartConfig = {
  actions: {
    label: "Total Actions",
    color: "var(--chart-1)",
  },
  summarize: {
    label: "Summarize",
    color: "var(--chart-1)",
  },
  explain: {
    label: "Explain",
    color: "var(--chart-2)",
  },
  practice: {
    label: "Practice",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function WeeklyActivityChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover border border-border p-3 rounded-none shadow-xs">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">{payload[0].payload.day}</p>
                    <p className="text-lg font-mono font-semibold text-foreground tabular-nums">{payload[0].value} <span className="text-xs font-sans font-normal text-muted-foreground">actions</span></p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar 
            dataKey="actions" 
            fill="var(--chart-1)" 
            radius={[4, 4, 0, 0]} 
            barSize={32}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ActionBreakdownChart({ data }: { data: any[] }) {
  const totalActions = data.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            innerRadius={75}
            outerRadius={100}
            paddingAngle={8}
            strokeWidth={0}
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill || `var(--chart-${(index % 5) + 1})`} 
                className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
              />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                        className="fill-foreground text-4xl font-mono font-semibold transition-all"
                      >
                        {totalActions.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground text-[10px] font-medium uppercase tracking-widest"
                      >
                        Actions
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
          <Tooltip 
             content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border p-3 rounded-none shadow-xs flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
                      <div>
                         <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{payload[0].name}</p>
                         <p className="text-sm font-mono font-semibold text-foreground tabular-nums">{payload[0].value} usage</p>
                      </div>
                    </div>
                  )
                }
                return null
              }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
