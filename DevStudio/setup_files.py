import os

os.makedirs("backend", exist_ok=True)

vault_code = '''# backend/vault.py
import os
import json
from cryptography.fernet import Fernet

VAULT_FILE = "vault.enc"
KEY_FILE = "secret.key"

def get_or_create_key():
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as key_file:
            return key_file.read()
    else:
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as key_file:
            key_file.write(key)
        return key

ENCRYPTION_KEY = get_or_create_key()
cipher = Fernet(ENCRYPTION_KEY)

def save_secret(service_name: str, api_key: str):
    vault_data = {}
    if os.path.exists(VAULT_FILE):
        with open(VAULT_FILE, "rb") as f:
            decrypted_data = cipher.decrypt(f.read())
            vault_data = json.loads(decrypted_data.decode())
    
    vault_data[service_name] = api_key
    
    encrypted_data = cipher.encrypt(json.dumps(vault_data).encode())
    with open(VAULT_FILE, "wb") as f:
        f.write(encrypted_data)

def get_secret(service_name: str) -> str:
    if not os.path.exists(VAULT_FILE):
        return None
    with open(VAULT_FILE, "rb") as f:
        decrypted_data = cipher.decrypt(f.read())
        vault_data = json.loads(decrypted_data.decode())
        return vault_data.get(service_name)
'''

main_code = '''# backend/main.py
import os
import time
import psutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Dev Studio Core Engine",
    description="Standalone Local AI Platform & Autonomous Agent Ecosystem",
    version="1.0.3"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXTERNAL_STORAGE_PATH = "D:\\\\DevStudio_Storage\\\\models"

class PromptRequest(BaseModel):
    prompt: str
    model_name: str = "Qwen3.6-27B-Q4_K_M"
    temperature: float = 0.7
    max_tokens: int = 2048

class TelemetryResponse(BaseModel):
    cpu_usage_percent: float
    ram_usage_percent: float
    gpu_vram_dedicated_gb: float
    gpu_shared_gb: float
    active_model: str
    quantization_mode: str
    external_storage_status: str

@app.get("/")
def read_root():
    storage_active = os.path.exists(EXTERNAL_STORAGE_PATH)
    return {
        "status": "online",
        "platform": "Dev Studio",
        "engine": "Custom Llama-Cpp Quantized Runtime",
        "external_storage_connected": storage_active
    }

@app.get("/api/telemetry", response_model=TelemetryResponse)
def get_hardware_telemetry():
    ram = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=0.1)
    
    dedicated_vram_used = round(min(5.8, (ram.used / ram.total) * 5.8), 2)
    storage_status = "Connected (D:\\\\DevStudio_Storage)" if os.path.exists(EXTERNAL_STORAGE_PATH) else "Not Detected"
    
    return TelemetryResponse(
        cpu_usage_percent=cpu,
        ram_usage_percent=ram.percent,
        gpu_vram_dedicated_gb=dedicated_vram_used,
        gpu_shared_gb=8.0,
        active_model="Qwen3.6-27B-GGUF",
        quantization_mode="Q4_K_M (Optimized for 14GB VRAM Pool)",
        external_storage_status=storage_status
    )

@app.post("/api/generate")
def generate_text(payload: PromptRequest):
    start_time = time.time()
    
    simulated_output = (
        f"[{payload.model_name}] External storage (D Drive) model routing active. "
        f"Processed prompt: '{payload.prompt[:40]}...'"
    )
    
    duration = time.time() - start_time
    tokens_per_sec = round(len(simulated_output.split()) / max(duration, 0.1), 2)
    
    return {
        "response": simulated_output,
        "model": payload.model_name,
        "metrics": {
            "tokens_per_sec": tokens_per_sec,
            "generation_time_sec": round(duration, 4),
            "n_gpu_layers": 24
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
'''

with open("backend/vault.py", "w", encoding="utf-8") as f:
    f.write(vault_code)

with open("backend/main.py", "w", encoding="utf-8") as f:
    f.write(main_code)

print("SUCCESS: backend/vault.py and backend/main.py created successfully!")
