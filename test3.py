import cv2
import numpy as np
import torch
import sys

def load_model():
    try:
        model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt')
        return model
    except Exception as e:
        print("Error loading model:", e)
        sys.exit()

# Load image
def load_image(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Unable to load image.")
        return image
    except Exception as e:
        print("Error loading image:", e)
        return None

# Detect objects in the image
def detect_objects(image, model):
    try:
        results = model(image)
        detected_objects = results.pandas().xyxy[0]
        detected_objects = detected_objects[detected_objects['confidence'] == detected_objects['confidence'].max()]
        return detected_objects
    except Exception as e:
        print("Error detecting objects:", e)
        return None

# Compute edge clarity score
def compute_edge_clarity_score(image):
    try:
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray_image, 100, 200)
        num_edge_pixels = np.sum(edges) / 255
        edge_clarity_score = num_edge_pixels / (gray_image.shape[0] * gray_image.shape[1])
        return edge_clarity_score
    except Exception as e:
        print("Error computing edge clarity score:", e)
        return 0

# Interpret edge clarity score
def interpret_clarity_score(score):
    if score >= 0.062:
        return "e"
    elif score >= 0.061:
        return "g"
    elif score >= 0.06:
        return "a"
    else:
        return "p"

def main():
    image_path = 'test.jpg'
    image = load_image(image_path)
    if image is None:
        return

    model = load_model()

    detected_objects = detect_objects(image, model)
    
    # Compute and print edge clarity score
    clarity_score = compute_edge_clarity_score(image)
 
    interpretation = interpret_clarity_score(clarity_score)


    # Calculate and print total score
    
    con = float(detected_objects['confidence'])
    con2 = int(con*100)
    # car_confidence_score = vehicle_confidence * 100 if vehicle_confidence >= 0.5 else vehicle_confidence * 0.7 if vehicle_confidence else 0

    total_score = 
    if interpretation == "p":
        total_score -= 25
    elif interpretation == "a":
        total_score += 0
    elif interpretation == "g":
        total_score += 25
    elif interpretation == "e":
        total_score += 50

    print(total_score)


if __name__ == "__main__":
    
    main()
