import os

app_code = '''# desktop_app.py
import threading
import time
import webview
import uvicorn
from backend.main import app

def run_backend():
    # Start the FastAPI engine in the background
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

if __name__ == "__main__":
    # 1. Launch FastAPI backend in a background thread
    server_thread = threading.Thread(target=run_backend, daemon=True)
    server_thread.start()

    # 2. Give the server a brief moment to spin up
    time.sleep(1.0)

    # 3. Launch native Windows desktop app window loading frontend/index.html
    frontend_path = os.path.abspath("frontend/index.html")
    
    window = webview.create_window(
        title="Dev Studio - Native Desktop AI Platform (Game Dev V1)",
        url=f"file://{frontend_path}",
        width=1380,
        height=880,
        resizable=True,
        min_size=(1024, 728)
    )

    # 4. Start native desktop app event loop
    webview.start()
'''

with open("desktop_app.py", "w", encoding="utf-8") as f:
    f.write(app_code)

print("SUCCESS: desktop_app.py created successfully!")
