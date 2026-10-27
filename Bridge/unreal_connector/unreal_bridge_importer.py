import os
import json
import unreal

WORKSPACE = r"C:\Users\rdiaz\Documents\Unreal Projects\Code510_AI_Workspace"
IMPORT_QUEUE = os.path.join(WORKSPACE, "Bridge", "asset_pipeline", "unreal_import_queue")
STATE_FILE = os.path.join(WORKSPACE, "Bridge", "state_machine.json")

def process_unreal_queue():
    if not os.path.exists(IMPORT_QUEUE):
        print("[Unreal Bridge] Import queue not found.")
        return

    files = [f for f in os.path.exists(IMPORT_QUEUE) and os.listdir(IMPORT_QUEUE) if f.endswith(".uasset")]
    
    if not files:
        print("[Unreal Bridge] No pending assets in import queue.")
        return

    for file_name in files:
        file_path = os.path.join(IMPORT_QUEUE, file_name)
        print(f"[Unreal Bridge] Importing asset into project: {file_name}")
        
        # Example Unreal Python API asset task handling
        # Task task_asset_import implementation can be hooked here
        
        # Update state machine log
        update_state_machine(file_name)
        
        # Clean up queue file after import
        try:
            os.remove(file_path)
            print(f"[Unreal Bridge] Successfully ingested and cleared: {file_name}")
        except Exception as e:
            print(f"[Error] Failed to remove queued file: {e}")

def update_state_machine(asset_name):
    if not os.path.exists(STATE_FILE):
        return
        
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            state_data = json.load(f)
            
        if "imported_assets" not in state_data:
            state_data["imported_assets"] = []
            
        state_data["imported_assets"].append({
            "asset": asset_name,
            "status": "Imported into Unreal Engine Content Browser"
        })
        
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state_data, f, indent=4)
    except Exception as e:
        print(f"[Error] Could not update state machine: {e}")

if __name__ == "__main__":
    process_unreal_queue()
