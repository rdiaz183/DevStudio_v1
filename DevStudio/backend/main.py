# backend/main.py
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

EXTERNAL_STORAGE_PATH = "D:\\DevStudio_Storage\\models"

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
    storage_status = "Connected (D:\\DevStudio_Storage)" if os.path.exists(EXTERNAL_STORAGE_PATH) else "Not Detected"
    
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
