import numpy as np
import onnxruntime as ort


class DummyInputGenerator:
    def __init__(self, model_path):
        self.session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"]
        )
        self.inputs_meta = self.session.get_inputs()

    def _normalize_shape(self, shape):
        final_shape = []

        for dim in shape:
            if isinstance(dim, str) or dim is None:
                final_shape.append(1)
            else:
                final_shape.append(dim)

        return final_shape

    def _float_input(self, shape, name):
        if len(shape) == 4:
            return np.random.randn(*shape).astype(np.float32)

        if len(shape) == 2 and shape[1] <= 10:
            shape[1] = 16000
            return np.random.uniform(-1, 1, shape).astype(np.float32)

        if len(shape) == 2 and shape[1] > 8000:
            return np.random.uniform(-1, 1, shape).astype(np.float32)

        return np.random.randn(*shape).astype(np.float32)

    def _int64_input(self, shape):
        return np.random.randint(0, 30522, size=shape, dtype=np.int64)

    def _int32_input(self, shape):
        return np.random.randint(0, 100, size=shape, dtype=np.int32)

    def generate(self):
        inputs = {}

        for meta in self.inputs_meta:
            shape = self._normalize_shape(meta.shape)

            if meta.type == "tensor(float)":
                arr = self._float_input(shape, meta.name)

            elif meta.type == "tensor(int64)":
                arr = self._int64_input(shape)

            elif meta.type == "tensor(int32)":
                arr = self._int32_input(shape)

            else:
                arr = np.random.randn(*shape).astype(np.float32)

            inputs[meta.name] = arr

        return inputs
