import shutil
from pathlib import Path
import sys

# Ensure hooks are accessible
sys.path.append(str(Path(__file__).parent.parent / "hooks"))
from post_action_hook import update_state

review_queue = Path("Bridge/image_pipeline/_review_queue")
approved_dir = Path("Bridge/image_pipeline/_approved")
revisions_dir = Path("Bridge/image_pipeline/_revisions")

def process_review_queue():
    pending_files = list(review_queue.glob("*.txt"))
    
    if not pending_files:
        print("No assets currently in the review queue.")
        return
        
    for file_path in pending_files:
        print(f"\n--- Reviewing Asset: {file_path.name} ---")
        content = file_path.read_text(encoding="utf-8-sig")
        print(content)
        
        # For this test automation, we'll simulate an approval action.
        # In your live workflow, you can choose to approve or send back for edits.
        choice = input("\nAction -> Press [A] to Approve, [R] to Request Revision, or [S] to Skip: ").strip().lower()
        
        if choice == 'a':
            dest = approved_dir / file_path.name
            shutil.move(file_path, dest)
            print(f"[APPROVED] Moved to {dest}")
            
            # Commit state via your post-action hook pipeline
            update_state(f"Approved Asset: {file_path.stem}", "Director_Sovereign")
            
        elif choice == 'r':
            dest = revisions_dir / file_path.name
            shutil.move(file_path, dest)
            print(f"[REVISION REQUESTED] Moved to {dest}")
            
        else:
            print("[SKIPPED] Left in review queue.")

if __name__ == "__main__":
    process_review_queue()
