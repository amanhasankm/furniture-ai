from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from services.yolo_detector import detect_furniture
from fastapi.staticfiles import StaticFiles
app = FastAPI()
app = FastAPI()
# Enable frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
UPLOAD_FOLDER = "uploads"
@app.get("/")
def home():
    return {"message": "Furniture AI Backend Running"}
# Create uploads folder automatically
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run YOLO detection
    detection_result = detect_furniture(file_path)

    return {
        "filename": file.filename,
        "path": file_path,
        "message": "Upload successful",
        "detections": detection_result["detections"],
        "detected_image": f"http://127.0.0.1:8001/{detection_result['detected_image']}"
    }