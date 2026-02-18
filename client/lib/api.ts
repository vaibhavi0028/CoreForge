import type { ModelInfo, BenchmarkRun } from "@/types/metrics";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const MODELS: ModelInfo[] = [
  { name: "MobileNet", category: "CNN", description: "Lightweight CNN for mobile inference", params: "3.4M" },
  { name: "ResNet18", category: "CNN", description: "Classic residual network architecture", params: "11.7M" },
  { name: "EfficientNetB0", category: "CNN", description: "Compound-scaled CNN for efficiency", params: "5.3M" },
  { name: "MiniBERT", category: "Transformer", description: "Compact BERT variant for NLP tasks", params: "11.3M" },
  { name: "DistilBERT", category: "Transformer", description: "Distilled BERT with 60% fewer params", params: "66M" },
  { name: "Wav2Vec2Tiny", category: "Audio", description: "Self-supervised audio representation", params: "32M" },
];

export async function runBenchmark(
  models: string[], 
  onProgress?: (p: number) => void
): Promise<BenchmarkRun> {
  const response = await fetch(`${API_BASE}/run-benchmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ models: models.length === 0 ? ["all"] : models }) 
  });

  if (!response.ok) throw new Error("Benchmark failed");

  const result = await response.json();
  console.log(result.data)

  return formatBackendRun(result.data);
}

export async function getHistory(): Promise<BenchmarkRun[]> {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) return [];
  
  const result = await response.json();
  
  if (result.status === "no_results" || !result.history) return [];
  
  return result.history.map((item: any) => formatBackendRun(item));
}

export async function getLatestRun(): Promise<BenchmarkRun | null> {
  const response = await fetch(`${API_BASE}/metrics`);
  if (!response.ok) return null;
  
  const result = await response.json();
  if (result.status === "no_results") return null;
  
  return formatBackendRun(result.data);
}

function formatBackendRun(data: any): BenchmarkRun {
  const benchmarks = data?.benchmarks || [];

  return {
    id: data?._id || String(data?.timestamp || Date.now()),
    timestamp: new Date((data?.timestamp || Date.now()) * 1000).toISOString(),

    models: benchmarks.map((b: any) => b.model),

    totalDurationMs: 0,

    metrics: benchmarks.map((b: any) => ({
      model: b.model,

      baseline: {
        latency: b.baseline?.avg_latency_ms ?? 0,
        p95: b.baseline?.p95_latency_ms ?? 0,
        cpuAvg: b.baseline?.cpu_usage_percent?.process_avg ?? 0,
        cpuPeak: b.baseline?.cpu_usage_percent?.process_peak ?? 0,
        memMb: b.baseline?.memory_info?.rss_avg_mb ?? 0,
        memPeakMb: b.baseline?.memory_info?.rss_peak_mb ?? 0,
        perCore: b.baseline?.per_core_avg ?? [],
        cores: b.baseline?.cpu_count ?? {},
        physicalCores: b.baseline?.cpu_count?.physical ?? {},
        logicalCores: b.baseline?.cpu_count?.logical ?? {}
      },

      optimized: {
        latency: b.optimized?.avg_latency_ms ?? 0,
        p95: b.optimized?.p95_latency_ms ?? 0,
        cpuAvg: b.optimized?.cpu_usage_percent?.process_avg ?? 0,
        cpuPeak: b.optimized?.cpu_usage_percent?.process_peak ?? 0,
        memMb: b.optimized?.memory_info?.rss_avg_mb ?? 0,
        memPeakMb: b.optimized?.memory_info?.rss_peak_mb ?? 0,
        perCore: b.optimized?.per_core_avg ?? [],
        cores: b.optimized?.cpu_count ?? {},
        physicalCores: b.optimized?.cpu_count?.physical ?? {},
        logicalCores: b.optimized?.cpu_count?.logical ?? {}
      },

      speedup: b.speedup ?? 1
    }))
  };
}
