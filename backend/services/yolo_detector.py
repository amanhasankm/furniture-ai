from ultralytics import YOLO
import cv2
import os

# Load YOLO model
model = YOLO("yolov8n.pt")


def detect_furniture(image_path):

    results = model(image_path)

    result = results[0]

    image = cv2.imread(image_path)

    detections = []

    for box in result.boxes:

        class_id = int(box.cls[0])
        confidence = float(box.conf[0])

        class_name = model.names[class_id]

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        detections.append({
            "class": class_name,
            "confidence": round(confidence, 2),
            "bbox": [x1, y1, x2, y2]
        })

        cv2.rectangle(
            image,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        cv2.putText(
            image,
            f"{class_name} {confidence:.2f}",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 0),
            2
        )

    detected_path = f"uploads/detected_{os.path.basename(image_path)}"

    cv2.imwrite(detected_path, image)

    return {
        "detections": detections,
        "detected_image": detected_path
    }