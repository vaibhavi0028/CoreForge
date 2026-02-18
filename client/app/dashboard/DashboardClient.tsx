"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FlaskConical, Clock, Cpu, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import type { BenchmarkMetrics, BenchmarkRun, User } from "@/types/metrics";

const COLORS = [
  "hsl(234,89%,63%)",
  "hsl(262,83%,58%)",
  "hsl(172,66%,50%)",
  "hsl(340,75%,55%)",
  "hsl(45,93%,58%)",
  "hsl(200,80%,55%)",
];

interface Props {
  user: User;
  history: BenchmarkRun[];
  latest: BenchmarkRun | null;
}

export default function DashboardClient({ user, history, latest }: Props) {
  console.log(
    "Latest Metrics Data:",
    latest?.metrics.map((m) => ({
      model: m.model,
      avg: m.optimized.memMb,
      peak: m.optimized.memPeakMb,
    })),
  );
  const cpuTimeline = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 3}s`,
    usage: Math.round(30 + Math.random() * 55),
  }));

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Link href="/benchmark">
            <Button className="gradient-bg border-0 text-primary-foreground gap-2 hover:opacity-90">
              <FlaskConical className="h-4 w-4" /> New Benchmark
            </Button>
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={item}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="gradient-bg p-3 rounded-xl">
                  <FlaskConical className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">
                    {history.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Runs</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="bg-accent p-3 rounded-xl">
                  <Zap className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="overflow-hidden">
                  {" "}
                  <p className="text-2xl font-bold font-display truncate">
                    {latest?.metrics[0]?.optimized?.latency
                      ? `${latest.metrics[0].optimized.latency.toFixed(6)}ms`
                      : "—ms"}
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    Best Latency
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-xl">
                  <Cpu className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">
                    {latest?.metrics.length ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Models Tested</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {latest && (
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Latest Latency (ms)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={latest.metrics.map((m: BenchmarkMetrics) => ({
                        name: m.model,
                        latency: m.optimized.latency,
                      }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--muted-foreground)"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        stroke="var(--foreground)"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="var(--foreground)"
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="latency" radius={[6, 6, 0, 0]}>
                        {latest.metrics.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {latest && (
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    CPU Usage by Model (%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={latest?.metrics.map((m) => ({
                        name: m.model,
                        baseline: m.baseline.cpuAvg,
                        optimized: m.optimized.cpuAvg,
                      }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--muted-foreground)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="var(--foreground)"
                        fontSize={11}
                      />
                      <YAxis
                        unit="%"
                        stroke="var(--foreground)"
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                        }}
                      />
                      <Bar
                        dataKey="baseline"
                        fill="var(--muted-foreground)"
                        radius={[4, 4, 0, 0]}
                        name="Baseline Avg"
                      />
                      <Bar
                        dataKey="optimized"
                        fill="hsl(172,66%,50%)"
                        radius={[4, 4, 0, 0]}
                        name="Optimized Avg"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {latest && (
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Memory Footprint (MB)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={latest?.metrics.map((m) => ({
                        name: m.model,
                        avg: m.optimized.memMb,
                        peak: m.optimized.memPeakMb,
                      }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--muted-foreground)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="var(--foreground)"
                        fontSize={11}
                      />
                      <YAxis
                        unit="MB"
                        stroke="var(--foreground)"
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                        }}
                      />
                      <Bar
                        dataKey="avg"
                        fill="hsl(234,89%,63%)"
                        radius={[4, 4, 0, 0]}
                        name="Avg RAM"
                      />
                      <Bar
                        dataKey="peak"
                        fill="hsl(262,83%,58%)"
                        radius={[4, 4, 0, 0]}
                        name="Peak RAM"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
          {latest && (
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    System Impact Radar
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={[
                        {
                          subject: "Avg Latency",

                          baseline: latest?.metrics[0]?.baseline.latency,

                          optimized: latest?.metrics[0]?.optimized.latency,

                          fullMark: 100,
                        },

                        {
                          subject: "P95 Latency",

                          baseline: latest?.metrics[0]?.baseline.p95,

                          optimized: latest?.metrics[0]?.optimized.p95,

                          fullMark: 100,
                        },

                        {
                          subject: "CPU Avg",

                          baseline: latest?.metrics[0]?.baseline.cpuAvg,

                          optimized: latest?.metrics[0]?.optimized.cpuAvg,

                          fullMark: 100,
                        },

                        {
                          subject: "Mem Avg",

                          baseline: latest?.metrics[0]?.baseline.memMb,

                          optimized: latest?.metrics[0]?.optimized.memMb,

                          fullMark: 100,
                        },
                      ]}
                    >
                      <PolarGrid stroke="var(--border)" />

                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{
                          fill: "var(--foreground)",
                          fontSize: 12,
                        }}
                      />

                      <Radar
                        name="Baseline"
                        dataKey="baseline"
                        stroke="var(--muted-foreground)"
                        fill="var(--muted-foreground)"
                        fillOpacity={0.3}
                      />

                      <Radar
                        name="Optimized"
                        dataKey="optimized"
                        stroke="hsl(172,66%,50%)"
                        fill="hsl(172,66%,50%)"
                        fillOpacity={0.5}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">
              Recent Benchmark Runs
            </CardTitle>
            <Link href="/logs">
              <Button variant="ghost" size="sm" className="text-primary">
                View All Logs →
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Models</TableHead>
                  <TableHead>Peak Memory</TableHead>
                  <TableHead>Avg Latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.slice(0, 5).map((run) => (
                  <TableRow key={`${run.id}-${run.timestamp}`}>
                    <TableCell className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {new Date(run.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{run.models.join(", ")}</TableCell>
                    <TableCell>
                      {Math.max(
                        ...run.metrics.map((m) => m.optimized.memPeakMb),
                      ).toFixed(0)}{" "}
                      MB
                    </TableCell>
                    <TableCell>
                      {(
                        run.metrics.reduce(
                          (s: number, m: BenchmarkMetrics) =>
                            s + m.optimized.latency,
                          0,
                        ) / run.metrics.length
                      ).toFixed(1)}
                      ms
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
