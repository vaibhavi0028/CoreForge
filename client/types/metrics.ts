export type ModelName =
  | "MobileNet"
  | "ResNet18"
  | "EfficientNetB0"
  | "MiniBERT"
  | "DistilBERT"
  | "Wav2Vec2Tiny";

export type ModelCategory = "CNN" | "Transformer" | "Audio";

export interface ModelInfo {
  name: ModelName;
  category: ModelCategory;
  description: string;
  params: string;
}

export interface PhaseMetrics {
  latency: number;
  p95: number;

  cpuAvg: number;
  cpuPeak: number;

  memMb: number;
  memPeakMb: number;

  perCore: number[];
  cores: {
    physical: number;
    logical: number;
  };
}

export interface BenchmarkMetrics {
  model: ModelName;

  baseline: PhaseMetrics;
  optimized: PhaseMetrics;

  speedup: number;
}

export interface BenchmarkRun {
  id: string;
  timestamp: string;
  models: ModelName[];
  totalDurationMs: number;
  metrics: BenchmarkMetrics[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}
