import os
import sys
import json
from functools import wraps
import webview
from flask import Flask, render_template, jsonify, request, stream_with_context
from .camera import ImgHandler
from .profiler import Profiler

# Template directory
if sys.flags.dev_mode:
    MAIN_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "dist")  # development
else:
    MAIN_DIR = os.path.join(os.getcwd(), "dist")  # production


server = Flask(__name__, template_folder=MAIN_DIR, static_folder=MAIN_DIR, static_url_path="/")
server.config["SEND_FILE_MAX_AGE_DEFAULT"] = 1
img_handler = ImgHandler()
profile = Profiler(pid=os.getpid())


def verify_token(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        token = request.headers.get("token")
        if token == webview.token:
            return function(*args, **kwargs)
        raise Exception("Authentication error")

    return wrapper


@server.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store"
    return response


@server.route("/", defaults={"path": ""})
@server.route("/<path:path>")
def serve(path):
    return render_template("index.html", token=webview.token)


@server.route("/api")
@verify_token
def api():
    return jsonify(
        {
            "model": [
                {
                    "value": img_handler.model.model,
                    "label": img_handler.model.model,
                }
            ],
            "labels": [{"value": x, "label": x.capitalize()} for x in img_handler.model.labels],
            "find": [{"value": x, "label": x.capitalize()} for x in img_handler.model.find],
            "camera": "close" if img_handler.camera is None else "open",
            "image": "close" if img_handler.image is None else "open",
        }
    )


@server.route("/api/change-model", methods=["POST"])
@verify_token
def change_model():
    new_model = request.json["model"]
    status = img_handler.model.change_model(new_model)
    return jsonify(status)


@server.route("/api/change-find", methods=["POST"])
@verify_token
def change_find():
    new_find = request.json["find"]
    status = img_handler.model.change_find(new_find)
    return jsonify(status)


@server.route("/api/open-video-stream", methods=["POST"])
@verify_token
def open_camera():
    status = img_handler.open_video_stream()
    return jsonify(status)


@server.route("/api/close-video-stream", methods=["POST"])
@verify_token
def close_camera():
    status = img_handler.close_video_stream()
    return jsonify(status)


@server.route("/api/video-stream")
def video_stream():
    return server.response_class(
        img_handler.gen_video_frames(), mimetype="multipart/x-mixed-replace; boundary=frame"
    )


@server.route("/api/open-image", methods=["POST"])
@verify_token
def open_image():
    encoded_image = request.json["image"]
    return jsonify(img_handler.open_local_image(encoded_image))


@server.route("/api/close-image", methods=["POST"])
@verify_token
def close_image():
    return jsonify(img_handler.close_local_image())


@server.route("/api/image-stream")
def image_stream():
    return server.response_class(img_handler.gen_image(), mimetype="image/jpeg")


@server.route("/api/cpu-profiler")
def cpu_stream():
    def generator():
        while True:
            data = profile.get_cpu_memory_usage()
            data["fps"] = (
                img_handler.fps[-1]
                if len(img_handler.fps) != 0 and img_handler.camera is not None
                else None
            )
            yield json.dumps(data)

    return server.response_class(stream_with_context(generator()))
