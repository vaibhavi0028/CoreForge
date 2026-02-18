import onnxruntime as ort
import numpy as np
from system.affinity.core_affinity import set_core_affinity
from system.profiling.cpu_profiler import CPUProfiler
from utils.dummy_input import DummyInputGenerator
from utils.timer import Timer

class OptimizedRunner:
    def __init__(self, model_path):
        set_core_affinity(0)

        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 1
        opts.inter_op_num_threads = 1
        opts.add_session_config_entry("session.intra_op.allow_spinning", "0")
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        self.session = ort.InferenceSession(
            model_path,
            sess_options=opts,
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name

    def run(self, inputs, runs=50):
        profiler = CPUProfiler()
        profiler.start()

        latencies = []

        for _ in range(runs):
            timer = Timer()
            timer.start()
            self.session.run(None, inputs)
            timer.stop()
            latencies.append(timer.elapsed_ms())

        profiler.stop()
        cpu_stats = profiler.summary()

        return {
            "avg_latency_ms": float(np.mean(latencies)),
            "p95_latency_ms": float(np.percentile(latencies, 95)),
            **cpu_stats
        }


if __name__ == "__main__":
    model_paths = {
        "MobileNet": "models/quantized/mobilenet_int8.onnx",
        "ResNet18": "models/quantized/resnet18_int8.onnx",
        "EfficientNetB0": "models/quantized/efficientnet_b0_int8.onnx",
        "MiniBERT": "models/quantized/minibert_int8.onnx",
        "DistilBERT": "models/quantized/distilbert_int8.onnx",
        "Wav2Vec2Tiny": "models/quantized/wav2vec2_tiny_int8.onnx"
    }

    for model_name, model_path in model_paths.items():
        print(f"\nRunning optimized for {model_name}")

        runner = OptimizedRunner(model_path)
        generator = DummyInputGenerator(model_path)
        inputs = generator.generate()

        metrics = runner.run(inputs)
        print(metrics)