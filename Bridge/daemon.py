import time
import json
import os

PROMPT_PATH = r"C:\DevStudio\Incoming\prompt.json"
WORKSPACE_BASE = r"C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace\Bridge"

TARGETS = {
    "unreal": os.path.join(WORKSPACE_BASE, "state_machine.json"),
    "blender": os.path.join(WORKSPACE_BASE, "blender_queue.json"),
    "vs": os.path.join(WORKSPACE_BASE, "vs_tasks.json")
}

print("Robust Multi-Tool Bridge Daemon active. Monitoring incoming prompts & JSON payloads...")

last_mtime = 0
while True:
    try:
        if os.path.exists(PROMPT_PATH):
            mtime = os.path.getmtime(PROMPT_PATH)
            if mtime != last_mtime:
                last_mtime = mtime
                with open(PROMPT_PATH, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                raw_text = data.get("prompt", "")
                
                # 1. Global Substring Fallback Check First (Catches prefixes even in malformed JSON)
                target_key = "unreal"
                if "/blender" in raw_text:
                    target_key = "blender"
                elif "/vs" in raw_text or "/visualstudio" in raw_text:
                    target_key = "vs"
                elif "/unreal" in raw_text:
                    target_key = "unreal"

                # 2. Attempt JSON Extraction for Cleaner Task Descriptions
                extracted_text = raw_text
                try:
                    parsed_json = json.loads(raw_text)
                    if isinstance(parsed_json, dict):
                        params = parsed_json.get("parameters", {})
                        content_val = params.get("content") or params.get("prompt") or parsed_json.get("name")
                        
                        tasks_val = params.get("tasks")
                        if tasks_val:
                            if isinstance(tasks_val, str):
                                try:
                                    inner_list = json.loads(tasks_val)
                                    if isinstance(inner_list, list) and len(inner_list) > 0:
                                        content_val = inner_list[0].get("content") or inner_list[0].get("prompt") or content_val
                                except:
                                    pass
                            elif isinstance(tasks_val, list) and len(tasks_val) > 0:
                                content_val = tasks_val[0].get("content") or tasks_val[0].get("prompt") or content_val

                        if content_val:
                            extracted_text = content_val
                except:
                    pass

                # Clean up prefix from extracted text if present
                extracted_text = extracted_text.replace("/blender", "").replace("/vs", "").replace("/visualstudio", "").replace("/unreal", "").strip()

                target_path = TARGETS[target_key]
                print(f"[Daemon] Routing task to [{target_key.upper()}] -> {str(extracted_text)[:40]}...")

                if os.path.exists(target_path):
                    with open(target_path, 'r', encoding='utf-8') as sf:
                        target_data = json.load(sf)
                else:
                    target_data = {"call_stack": []}

                if isinstance(target_data, dict) and "call_stack" in target_data:
                    target_data["call_stack"].insert(0, {
                        "name": f"Task: {extracted_text}",
                        "parameters": [{"source": "Clipboard_Watcher", "prompt": extracted_text}]
                    })
                elif isinstance(target_data, list):
                    target_data.insert(0, {"task": extracted_text})

                with open(target_path, 'w', encoding='utf-8') as sf:
                    json.dump(target_data, sf, indent=4)
                    
                print(f"[Daemon] Successfully updated {target_key} task queue.")
    except Exception as e:
        print(f"[Daemon Error] {e}")
    
    time.sleep(1)
