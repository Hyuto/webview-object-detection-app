import base64
from time import time
import numpy as np
import cv2
from .model import YOLOv5Model


class ImgHandler:
    camera = None
    image = None
    fps = []
    model = YOLOv5Model()

    def open_video_stream(self):
        if self.camera is None and self.image is None:
            try:
                self.camera = cv2.VideoCapture(0)
                return {"success": True}
            except Exception as error:
                print(error)
                return {"success": False, "message": str(error)}
        elif self.image is not None:
            return {"success": False, "message": "Please reset the image first!"}
        return {"success": False, "message": "Camera is already opened"}

    def close_video_stream(self):
        if self.camera is not None:
            try:
                # Release cam
                self.camera.release()
                del self.camera  # Clear pointer

                # Set cam to none
                self.camera = None
                return {"success": True}
            except Exception as error:
                return {"success": False, "message": str(error)}
        return {"success": False, "message": "Please open camera first!"}

    def gen_video_frames(self):
        start_time, new_time = 0, 0

        while self.camera is not None:
            success, frame = self.camera.read()

            if success:
                frame = self.model.do_detection(frame)  # detecting
                _, buffer = cv2.imencode(".jpg", frame)
                frame = buffer.tobytes()

                # count fps
                new_time = time()
                self.fps.append(1 / (new_time - start_time))
                start_time = new_time

                yield b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
            else:
                break

    def open_local_image(self, encoded_image):
        if self.camera is None:
            try:
                np_arr = np.frombuffer(base64.b64decode(encoded_image), np.uint8)
                image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
                self.image = self.model.do_detection(image)
                return {"success": True}
            except Exception as error:
                return {"success": False, "message": str(error)}
        return {"success": False, "message": "Please close camera stream first!"}

    def close_local_image(self):
        if self.image is not None:
            self.image = None
            return {"success": True}
        return {"success": False, "message": "No image to close!"}

    def gen_image(self):
        _, buffer = cv2.imencode(".jpg", self.image)
        return buffer.tobytes()
