# notebooks/notebook_store.py
import os
import json
from datetime import datetime
from typing import Dict, Any, List

NOTEBOOK_DIR = "notebooks/storage"

class NotebookStore:
    def __init__(self):
        os.makedirs(NOTEBOOK_DIR, exist_ok=True)

    def save_notebook(self, title: str, content: str, tags: List[str]) -> str:
        filename = f"{title.lower().replace(' ', '_')}_{int(datetime.now().timestamp())}.json"
        filepath = os.path.join(NOTEBOOK_DIR, filename)
        
        note_data = {
            "title": title,
            "content": content,
            "tags": tags,
            "created_at": datetime.now().isoformat()
        }
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(note_data, f, indent=4)
            
        print(f"[NotebookStore]: Saved notebook '{title}' to {filepath}")
        return filepath

    def list_notebooks(self) -> List[str]:
        if not os.path.exists(NOTEBOOK_DIR):
            return []
        return os.listdir(NOTEBOOK_DIR)

if __name__ == "__main__":
    store = NotebookStore()
    store.save_notebook(
        title="Dev Studio Architecture",
        content="Built standalone Python/FastAPI backend with encryption vault and autonomous agent loops.",
        tags=["architecture", "backend", "local-ai"]
    )
    print("Existing Notebooks:", store.list_notebooks())
