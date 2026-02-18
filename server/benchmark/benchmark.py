import os
import json
import time
from inference.baseline.runner import BaselineRunner
from inference.optimized.runner import OptimizedRunner
from utils.dummy_input import DummyInputGenerator
from utils.logger import get_logger

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../")
)
RESULTS_DIR = os.path.join(BASE_DIR, "results", "metrics")
LOG_DIR = os.path.join(BASE_DIR, "results", "logs")

ONNX_DIR = os.path.join(BASE_DIR, "models", "onnx")
QUANT_DIR = os.path.join(BASE_DIR, "models", "quantized")

class BenchmarkEngine:
    def __init__(self):
        os.makedirs(RESULTS_DIR, exist_ok=True)
        self.logger = get_logger( log_file=os.path.join(LOG_DIR, "benchmark.log") )

        self.model_configs = {
            "MobileNet": (
                os.path.join(ONNX_DIR, "mobilenet.onnx"),
                os.path.join(QUANT_DIR, "mobilenet_int8.onnx")
            ),
            "ResNet18": (
                os.path.join(ONNX_DIR, "resnet18.onnx"),
                os.path.join(QUANT_DIR, "resnet18_int8.onnx")
            ),
            "EfficientNetB0": (
                os.path.join(ONNX_DIR, "efficientnet_b0.onnx"),
                os.path.join(QUANT_DIR, "efficientnet_b0_int8.onnx")
            ),
            "MiniBERT": (
                os.path.join(ONNX_DIR, "minibert.onnx"),
                os.path.join(QUANT_DIR, "minibert_int8.onnx")
            ),
            "DistilBERT": (
                os.path.join(ONNX_DIR, "distilbert.onnx"),
                os.path.join(QUANT_DIR, "distilbert_int8.onnx")
            ),
            "Wav2Vec2Tiny": (
                os.path.join(ONNX_DIR, "wav2vec2_tiny.onnx"),
                os.path.join(QUANT_DIR, "wav2vec2_tiny_int8.onnx")
            )
        }

    def run_model(self, name, baseline_path, optimized_path):
        baseline_runner = BaselineRunner(baseline_path)
        optimized_runner = OptimizedRunner(optimized_path)

        generator_base = DummyInputGenerator(baseline_path)
        generator_opt = DummyInputGenerator(optimized_path)

        baseline_metrics = baseline_runner.run(generator_base.generate())
        optimized_metrics = optimized_runner.run(generator_opt.generate())

        speedup = baseline_metrics["avg_latency_ms"] / optimized_metrics["avg_latency_ms"]

        return {
            "model": name,
            "baseline": baseline_metrics,
            "optimized": optimized_metrics,
            "speedup": speedup
        }

    def run(self):
        self.logger.info("Starting benchmark")

        results = {
            "timestamp": time.time(),
            "benchmarks": []
        }

        for model_name, (base_path, opt_path) in self.model_configs.items():
            self.logger.info(f"Running {model_name}")
            results["benchmarks"].append(
                self.run_model(model_name, base_path, opt_path)
            )

        output_path = os.path.join(RESULTS_DIR, f"benchmark_{int(time.time())}.json")

        with open(output_path, "w") as f:
            json.dump(results, f, indent=2)

        self.print_table(results["benchmarks"])

        self.logger.info(f"Results saved to: {output_path}")

        return output_path

    def print_table(self, benchmarks):
        header = (
            f"{'Model':<14}"
            f"{'Base(ms)':>12}"
            f"{'Opt(ms)':>12}"
            f"{'P95 Base':>12}"
            f"{'P95 Opt':>12}"
            f"{'Speedup':>10}"
        )

        self.logger.info(header)
        self.logger.info("-" * len(header))

        for b in benchmarks:
            base = b["baseline"]
            opt = b["optimized"]

            row = (
                f"{b['model']:<14}"
                f"{base['avg_latency_ms']:>12.2f}"
                f"{opt['avg_latency_ms']:>12.2f}"
                f"{base['p95_latency_ms']:>12.2f}"
                f"{opt['p95_latency_ms']:>12.2f}"
                f"{b['speedup']:>10.2f}x"
            )

            self.logger.info(row)

if __name__ == "__main__":
    engine = BenchmarkEngine()
    engine.run()