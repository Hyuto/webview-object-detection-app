import os
import sys
import json
import numpy as np
import cv2
import onnxruntime

if sys.flags.dev_mode:
    MAIN_DIR = os.path.join(os.path.dirname(__file__), "..")  # development
else:
    MAIN_DIR = os.getcwd()


class YOLOv5Model:
    models_dir = os.path.join(MAIN_DIR, "model")
    input_width = 640
    input_height = 640
    model = "yolov5n"
    find = []

    def __init__(self):
        self.net = onnxruntime.InferenceSession(
            os.path.join(self.models_dir, f"{self.model}.onnx"), providers=["CPUExecutionProvider"]
        )
        with open(os.path.join(self.models_dir, "labels.json")) as reader:
            self.labels = json.load(reader)

    def change_model(self, new_model):
        self.model = new_model["value"]
        self.net = onnxruntime.InferenceSession(
            os.path.join(self.models_dir, f"{new_model['value']}.onnx"),
            providers=["CPUExecutionProvider"],
        )
        return {"success": True, "model": new_model}

    def change_find(self, new_find):
        format_find = [x["value"] for x in new_find]
        if format_find != self.find:
            self.find = format_find
            return {"success": True, "find": new_find}
        return {"success": False, "message": "Same find parameters!"}

    def format(self, frame):
        row, col, _ = frame.shape
        _max = max(col, row)
        result = np.zeros((_max, _max, 3), np.uint8)
        result[0:row, 0:col] = frame
        return result

    def detect(self, image):
        blob = cv2.dnn.blobFromImage(
            image, 1 / 255.0, (self.input_width, self.input_height), swapRB=True, crop=False
        )
        preds = self.net.run(
            [self.net.get_outputs()[0].name], {self.net.get_inputs()[0].name: blob}
        )[0]
        return preds

    def wrap_detection(self, input_image, output_data):
        class_ids, confidences, boxes = [], [], []
        rows = output_data.shape[0]
        image_width, image_height, _ = input_image.shape
        x_factor = image_width / self.input_width
        y_factor = image_height / self.input_height

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
        result_class_ids, result_confidences, result_boxes = [], [], []
        for i in indexes:
            if self.find != [] and self.labels[class_ids[i]] not in self.find:
                continue
            result_confidences.append(confidences[i])
            result_class_ids.append(class_ids[i])
            result_boxes.append(boxes[i])

        return result_class_ids, result_confidences, result_boxes

    def do_detection(self, frame):
        input_image = self.format(frame)
        outs = self.detect(input_image)
        class_ids, _, boxes = self.wrap_detection(input_image, outs[0])
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
