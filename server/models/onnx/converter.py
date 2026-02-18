import torch
import torch.onnx
import os
from torchvision import models
from transformers import (
    AutoModelForSequenceClassification,
    DistilBertForSequenceClassification,
    Wav2Vec2Model
)

ONNX_DIR = "models/onnx"
PRETRAINED_DIR = "models/pretrained"

os.makedirs(ONNX_DIR, exist_ok=True)

def convert_mobilenet():
    model = models.mobilenet_v2()
    model.load_state_dict(torch.load(f"{PRETRAINED_DIR}/mobilenet.pt"))
    model.eval()

    dummy_input = torch.randn(1, 3, 224, 224)

    torch.onnx.export(
        model,
        dummy_input,
        f"{ONNX_DIR}/mobilenet.onnx",
        export_params=True,
        opset_version=18,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
        dynamo=False
    )

def convert_resnet18():
    model = models.resnet18()
    model.load_state_dict(torch.load(f"{PRETRAINED_DIR}/resnet18.pt"))
    model.eval()

    dummy_input = torch.randn(1, 3, 224, 224)

    torch.onnx.export(
        model,
        dummy_input,
        f"{ONNX_DIR}/resnet18.onnx",
        export_params=True,
        opset_version=18,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
        dynamo=False
    )

def convert_efficientnet_b0():
    model = models.efficientnet_b0()
    model.load_state_dict(torch.load(f"{PRETRAINED_DIR}/efficientnet_b0.pt"))
    model.eval()

    dummy_input = torch.randn(1, 3, 224, 224)

    torch.onnx.export(
        model,
        dummy_input,
        f"{ONNX_DIR}/efficientnet_b0.onnx",
        export_params=True,
        opset_version=18,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
        dynamo=False
    )

def convert_minibert():
    model = AutoModelForSequenceClassification.from_pretrained("prajjwal1/bert-mini")
    model.load_state_dict(torch.load(f"{PRETRAINED_DIR}/minibert.pt"))
    model.eval()

    dummy_input = torch.randint(0, 1000, (1, 128), dtype=torch.long)

    torch.onnx.export(
        model,
        (dummy_input,),
        f"{ONNX_DIR}/minibert.onnx",
        export_params=True,
        opset_version=18,
        input_names=["input_ids"],
        output_names=["output"],
        dynamic_axes={"input_ids": {0: "batch_size"}, "output": {0: "batch_size"}},
        dynamo=False
    )

def convert_distilbert():
    model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased")
    model.load_state_dict(torch.load(f"{PRETRAINED_DIR}/distilbert.pt"))
    model.eval()

    dummy_input = torch.randint(0, 1000, (1, 128), dtype=torch.long)

    torch.onnx.export(
        model,
        (dummy_input,),
        f"{ONNX_DIR}/distilbert.onnx",
        export_params=True,
        opset_version=18,
        input_names=["input_ids"],
        output_names=["output"],
        dynamic_axes={"input_ids": {0: "batch_size"}, "output": {0: "batch_size"}},
        dynamo=False
    )

def convert_wav2vec2_tiny():
    model = Wav2Vec2Model.from_pretrained("patrickvonplaten/wav2vec2_tiny_random")
    model.load_state_dict(torch.load(f"{PRETRAINED_DIR}/wav2vec2_tiny.pt"))
    model.eval()

    dummy_input = torch.randn(1, 16000)

    torch.onnx.export(
        model,
        dummy_input,
        f"{ONNX_DIR}/wav2vec2_tiny.onnx",
        export_params=True,
        opset_version=18,
        input_names=["audio"],
        output_names=["output"],
        dynamic_axes={"audio": {0: "batch_size", 1: "time"}, "output": {0: "batch_size"}},
        dynamo=False
    )

if __name__ == "__main__":
    convert_mobilenet()
    convert_resnet18()
    convert_efficientnet_b0()
    convert_minibert()
    convert_distilbert()
    convert_wav2vec2_tiny()