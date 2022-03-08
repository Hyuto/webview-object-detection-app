import os
import sys
import webview
from backend.server import server, img_handler

DEBUG = True

def get_web_engine():
    if sys.platform == "win32":
        return "edgechromium"
    elif sys.platform in ["linux", "linux2"]:
        return "qt"
    else:
        raise "Not supported platform"

def webview_app(web_engine):
    server.debug = DEBUG
    webview.create_window("webview-object-detection-app", server, min_size=(741, 650))
    webview.start(gui=web_engine, debug=DEBUG)

    if img_handler.camera is not None:
        _ = img_handler.close_video_stream()


if __name__ == "__main__":
    if sys.flags.dev_mode:
        # Please don't delete code bellow to enable
        # auto reload when your react code have changes
        from utils import run_frontend_watcher

        template_dir = os.path.join(os.getcwd(), "src", "frontend")
        run_frontend_watcher(template_dir=template_dir)

    web_engine = get_web_engine()
    webview_app(web_engine = web_engine)
