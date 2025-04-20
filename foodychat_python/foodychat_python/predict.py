import torch
from torchvision import transforms
from PIL import Image
from DataBase import SessionLocal
from cnn_models import Food
import torch.nn as nn
from torchvision import models
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#MODEL_PATH = os.path.join(BASE_DIR, "model", "checkpoint_epoch_156.pth")
MODEL_PATH = os.path.join(BASE_DIR, "model", "checkpoint_epoch_195.pth")

class CustomCNN(nn.Module):
    def __init__(self, num_classes, dropout_rate=0.4):
        super(CustomCNN, self).__init__()
        self.block1 = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2),
            nn.Dropout(dropout_rate)
        )

        self.block2 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2),
            nn.Dropout(dropout_rate)
        )

        self.block3 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2),
            nn.Dropout(dropout_rate)
        )

        self.global_pool = nn.AdaptiveAvgPool2d((1, 1))

        self.classifier = nn.Sequential(
            nn.Linear(256, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.block1(x)
        x = self.block2(x)
        x = self.block3(x)
        x = self.global_pool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x

# ✅ 클래스 이름 로딩
def get_class_names():
    session = SessionLocal()
    foods = session.query(Food).order_by(Food.food_id).all()
    #foods = session.query(Food).order_by(Food.food_id).limit(101).all()
    session.close()
    return [food.food_name for food in foods]  # ✅ DB의 food_name 컬럼 사용

CLASS_NAMES = get_class_names()

# ✅ 모델 인스턴스 생성 및 가중치 로딩
model = CustomCNN(num_classes=len(CLASS_NAMES))
checkpoint = torch.load(MODEL_PATH, map_location=torch.device("cpu"))
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

# Preprocessing pipeline
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

def predict_food(image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        top5 = torch.topk(probabilities, 5)

    result = []
    for idx, prob in zip(top5.indices, top5.values):
        result.append({
            "className": CLASS_NAMES[idx.item()],
            "probability": prob.item()
        })

    return {
        "predictedClass": result[0]["className"],
        "confidence": result[0]["probability"],
        "topK": result
    }