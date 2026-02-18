import os
from onnxruntime.quantization import quantize_dynamic, QuantType


def quantize_model(model_name, model_type):
    input_model = f"models/onnx/{model_name}.onnx"
    output_model = f"models/quantized/{model_name}_int8.onnx"

    if not os.path.exists(input_model):
        print(f"Skipping: {input_model} not found.")
        return

    print(f"Quantizing {model_name}...")

    if model_type == "cnn":
        ops_to_quantize = ["MatMul"]
    else:
        ops_to_quantize = [
            "MatMul",
            "Gather",
            "Transpose",
            "Add",
            "Mul"
        ]

    quantize_dynamic(
        model_input=input_model,
        model_output=output_model,
        weight_type=QuantType.QUInt8,
        op_types_to_quantize=ops_to_quantize
    )

    print(f"Finished: {output_model}")


if __name__ == "__main__":
    quantize_model("mobilenet", "cnn")
    quantize_model("resnet18", "cnn")
    quantize_model("efficientnet_b0", "cnn")
    quantize_model("minibert", "nlp")
    quantize_model("distilbert", "nlp")
    quantize_model("wav2vec2_tiny", "audio")
