import cv2
import numpy as np
import torch
from PIL import Image

# Load YOLOv5 model
try:
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
except Exception as e:
    print("Error loading YOLOv5 model:", e)
    exit()

# Function to detect objects using YOLOv5
def detect_objects(image):
    results = model(image)
    classes = results.names
    detections = results.xyxy[0]
    
    vehicle_classes = ['car', 'bus', 'motorcycle', 'bike', 'truck', 'lorry', 'van']
    vehicle_confidence = sum(1 for detection in detections if classes[int(detection[5])] in vehicle_classes and detection[4] > 0.75)
    
    if vehicle_confidence >= 0.75:
        return 100
    elif vehicle_confidence == 0:
        return 0
    else:
        return 80

# Function to compute edge clarity score
def compute_edge_clarity_score(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_image, 100, 200)
    num_edge_pixels = np.sum(edges) / 255
    edge_clarity_score = num_edge_pixels / (gray_image.shape[0] * gray_image.shape[1])
    return edge_clarity_score

# Function to interpret edge clarity score
def interpret_clarity_score(score):
    if score >= 0.062:
        return "Excellent clarity"
    elif score >= 0.061:
        return "Good clarity"
    elif score >= 0.06:
        return "Average clarity"
    else:
        return "Poor clarity"

# Main function
def main(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            print("Error: Unable to load image.")
            exit()
    except Exception as e:
        print("Error loading image:", e)
        exit()

    # Perform object detection
    try:
        car_confidence_score = detect_objects(image.copy())
    except Exception as e:
        print("Error detecting objects:", e)
        car_confidence_score = 0

    # Compute edge clarity score
    try:
        clarity_score = compute_edge_clarity_score(image)
    except Exception as e:
        print("Error computing edge clarity score:", e)
        clarity_score = 0

    # Interpret clarity score
    interpretation = interpret_clarity_score(clarity_score)

    # Calculate total score
    total_score = car_confidence_score
    if interpretation != "Poor clarity":
        total_score -= 25

    print( total_score)

import sys

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ip.py <image_path>")
        exit(1)
    
    image_path = sys.argv[1]
    main(image_path)
