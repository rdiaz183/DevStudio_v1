import time
import json
from pathlib import Path
import shutil
import sys

# Ensure hooks are accessible
sys.path.append(str(Path(__file__).parent.parent / "hooks"))
from post_action_hook import update_state

workspace = Path(__file__).parent.parent
staging_file = workspace / "Bridge/image_pipeline/brainstorm_staging.json"
review_queue = workspace / "Bridge/image_pipeline/_review_queue"
approved_dir = workspace / "Bridge/image_pipeline/_approved"
command_file = workspace / "Bridge/user_command.txt"

def run_autonomous_cycle():
    # 1. Check for high-level user commands
    if command_file.exists():
        cmd = command_file.read_text(encoding="utf-8-sig").strip()
        print(f"\n[AUTOPILOT] Received User Command: '{cmd}'")
        command_file.unlink() # Clear command after reading
        
        # Example autonomous reaction to user commands
        if "generate card" in cmd.lower():
            print("[AUTOPILOT] Triggering Brainstorm & Image Pipeline automatically...")
            # Automatically create a sample staging file if commanded
            sample_data = {
                "pending_concepts": [
                    {
                        "agent": "Autonomous_Director",
                        "title": cmd.replace("generate card", "").strip() or "Automated Card Asset",
                        "image_prompt": f"Detailed fantasy art concept for {cmd}, vibrant lighting, masterpiece quality"
                    }
                ]
            }
            staging_file.write_text(json.dumps(sample_data, indent=4), encoding="utf-8")

    # 2. Process Brainstorm Staging Automatically
    if staging_file.exists():
        print("\n[AUTOPILOT] Processing Brainstorm Staging...")
        data = json.loads(staging_file.read_text(encoding="utf-8-sig"))
        for concept in data.get("pending_concepts", []):
            title = concept.get("title", "Untitled")
            prompt = concept.get("image_prompt", "")
            print(f"-> Generating asset spec for: {title}")
            
            output_file = review_queue / f"{title.lower().replace(' ', '_')}.txt"
            output_file.write_text(f"AUTONOMOUS SPEC:\n{prompt}\nStatus: Auto-Approved by Orchestrator", encoding="utf-8")
        staging_file.unlink()

    # 3. Auto-Process Review Queue (Zero Manual Input)
    pending_reviews = list(review_queue.glob("*.txt"))
    for file_path in pending_reviews:
        print(f"\n[AUTOPILOT] Auto-approving review item: {file_path.name}")
        dest = approved_dir / file_path.name
        shutil.move(file_path, dest)
        
        # Commit state automatically via post-action hook
        update_state(f"Autonomous_Approved: {file_path.stem}", "Director_Sovereign")
        print(f"[AUTOPILOT] Asset successfully committed to {dest}")

if __name__ == "__main__":
    print("=== Code510 Autonomous Orchestrator Started ===")
    print("Monitoring workspace for commands and pipeline queues... (Press Ctrl+C to stop)")
    try:
        while True:
            run_autonomous_cycle()
            time.sleep(5) # Poll every 5 seconds
    except KeyboardInterrupt:
        print("\n=== Autonomous Orchestrator Stopped ===")
