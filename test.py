import cv2
import torch

def load_image(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Unable to load image.")
        return image
    except Exception as e:
        print("Error loading image:", e)
        return None

def detect_objects(image, model):
    try:
        results = model(image)
        detected_objects = results.pandas().xyxy[0]
        detected_objects1 = detected_objects[detected_objects['confidence'] > 0.5]    
        confidence_count = len(detected_objects1)
        print(confidence_count)
        for _, row in detected_objects.iterrows():
            print(row['confidence'])
            print(row)

        return detected_objects
    except Exception as e:
        print("Error detecting objects:", e)
        return None

def draw_boxes(image, detected_objects):
    try:
        for _, row in detected_objects.iterrows():
            x1, y1, x2, y2 = int(row['xmin']), int(row['ymin']), int(row['xmax']), int(row['ymax'])
            confidence = row['confidence']
            label = row['name']
            color = (0, 255, 0)  # Green color for bounding box
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            cv2.putText(image, f'{label} {confidence:.2f}', (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
        return image
    except Exception as e:
        print("Error drawing boxes:", e)
        return image

def main():
    image_path = "test.jpg"  # Replace with the actual image path

    image = load_image(image_path)
    if image is None:
        return

    try:
        model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt')
    except Exception as e:
        print("Error loading YOLOv5 model:", e)
        return

    detected_objects = detect_objects(image, model)
    if detected_objects is not None:
        image_with_boxes = draw_boxes(image, detected_objects)
        try:
            cv2.imwrite("output.jpg", image_with_boxes)  # Save the image with detections
            cv2.imshow("Detections", image_with_boxes)  # Display the image
            cv2.waitKey(0)
        except Exception as e:
            print("Error displaying image:", e)
        finally:
            cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
