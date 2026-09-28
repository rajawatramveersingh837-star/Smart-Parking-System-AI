from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import shutil
import os

app = FastAPI(
    title="Smart Parking AI Service",
    description="AI service for Smart Parking System",
    version="1.0.0"
)

# Load YOLO model
model = YOLO("yolo11n.pt")


@app.get("/")
def home():
    return {
        "message": "Smart Parking AI Service Running"
    }


@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "AI Service"
    }


@app.post("/detect")
async def detect_vehicle(file: UploadFile = File(...)):

    file_path = "uploaded_image.jpg"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model(file_path)

    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            class_name = model.names[class_id]

            detections.append({
                "class": class_name,
                "confidence": round(confidence, 2)
            })

    # Delete temporary image
    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "success": True,
        "detections": detections,
        "total_objects": len(detections)
    }