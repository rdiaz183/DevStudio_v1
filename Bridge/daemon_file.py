import time
import json
import os

BRIDGE_DIR = r"C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge"
INBOX_PATH = os.path.join(BRIDGE_DIR, "inbox.txt")
BLENDER_QUEUE = os.path.join(BRIDGE_DIR, "blender_queue.json")

print("[Daemon] File-drop watcher active. Monitoring inbox.txt...")

def ensure_files():
    if not os.path.exists(INBOX_PATH):
        with open(INBOX_PATH, 'w', encoding='utf-8') as f:
            f.write("")
    if not os.path.exists(BLENDER_QUEUE):
        with open(BLENDER_QUEUE, 'w', encoding='utf-8') as f:
            json.dump({"call_stack": []}, f, indent=4)

ensure_files()
last_mtime = os.path.getmtime(INBOX_PATH)

while True:
    try:
        current_mtime = os.path.getmtime(INBOX_PATH)
        if current_mtime != last_mtime:
            last_mtime = current_mtime
            time.sleep(0.1) # brief pause for write completion
            
            # Use utf-8-sig to automatically strip PowerShell BOM headers
            with open(INBOX_PATH, 'r', encoding='utf-8-sig') as f:
                content = f.read().strip()
            
            if content:
                print(f"[Daemon] Captured command: {content}")
                
                if "/blender" in content.lower():
                    with open(BLENDER_QUEUE, 'r', encoding='utf-8-sig') as qf:
                        q_data = json.load(qf)
                    
                    q_data["call_stack"].append({
                        "task": content,
                        "parameters": [{"prompt": content}]
                    })
                    
                    with open(BLENDER_QUEUE, 'w', encoding='utf-8') as qf:
                        json.dump(q_data, qf, indent=4)
                    print("[Daemon] Routed task to blender_queue.json")
                
                with open(INBOX_PATH, 'w', encoding='utf-8') as f:
                    f.write("")
                last_mtime = os.path.getmtime(INBOX_PATH)
                
    except Exception as e:
        print(f"[Daemon Error] {e}")
        
    time.sleep(1.0)
