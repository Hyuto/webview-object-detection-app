import os
import sys
import webview
from backend.server import server, camera

DEBUG = True


def webview_app():
    server.debug = DEBUG
    webview.create_window("webview-object-detection-app", server)
    webview.start(debug=DEBUG)

    if camera.camera is not None:
        _ = camera.close()


if __name__ == "__main__":
    if sys.flags.dev_mode:
        # Please don't delete code bellow to enable
        # auto reload when your react code have changes
        from utils import run_frontend_watcher

        template_dir = os.path.join(os.getcwd(), "src", "frontend")
        run_frontend_watcher(template_dir=template_dir)

    webview_app()
