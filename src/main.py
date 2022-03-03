import os
import sys
import webview
from backend.server import server, img_handler

DEBUG = True


def webview_app():
    server.debug = DEBUG
    webview.create_window("webview-object-detection-app", server, min_size=(617, 650))
    webview.start(debug=DEBUG)

    if img_handler.camera is not None:
        _ = img_handler.close_video_stream()


if __name__ == "__main__":
    if sys.flags.dev_mode:
        # Please don't delete code bellow to enable
        # auto reload when your react code have changes
        from utils import run_frontend_watcher

        template_dir = os.path.join(os.getcwd(), "src", "frontend")
        run_frontend_watcher(template_dir=template_dir)

    webview_app()
