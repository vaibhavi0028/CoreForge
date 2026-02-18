import onnxruntime as ort
import numpy as np
from system.profiling.cpu_profiler import CPUProfiler
from utils.dummy_input import DummyInputGenerator
from utils.timer import Timer

class BaselineRunner:
    def __init__(self, model_path):
        self.session = ort.InferenceSession(
            model_path,
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
        "MobileNet": "models/onnx/mobilenet.onnx",
        "ResNet18": "models/onnx/resnet18.onnx",
        "EfficientNetB0": "models/onnx/efficientnet_b0.onnx",
        "MiniBERT": "models/onnx/minibert.onnx",
        "DistilBERT": "models/onnx/distilbert.onnx",
        "Wav2Vec2Tiny": "models/onnx/wav2vec2_tiny.onnx"
    }

    for model_name, model_path in model_paths.items():
        print(f"\nRunning baseline for {model_name}")

        runner = BaselineRunner(model_path)
        generator = DummyInputGenerator(model_path)
        inputs = generator.generate()

        metrics = runner.run(inputs)
        print(metrics)