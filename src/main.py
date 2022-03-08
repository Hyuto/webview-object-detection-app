import os
import sys
import webview
from backend.server import server, img_handler

DEBUG = True


def get_web_engine():
    """Get web engine based on os. if you're on linux 'Qt' will automatically
    be used and if you're in windows 'Webview2 Edge Chromium' will be used"""
    if sys.platform == "win32":
        return "edgechromium"
    elif sys.platform in ["linux", "linux2"]:
        return "qt"
    raise "Not supported platform"


def webview_app():
    """Webview Application"""
    server.debug = DEBUG
    webview.create_window("webview-object-detection-app", server, min_size=(741, 650))
    webview.start(gui=get_web_engine(), debug=DEBUG)

    if img_handler.camera is not None:  # Close webcam if it still on when the app is closed
        _ = img_handler.close_video_stream()


if __name__ == "__main__":
    if sys.flags.dev_mode:
        # Please don't delete code bellow to enable
        # auto reload when your react code have changes
        from utils import run_frontend_watcher, wait_template

        # Wait template to be compiled when first launch
        wait_template(os.path.join(os.getcwd(), "dist"))
        # Run template watcher
        template_dir = os.path.join(os.getcwd(), "src", "frontend")
        run_frontend_watcher(template_dir=template_dir)

    webview_app()  # Start the app
