/**
 * Studio Modules & Dropdown Menu Structure (Categories 0 through 8)
 * De-duplicated tool inventory with feature descriptions and runtime actions.
 */

export interface StudioSubmenuTool {
  id: string;
  name: string;
  categoryNumber: number;
  categoryTitle: string;
  badge: string;
  vramUsageMB: number;
  description: string;
  submenuFeatures: string;
  actionSnippet?: {
    title: string;
    language: 'python' | 'cpp' | 'json' | 'powershell';
    code: string;
  };
}

export interface StudioModuleCategory {
  index: number;
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  tools: StudioSubmenuTool[];
}

export const STUDIO_MODULE_CATEGORIES: StudioModuleCategory[] = [
  {
    index: 0,
    id: 'cat-0-central-chat',
    name: '0. Central AI Chat & Orchestrator',
    shortLabel: 'Central AI Chat',
    description: 'Home / Default View: Conversational AI interface for prompting, natural-language tool orchestration, and multi-agent pipeline monitoring.',
    tools: [
      {
        id: 'tool-central-chat',
        name: 'Central AI Chat & Orchestrator',
        categoryNumber: 0,
        categoryTitle: 'Central AI Chat & Orchestrator',
        badge: 'Default View',
        vramUsageMB: 480,
        description: 'Conversational AI interface for prompting, natural-language tool orchestration, and multi-agent pipeline monitoring.',
        submenuFeatures: 'Conversational AI interface for prompting, natural-language tool orchestration, and multi-agent pipeline monitoring.',
        actionSnippet: {
          title: 'CentralOrchestrator_Loop.py',
          language: 'python',
          code: `import asyncio\nfrom devstudio_core import Orchestrator\n\norchestrator = Orchestrator(vram_ceiling_gb=6.0)\nasync def dispatch_task(user_prompt: str):\n    response = await orchestrator.execute_pipeline(user_prompt, verify_double_check=True)\n    return response`
        }
      }
    ]
  },
  {
    index: 1,
    id: 'cat-1-lighting',
    name: '1. Lighting & Neural Illumination',
    shortLabel: 'Lighting & Neural Illum',
    description: 'Advanced neural relighting, ambient occlusion maps, and dynamic lighting conditioning for your New York racing environment.',
    tools: [
      {
        id: 'tool-iclight',
        name: 'IC-Light (by lllyasviel) Neural Relighting',
        categoryNumber: 1,
        categoryTitle: 'Lighting & Neural Illumination',
        badge: 'SD1.5 / FC Latents',
        vramUsageMB: 850,
        description: 'Consistent foreground & background illumination transport with surface normal estimation.',
        submenuFeatures: 'Advanced neural relighting, ambient occlusion maps, and dynamic lighting conditioning for your New York racing environment.',
        actionSnippet: {
          title: 'ICLight_Relight_Scene.py',
          language: 'python',
          code: `from iclight import RelightPipeline\npipeline = RelightPipeline.from_pretrained("lllyasviel/ic-light")\noutput = pipeline.relight(image="ny_street.png", prompt="wet asphalt, neon reflections, night rain", normal_map_extract=True)`
        }
      }
    ]
  },
  {
    index: 2,
    id: 'cat-2-cinematics',
    name: '2. Cinematic Editing & Camera Automation',
    shortLabel: 'Cinematic Editing',
    description: 'Python-driven camera path generation and automated cutscene keyframing for Unreal Sequencer and Blender VSE.',
    tools: [
      {
        id: 'tool-blender-cam',
        name: 'Blender-Cam / Camera Automation Sequencer',
        categoryNumber: 2,
        categoryTitle: 'Cinematic Editing & Camera Automation',
        badge: 'UE5 Sequencer + Blender',
        vramUsageMB: 280,
        description: 'Automated cinematic keyframing, dynamic dolly zooms, and vehicle chase framing algorithms.',
        submenuFeatures: 'Python-driven camera path generation and automated cutscene keyframing for Unreal Sequencer and Blender VSE.',
        actionSnippet: {
          title: 'UnrealSequencer_CameraPath.py',
          language: 'python',
          code: `import unreal\nsequence = unreal.LevelSequence.cast(unreal.EditorAssetLibrary.load_asset("/Game/Cinematics/Race_Intro"))\ncamera = sequence.add_possessable_track(unreal.CineCameraActor)\nprint("Generated automated 60fps tracking camera spline for race intro.")`
        }
      }
    ]
  },
  {
    index: 3,
    id: 'cat-3-story',
    name: '3. Story Writing & Narrative Generation',
    shortLabel: 'Story & Narrative',
    description: 'Local text-generation pipelines to script dynamic driver rivalries, street-racing lore, and branching dialogue trees offline.',
    tools: [
      {
        id: 'tool-koboldcpp',
        name: 'KoboldCPP Narrative Bridge',
        categoryNumber: 3,
        categoryTitle: 'Story Writing & Narrative Generation',
        badge: 'Offline GGUF',
        vramUsageMB: 520,
        description: 'High-context offline text engine specializing in multi-character interactive dialogue and branching lore graphs.',
        submenuFeatures: 'Local text-generation pipelines to script dynamic driver rivalries, street-racing lore, and branching dialogue trees offline.',
        actionSnippet: {
          title: 'KoboldCPP_DialogueTree.py',
          language: 'python',
          code: `import requests\nresponse = requests.post("http://127.0.0.1:5001/api/v1/generate", json={\n    "prompt": "### Driver Rivalry Dialogue\\nMarcus: You think that lead will hold through the tunnel?\\nVance:",\n    "max_length": 150,\n    "temperature": 0.72\n})\nprint(response.json()["results"][0]["text"])`
        }
      }
    ]
  },
  {
    index: 4,
    id: 'cat-4-profiling',
    name: '4. Performance Profiling & Memory Optimization',
    shortLabel: 'Profiling & Memory',
    description: 'Inspects runtime script performance, monitors VRAM usage, manages asset LOD scaling, and detects memory bottlenecks.',
    tools: [
      {
        id: 'tool-pyspy',
        name: 'Py-Spy / Profiler Engine',
        categoryNumber: 4,
        categoryTitle: 'Performance Profiling & Memory Optimization',
        badge: 'Rust Profiler',
        vramUsageMB: 120,
        description: 'Zero-overhead sampling profiler monitoring CPython threads, GIL lockups, and CUDA tensor allocations.',
        submenuFeatures: 'Inspects runtime script performance, monitors VRAM usage, manages asset LOD scaling, and detects memory bottlenecks.',
        actionSnippet: {
          title: 'PySpy_VRAM_Monitor.py',
          language: 'python',
          code: `import subprocess, torch\ngpu_vram_mb = torch.cuda.memory_allocated() / (1024 ** 2) if torch.cuda.is_available() else 0\nprint(f"Current VRAM Allocated: {gpu_vram_mb:.1f} MB / Ceiling: 6144 MB")\nif gpu_vram_mb > 5200:\n    print("[WARNING] Exceeding 85% headroom threshold! Triggering Docker auto-spillway.")`
        }
      }
    ]
  },
  {
    index: 5,
    id: 'cat-5-audio-voice',
    name: '5. Audio & Voice Synthesis',
    shortLabel: 'Audio & Voice',
    description: 'Text-to-speech voice synthesis with emotional markup ([whisper], [excited]) and environmental sound effects / ambiance generation.',
    tools: [
      {
        id: 'tool-drama3-audioldm',
        name: 'Fish Audio Drama 3 & AudioLDM / AudioLDM 2',
        categoryNumber: 5,
        categoryTitle: 'Audio & Voice Synthesis',
        badge: 'Drama 3 + AudioLDM 2',
        vramUsageMB: 420,
        description: 'Multi-speaker neural dialogue generation with inline emotional markup and generative environmental soundscapes.',
        submenuFeatures: 'Text-to-speech voice synthesis with emotional markup ([whisper], [excited]) and environmental sound effects / ambiance generation.',
        actionSnippet: {
          title: 'Drama3_VoiceSynthesizer.py',
          language: 'python',
          code: `from drama3_voice import Drama3Pipeline\nengine = Drama3Pipeline.load("drama3_checkpoint.pt")\nwav_bytes = engine.synthesize(\n    text="[whisper] Keep it tight around turn 4! [shout] Power on!",\n    actor="Commander Marcus",\n    sample_rate_hz=48000\n)\nwith open("Marcus_Turn4.wav", "wb") as f:\n    f.write(wav_bytes)`
        }
      }
    ]
  },
  {
    index: 6,
    id: 'cat-6-world-3d',
    name: '6. 3D World Mapping & Reconstruction',
    shortLabel: '3D World Mapping',
    description: 'Procedural 3D asset generation, infinite Gaussian splatting, world topology, chunk streaming, and dense depth fusion.',
    tools: [
      {
        id: 'tool-uniforge3d',
        name: 'UniForge3D',
        categoryNumber: 6,
        categoryTitle: '3D World Mapping & Reconstruction',
        badge: 'Mesh Generator',
        vramUsageMB: 410,
        description: 'Fast 3D geometric asset synthesis from multi-view imagery and text descriptions.',
        submenuFeatures: 'Procedural 3D asset generation and world topology mapping.'
      },
      {
        id: 'tool-infinisplat-v2',
        name: 'InfiniSplat v2',
        categoryNumber: 6,
        categoryTitle: '3D World Mapping & Reconstruction',
        badge: 'Gaussian Splats',
        vramUsageMB: 480,
        description: 'Streaming 3D Gaussian radiance fields enabling infinite real-time spatial exploration.',
        submenuFeatures: 'Real-time Gaussian splatting and infinite spatial reconstruction.'
      },
      {
        id: 'tool-matrix-game',
        name: 'Matrix Game 4.0',
        categoryNumber: 6,
        categoryTitle: '3D World Mapping & Reconstruction',
        badge: 'Physics Engine',
        vramUsageMB: 510,
        description: 'Generative interactive world engine simulating dynamic terrain deformations and tire telemetry.',
        submenuFeatures: 'Generative interactive world engine parameters.'
      },
      {
        id: 'tool-mosaichunk',
        name: 'Mosaichunk',
        categoryNumber: 6,
        categoryTitle: '3D World Mapping & Reconstruction',
        badge: 'Tile Streaming',
        vramUsageMB: 260,
        description: 'Deconstructs large open worlds into lightweight 250MB streaming LOD chunk tiles.',
        submenuFeatures: 'Modular mesh chunking and tile management for open-world streaming.'
      },
      {
        id: 'tool-depth-anything-v3',
        name: 'Depth Anything V3',
        categoryNumber: 6,
        categoryTitle: '3D World Mapping & Reconstruction',
        badge: 'Depth Estimation',
        vramUsageMB: 220,
        description: 'Dense depth estimation and stereo map generation for obstacle avoidance and surface normals.',
        submenuFeatures: 'Dense depth estimation and stereo map generation.'
      },
      {
        id: 'tool-mapanything',
        name: 'MapAnything',
        categoryNumber: 6,
        categoryTitle: '3D World Mapping & Reconstruction',
        badge: 'Sensor Fusion',
        vramUsageMB: 310,
        description: 'Spatial coordinate alignment, GPS waypoint mapping, and multi-sensor map fusion.',
        submenuFeatures: 'Spatial coordinate alignment and multi-sensor map fusion.'
      }
    ]
  },
  {
    index: 7,
    id: 'cat-7-animation-motion',
    name: '7. Animation, Motion & Rendering',
    shortLabel: 'Animation & Rendering',
    description: 'Dynamic 3D Gaussian rigging, streaming rendering, multi-camera synchronization, procedural textures, and world models.',
    tools: [
      {
        id: 'tool-gaussianimate',
        name: 'Gaussianimate',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Dynamic Rigging',
        vramUsageMB: 390,
        description: 'Dynamic 3D Gaussian splat motion rigging, skeletal kinematics, and non-rigid deformation.',
        submenuFeatures: 'Dynamic 3D Gaussian splat motion rigging and animation.'
      },
      {
        id: 'tool-streamrender-h3',
        name: 'Streamrender H3',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Stream Render',
        vramUsageMB: 440,
        description: 'Ultra-low latency streaming render pipeline with asynchronous frame interpolation.',
        submenuFeatures: 'High-performance streaming render pipeline.'
      },
      {
        id: 'tool-multics',
        name: 'Multics',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Multi-Cam Sync',
        vramUsageMB: 320,
        description: 'Synchronized multi-camera array capture and simultaneous viewport render dispatch.',
        submenuFeatures: 'Multi-camera synchronization and render dispatch.'
      },
      {
        id: 'tool-ai-moss-image',
        name: 'AI Moss Image',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Procedural Textures',
        vramUsageMB: 270,
        description: 'Procedural surface material synthesis, wet road normal maps, and foliage distribution.',
        submenuFeatures: 'Procedural texture generation and surface material mapping.'
      },
      {
        id: 'tool-any-time-any-space',
        name: 'Any Time Any Space',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Spatio-Temporal',
        vramUsageMB: 490,
        description: 'Continuous 4-season climate modeling and diurnal sun-angle lighting control.',
        submenuFeatures: 'Spatio-temporal world modeling and lighting state control.'
      },
      {
        id: 'tool-streaming-code-world',
        name: 'Streaming Code World Model',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Code World Model',
        vramUsageMB: 420,
        description: 'Real-time live code execution coupled with environment physics feedback loops.',
        submenuFeatures: 'Real-time code execution and environment feedback loops.'
      },
      {
        id: 'tool-step-5-preview',
        name: 'Step 5 Preview',
        categoryNumber: 7,
        categoryTitle: 'Animation, Motion & Rendering',
        badge: 'Cinematic Viewport',
        vramUsageMB: 340,
        description: 'Final cinematic render preview viewport with HDR tone mapping and bloom.',
        submenuFeatures: 'Final cinematic render preview viewport.'
      }
    ]
  },
  {
    index: 8,
    id: 'cat-8-agent-frameworks',
    name: '8. Agent Frameworks & Infrastructure',
    shortLabel: 'Agent Frameworks',
    description: 'Manages the 24-agent roster registry, prompt templates, local web server interfaces, and TensorRT-LLM hardware acceleration.',
    tools: [
      {
        id: 'tool-open-webui-harness',
        name: 'Open WebUI & Modular Agent Harnesses',
        categoryNumber: 8,
        categoryTitle: 'Agent Frameworks & Infrastructure',
        badge: 'Agent Harness',
        vramUsageMB: 310,
        description: 'Centralized agent roster registry, custom system prompts, and sandboxed execution terminal.',
        submenuFeatures: 'Manages the 24-agent roster registry, prompt templates, and local web server interfaces.'
      },
      {
        id: 'tool-tensorrt-comfyui',
        name: 'TensorRT-LLM & ComfyUI Backends',
        categoryNumber: 8,
        categoryTitle: 'Agent Frameworks & Infrastructure',
        badge: 'TensorRT + ComfyUI',
        vramUsageMB: 580,
        description: 'Hardware acceleration runtime and strict 6.0GB VRAM asynchronous weight streaming.',
        submenuFeatures: 'Hardware acceleration, node graph execution, and strict 6.0GB VRAM asynchronous weight streaming.'
      }
    ]
  }
];

// Flattens and de-duplicates all unique tools across categories 0 through 8
export function getUniqueStudioTools(): StudioSubmenuTool[] {
  const seenIds = new Set<string>();
  const uniqueTools: StudioSubmenuTool[] = [];

  for (const cat of STUDIO_MODULE_CATEGORIES) {
    for (const tool of cat.tools) {
      if (!seenIds.has(tool.id)) {
        seenIds.add(tool.id);
        uniqueTools.push(tool);
      }
    }
  }

  return uniqueTools;
}
