import os
import torch
from torchvision import models
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    Wav2Vec2Model,
    Wav2Vec2Processor
)

BASE_DIR = "models/pretrained"
os.makedirs(BASE_DIR, exist_ok=True)


def download_mobilenet():
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    model.eval()
    torch.save(model.state_dict(), os.path.join(BASE_DIR, "mobilenet.pt"))


def download_resnet18():
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.eval()
    torch.save(model.state_dict(), os.path.join(BASE_DIR, "resnet18.pt"))


def download_efficientnet_b0():
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    model.eval()
    torch.save(model.state_dict(), os.path.join(BASE_DIR, "efficientnet_b0.pt"))


def download_minibert():
    model_name = "prajjwal1/bert-mini"
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model.eval()

    torch.save(model.state_dict(), os.path.join(BASE_DIR, "minibert.pt"))
    tokenizer.save_pretrained(os.path.join(BASE_DIR, "tokenizer_minibert"))


def download_distilbert():
    model_name = "distilbert-base-uncased"
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model.eval()

    torch.save(model.state_dict(), os.path.join(BASE_DIR, "distilbert.pt"))
    tokenizer.save_pretrained(os.path.join(BASE_DIR, "tokenizer_distilbert"))


def download_wav2vec2_tiny():
    model_name = "patrickvonplaten/wav2vec2_tiny_random"
    model = Wav2Vec2Model.from_pretrained(model_name)
    processor = Wav2Vec2Processor.from_pretrained(model_name)
    model.eval()

    torch.save(model.state_dict(), os.path.join(BASE_DIR, "wav2vec2_tiny.pt"))
    processor.save_pretrained(os.path.join(BASE_DIR, "processor_wav2vec2_tiny"))


if __name__ == "__main__":
    download_mobilenet()
    download_resnet18()
    download_efficientnet_b0()
    download_minibert()
    download_distilbert()
    download_wav2vec2_tiny()