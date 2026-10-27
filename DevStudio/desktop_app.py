# desktop_app.py
import os
import threading
import time
import webview
import uvicorn
from backend.main import app

def run_backend():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

if __name__ == "__main__":
    server_thread = threading.Thread(target=run_backend, daemon=True)
    server_thread.start()
    time.sleep(1.0)
    
    frontend_path = os.path.abspath("frontend/index.html")
    
    window = webview.create_window(
        title="Dev Studio - Native Desktop AI Platform (Game Dev V1)",
        url=f"file://{frontend_path}",
        width=1380,
        height=880,
        resizable=True,
        min_size=(1024, 728)
    )
    
    webview.start()
