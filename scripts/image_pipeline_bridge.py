import json
from pathlib import Path
import shutil

staging_file = Path("Bridge/image_pipeline/brainstorm_staging.json")
review_queue = Path("Bridge/image_pipeline/_review_queue")

def process_brainstorm_handoff():
    if not staging_file.exists():
        print("No brainstorm staging file found. Waiting for Brainstorm Agent output...")
        return
        
    # Use 'utf-8-sig' to automatically strip any PowerShell UTF-8 BOM
    data = json.loads(staging_file.read_text(encoding="utf-8-sig"))
    concepts = data.get("pending_concepts", [])
    
    for concept in concepts:
        title = concept.get("title", "Untitled_Concept")
        prompt = concept.get("image_prompt", "")
        
        print(f"[{concept.get('agent', 'Brainstorm_Agent')}]: Handoff received for '{title}'")
        print(f"-> Formulating prompt for Image Maker Agent: '{prompt}'")
        
        output_filename = review_queue / f"{title.lower().replace(' ', '_')}.txt"
        output_filename.write_text(f"IMAGE PROMPT SPEC:\n{prompt}\nStatus: Awaiting User Approval", encoding="utf-8")
        print(f"-> Image package placed in review queue: {output_filename}")
        
    staging_file.unlink()
    print("=== Brainstorm-to-Image Handoff Complete ===")

if __name__ == "__main__":
    process_brainstorm_handoff()
