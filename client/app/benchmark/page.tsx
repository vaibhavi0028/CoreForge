"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MODELS, runBenchmark } from "@/lib/api";
import { useSession } from "next-auth/react";
import type { ModelName, BenchmarkRun } from "@/types/metrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  FlaskConical,
  Loader2,
  Save,
  Layers,
  Brain,
  AudioLines,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(234,89%,63%)",
  "hsl(262,83%,58%)",
  "hsl(172,66%,50%)",
  "hsl(340,75%,55%)",
  "hsl(45,93%,58%)",
  "hsl(200,80%,55%)",
];
const categoryIcons = { CNN: Layers, Transformer: Brain, Audio: AudioLines };

export default function BenchmarkPage() {
  const [selected, setSelected] = useState<ModelName[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BenchmarkRun | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeMetric, setActiveMetric] = useState<any | null>(null);
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const { toast } = useToast();

  const fmt = (v?: number, d = 2) => (v ?? 0).toFixed(d);

  const betterLower = (base?: number, opt?: number) =>
    (opt ?? Infinity) < (base ?? Infinity);

  const betterHigher = (base?: number, opt?: number) =>
    (opt ?? -Infinity) > (base ?? -Infinity);

  const cellClass = (isBetter: boolean) =>
    isBetter ? "text-green-600 font-semibold" : "text-blue-500";

  const toggle = (m: ModelName, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, m] : prev.filter((x) => x !== m),
    );
  };

  const handleRun = async () => {
    if (selected.length === 0) {
      toast({ title: "Select at least one model", variant: "destructive" });
      return;
    }
    setRunning(true);
    setProgress(0);
    setResult(null);
    const run = await runBenchmark(selected, setProgress);
    setResult(run);
    setRunning(false);
    toast({
      title: "Benchmark complete!",
      description: `Tested ${run.models.length} models in ${run.totalDurationMs.toFixed(0)}ms`,
    });
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    toast({
      title: "Results saved!",
      description: "Benchmark stored in your history.",
    });
  };

  const grouped = {
    CNN: MODELS.filter((m) => m.category === "CNN"),
    Transformer: MODELS.filter((m) => m.category === "Transformer"),
    Audio: MODELS.filter((m) => m.category === "Audio"),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold mb-2">Run Benchmark</h1>
        <p className="text-muted-foreground mb-8">
          Select models and measure CPU inference performance
        </p>

        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Select Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.entries(grouped) as [string, typeof MODELS][]).map(
                ([cat, models]) => {
                  const Icon = categoryIcons[cat as keyof typeof categoryIcons];
                  return (
                    <div key={cat}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm uppercase tracking-wider">
                          {cat}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {models.map((m) => (
                          <label
                            key={m.name}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                          >
                            <Checkbox
                              checked={selected.includes(m.name)}
                              onCheckedChange={(checked) =>
                                toggle(m.name, !!checked)
                              }
                            />
                            <div>
                              <span className="text-sm font-medium">
                                {m.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {m.params}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Button
                onClick={handleRun}
                disabled={running || selected.length === 0}
                className="gradient-bg border-0 text-primary-foreground gap-2 hover:opacity-90"
              >
                {running ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FlaskConical className="h-4 w-4" />
                )}
                {running ? "Running..." : "Run Benchmark"}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selected.length} model{selected.length !== 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
          </CardContent>
        </Card>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-lg">
                  Latency Comparison (ms)
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-1"
                >
                  <Save className="h-3 w-3" /> Save Results
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={result.metrics.map((m) => ({
                      name: m.model,
                      baseline: m.baseline.latency,
                      optimized: m.optimized.latency,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar
                      dataKey="baseline"
                      name="FP32"
                      fill="hsl(220,70%,60%)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="optimized"
                      name="INT8"
                      fill="hsl(150,70%,50%)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  Detailed Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Base Latency</TableHead>
                      <TableHead>Opt Latency</TableHead>
                      <TableHead>P95 Opt</TableHead>
                      <TableHead>CPU %</TableHead>
                      <TableHead>Memory (MB)</TableHead>
                      <TableHead>Speedup</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {result.metrics.map((m) => (
                      <TableRow
                        key={m.model}
                        className="cursor-pointer hover:bg-muted/40 transition"
                        onClick={() => setActiveMetric(m)}
                      >
                        <TableCell className="font-medium">{m.model}</TableCell>

                        <TableCell>{m.baseline.latency.toFixed(2)}</TableCell>

                        <TableCell className="text-green-600 font-semibold">
                          {m.optimized.latency.toFixed(2)}
                        </TableCell>

                        <TableCell>{m.optimized.p95.toFixed(2)}</TableCell>

                        <TableCell>{m.optimized.cpuAvg.toFixed(1)}%</TableCell>

                        <TableCell>{m.optimized.memMb.toFixed(1)}</TableCell>

                        <TableCell
                          className={
                            m.speedup > 2
                              ? "text-green-600 font-bold text-primary"
                              : "text-yellow-600"
                          }
                        >
                          {m.speedup.toFixed(2)}x
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border rounded-2xl shadow-2xl p-6 w-[650px] max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-xl">
                  {activeMetric.model} Detailed Comparison
                </h3>

                <button
                  onClick={() => setActiveMetric(null)}
                  className="text-sm opacity-70 hover:opacity-100"
                >
                  ✕
                </button>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={[
                    { name: "FP32", value: activeMetric.baseline.latency },
                    { name: "INT8", value: activeMetric.optimized.latency },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    <Cell fill="#3b82f6" />
                    <Cell fill="#22c55e" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <Table className="mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Baseline (FP32)</TableHead>
                    <TableHead>Optimized (INT8)</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>Avg Latency (ms)</TableCell>
                    <TableCell
                      className={cellClass(
                        !betterLower(
                          activeMetric.baseline.latency,
                          activeMetric.optimized.latency,
                        ),
                      )}
                    >
                      {fmt(activeMetric.baseline.latency)}
                    </TableCell>

                    <TableCell
                      className={cellClass(
                        betterLower(
                          activeMetric.baseline.latency,
                          activeMetric.optimized.latency,
                        ),
                      )}
                    >
                      {fmt(activeMetric.optimized.latency)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>P95 Latency (ms)</TableCell>
                    <TableCell
                      className={cellClass(
                        !betterLower(
                          activeMetric.baseline.p95,
                          activeMetric.optimized.p95,
                        ),
                      )}
                    >
                      {fmt(activeMetric.baseline.p95)}
                    </TableCell>

                    <TableCell
                      className={cellClass(
                        betterLower(
                          activeMetric.baseline.p95,
                          activeMetric.optimized.p95,
                        ),
                      )}
                    >
                      {fmt(activeMetric.optimized.p95)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>CPU Avg (%)</TableCell>
                    <TableCell
                      className={cellClass(
                        !betterLower(
                          activeMetric.baseline.cpuAvg,
                          activeMetric.optimized.cpuAvg,
                        ),
                      )}
                    >
                      {fmt(activeMetric.baseline.cpuAvg)}
                    </TableCell>

                    <TableCell
                      className={cellClass(
                        betterLower(
                          activeMetric.baseline.cpuAvg,
                          activeMetric.optimized.cpuAvg,
                        ),
                      )}
                    >
                      {fmt(activeMetric.optimized.cpuAvg)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>CPU Peak (%)</TableCell>
                    <TableCell
                      className={cellClass(
                        !betterLower(
                          activeMetric.baseline.cpuPeak,
                          activeMetric.optimized.cpuPeak,
                        ),
                      )}
                    >
                      {fmt(activeMetric.baseline.cpuPeak)}
                    </TableCell>

                    <TableCell
                      className={cellClass(
                        betterLower(
                          activeMetric.baseline.cpuPeak,
                          activeMetric.optimized.cpuPeak,
                        ),
                      )}
                    >
                      {fmt(activeMetric.optimized.cpuPeak)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Memory Avg (MB)</TableCell>
                    <TableCell
                      className={cellClass(
                        !betterLower(
                          activeMetric.baseline.memMb,
                          activeMetric.optimized.memMb,
                        ),
                      )}
                    >
                      {fmt(activeMetric.baseline.memMb)}
                    </TableCell>

                    <TableCell
                      className={cellClass(
                        betterLower(
                          activeMetric.baseline.memMb,
                          activeMetric.optimized.memMb,
                        ),
                      )}
                    >
                      {fmt(activeMetric.optimized.memMb)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Memory Peak (MB)</TableCell>
                    <TableCell
                      className={cellClass(
                        !betterLower(
                          activeMetric.baseline.memPeakMb,
                          activeMetric.optimized.memPeakMb,
                        ),
                      )}
                    >
                      {fmt(activeMetric.baseline.memPeakMb)}
                    </TableCell>

                    <TableCell
                      className={cellClass(
                        betterLower(
                          activeMetric.baseline.memPeakMb,
                          activeMetric.optimized.memPeakMb,
                        ),
                      )}
                    >
                      {fmt(activeMetric.optimized.memPeakMb)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Physical Cores</TableCell>
                    <TableCell>{activeMetric.baseline.physicalCores}</TableCell>
                    <TableCell>
                      {activeMetric.optimized.physicalCores}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Logical Cores</TableCell>
                    <TableCell>{activeMetric.baseline.logicalCores}</TableCell>
                    <TableCell>{activeMetric.optimized.logicalCores}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold">Speedup</TableCell>
                    <TableCell
                      colSpan={2}
                      className="text-green-600 font-bold text-center"
                    >
                      {activeMetric.speedup.toFixed(2)}x faster
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </motion.div>
          </motion.div>
        )}

        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                  <CardTitle className="font-display">
                    Save Your Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Log in to save benchmark results to your dashboard.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/login">
                      <Button className="gradient-bg border-0 text-primary-foreground">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="outline">Sign Up</Button>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLoginPrompt(false)}
                    className="text-muted-foreground"
                  >
                    Continue without saving
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
