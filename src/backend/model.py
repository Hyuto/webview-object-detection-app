import os
import json
import numpy as np
import cv2
import onnxruntime

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model", "yolov5s.onnx")
LABEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model", "labels.json")
INPUT_WIDTH = 640
INPUT_HEIGHT = 640
SCORE_THRESHOLD = 0.2
NMS_THRESHOLD = 0.4
CONFIDENCE_THRESHOLD = 0.4


def format_yolov5(frame):
    row, col, _ = frame.shape
    _max = max(col, row)
    result = np.zeros((_max, _max, 3), np.uint8)
    result[0:row, 0:col] = frame
    return result


def wrap_detection(input_image, output_data):
    class_ids = []
    confidences = []
    boxes = []

    rows = output_data.shape[0]

    image_width, image_height, _ = input_image.shape

    x_factor = image_width / INPUT_WIDTH
    y_factor = image_height / INPUT_HEIGHT

    for r in range(rows):
        row = output_data[r]
        confidence = row[4]
        if confidence >= 0.4:

            classes_scores = row[5:]
            _, _, _, max_indx = cv2.minMaxLoc(classes_scores)
            class_id = max_indx[1]
            if classes_scores[class_id] > 0.25:

                confidences.append(confidence)

                class_ids.append(class_id)

                x, y, w, h = row[0].item(), row[1].item(), row[2].item(), row[3].item()
                left = int((x - 0.5 * w) * x_factor)
                top = int((y - 0.5 * h) * y_factor)
                width = int(w * x_factor)
                height = int(h * y_factor)
                box = np.array([left, top, width, height])
                boxes.append(box)

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.25, 0.45)

    result_class_ids = []
    result_confidences = []
    result_boxes = []

    for i in indexes:
        result_confidences.append(confidences[i])
        result_class_ids.append(class_ids[i])
        result_boxes.append(boxes[i])

    return result_class_ids, result_confidences, result_boxes


class YOLOv5Model:
    def __init__(self):
        self.net = onnxruntime.InferenceSession(MODEL_DIR, providers=["CPUExecutionProvider"])
        with open(LABEL_DIR) as reader:
            self.labels = json.load(reader)

    def detect(self, image):
        blob = cv2.dnn.blobFromImage(
            image, 1 / 255.0, (INPUT_WIDTH, INPUT_HEIGHT), swapRB=True, crop=False
        )
        preds = self.net.run(
            [self.net.get_outputs()[0].name], {self.net.get_inputs()[0].name: blob}
        )[0]
        return preds

    def do_detection(self, frame):
        input_image = format_yolov5(frame)
        outs = self.detect(input_image)

        class_ids, _, boxes = wrap_detection(input_image, outs[0])
        colors = [(255, 255, 0), (0, 255, 0), (0, 255, 255), (255, 0, 0)]

        for (classid, box) in zip(class_ids, boxes):
            color = colors[int(classid) % len(colors)]
            cv2.rectangle(frame, box, color, 2)
            cv2.rectangle(frame, (box[0], box[1] - 20), (box[0] + box[2], box[1]), color, -1)
            cv2.putText(
                frame,
                self.labels[classid],
                (box[0], box[1] - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 0, 0),
            )

        return frame
