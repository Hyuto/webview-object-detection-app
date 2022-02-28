import cv2
from .model import YOLOv5Model


class CameraStream:
    camera = None
    model = YOLOv5Model()

    def open(self):
        if self.camera is None:
            try:
                self.camera = cv2.VideoCapture(0)
                return {"success": True}
            except Exception as error:
                print(error)
                return {"success": False, "message": str(error)}
        return {"success": True}

    def close(self):
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
        return {"success": False, "message": "Please open camera first"}

    def gen_frames(self):
        while self.camera is not None:
            success, frame = self.camera.read()

            if success:
                frame = self.model.do_detection(frame)
                _, buffer = cv2.imencode(".jpg", frame)
                frame = buffer.tobytes()
                yield b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n"
            else:
                break
