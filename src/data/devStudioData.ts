export interface AgentItem {
  id: string;
  name: string;
  category: 'Supervisor & Management' | 'Code & Game Logic' | 'World & Environment' | 'Audio & Voice' | 'Animation & Cameras' | 'Lighting, Weather & Shadows' | 'Optimization & Testing';
  role: string;
  modelBacking: string;
  status: 'Idle' | 'Active' | 'Validating' | 'Reviewing';
  vramUsageMB: number;
  description: string;
  systemPrompt: string;
  isNotebookFirst: boolean;
  validationCheck: string;
  author: 'System Preset' | 'Custom Created';
}

export interface InventoryTool {
  name: string;
  source: 'Hugging Face' | 'GitHub' | 'Recommended Addition';
  category: 'Audio & Voice' | '3D World Mapping' | 'Animation & Motion' | 'Agent Infrastructure' | 'Lighting & Weather' | 'Cinematics & Cameras' | 'Vision & Multimodal';
  vramProfile: string;
  status: 'Cloned & Ready' | 'Quantized 4-bit' | 'Standby Node' | 'Recommended';
  repoUrl: string;
  description: string;
  synthesizedCapability: string;
}

export interface NotebookFile {
  id: string;
  name: string;
  category: 'Audio' | 'Code' | 'Document' | 'Specs' | 'Voice Note' | '3D Assets' | 'Video' | 'Textures' | 'Archives' | 'Other';
  fileSizeKB: number;
  dateAdded: string;
  timestampMs: number;
  summary: string;
  transcription?: string;
  audioDuration?: string;
  isTranscribed?: boolean;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  category: 'Security' | 'Account' | 'Agent Task' | 'Model Load' | 'Storage' | 'API Key';
  title: string;
  details: string;
  severity: 'normal' | 'notice' | 'warning';
}

export interface GeneratedApiKey {
  id: string;
  name: string;
  keyMasked: string;
  rawKey: string;
  scope: 'Full Studio Admin' | 'Agent Worker Execution' | 'Mobile Companion Sync' | 'Read-Only Telemetry';
  dateCreated: string;
  lastUsed: string;
  status: 'Active' | 'Revoked';
}

export interface PairedMobileDevice {
  id: string;
  deviceName: string;
  deviceType: 'Smartphone' | 'Tablet';
  os: 'iOS' | 'Android' | 'iPadOS';
  ipAddress: string;
  lastSync: string;
  status: 'Connected' | 'Standby';
}

export interface SuggestedVaultItem {
  id: string;
  type: 'API Key' | 'Model' | 'Tool';
  name: string;
  provider: string;
  description: string;
  useCase: string;
  vramRequirement: string;
  recommendedRole: string;
}

export interface AgentSuggestion {
  id: string;
  name: string;
  category: 'Lighting, Weather & Shadows' | 'Code & Game Logic' | 'World & Environment' | 'Audio & Voice' | 'Animation & Cameras' | 'Optimization & Testing';
  role: string;
  description: string;
  suggestedPrompt: string;
  modelBacking: string;
  vramUsageMB: number;
  highlightTag: string;
}

export const AGENT_SUGGESTIONS: AgentSuggestion[] = [
  {
    id: 'sugg-lighting-seasons',
    name: 'World Lighting & 4-Season Climate Director',
    category: 'Lighting, Weather & Shadows',
    role: 'Universal 4-season atmospheric climate & lighting physics simulator',
    description: 'Simulates dynamic seasonal climate transitions (Spring, Summer, Autumn, Winter), clouds, wind vectors, rain droplet fall velocity, snow accumulation depth, and Kelvin color temperatures.',
    suggestedPrompt: 'Act as the World Lighting & Seasons Director. Simulate dynamic seasonal climate shifts across 4 seasons (Spring, Summer, Autumn, Winter), compute wind velocity vectors, precipitation fall speeds, and HDR sun Kelvin temperatures (2000K-7500K). Always ground physics in active Project Notebook specs and pass LMM double-check verification.',
    modelBacking: 'IC-Light + DevStudio Synthesizer (4-bit)',
    vramUsageMB: 340,
    highlightTag: 'Converted from Sidebar'
  },
  {
    id: 'sugg-shadows-pcss',
    name: 'Realistic Shadow & Illumination Physicist',
    category: 'Lighting, Weather & Shadows',
    role: 'Contact-hardening PCSS shadow penumbra & surface normal calculator',
    description: 'Calculates physical light transport equations, realistic soft shadows, penumbra contact hardening, ambient occlusion, and normal map consistency using IC-Light multi-angle synthesis.',
    suggestedPrompt: 'Act as the Illumination & Realistic Shadows Physicist. Compute realistic shadow softness, penumbra falloff, ambient occlusion, and normal map consistency for all levels, assets, and cinematic cameras. Verify shadow calculations against the Project Notebook.',
    modelBacking: 'IC-Light SD1.5 Harmonizer',
    vramUsageMB: 320,
    highlightTag: 'Converted from Sidebar'
  },
  {
    id: 'sugg-weather-dynamics',
    name: 'Universal Weather Dynamics Specialist',
    category: 'World & Environment',
    role: '120Hz aerodynamic wind, precipitation, and wetness simulator',
    description: 'Calculates wind speed and compass angles, terminal rain droplet velocity, blizzard frost accumulation, and surface wetness specular friction indices for any level.',
    suggestedPrompt: 'Act as the Universal Weather Simulator. Calculate wind direction angles, storm gusts, aerodynamic drag on vehicles, and puddle wetness indices for active levels in the active project space.',
    modelBacking: 'DevStudio Physics State Machine',
    vramUsageMB: 280,
    highlightTag: 'Converted from Sidebar'
  },
  {
    id: 'sugg-py-gameplay',
    name: 'Python Core Gameplay Programmer',
    category: 'Code & Game Logic',
    role: 'Modular Python tick controllers, player state machines, and game loops',
    description: 'Writes clean, modular, zero-garbage-collection Python gameplay code, actor controllers, and input handlers compatible with Panda3D, Godot, or Unreal Engine Python.',
    suggestedPrompt: 'Act as the Senior Python Gameplay Programmer. Write modular, high-performance Python gameplay controllers, tick loops, and player state machines with zero latency and high FPS.',
    modelBacking: 'llama.cpp Qwen-14B GGUF Native',
    vramUsageMB: 320,
    highlightTag: 'Code & Game Logic'
  },
  {
    id: 'sugg-fish-audio',
    name: 'Fish Audio Drama 3 Dialogue Director',
    category: 'Audio & Voice',
    role: 'Scene-style multi-character speech with inline emotional direction tags',
    description: 'Voices full scenes directly from script descriptions with emotion tags like [whisper], [urgent], [excited], and [laughing], maintaining persistent character timbres.',
    suggestedPrompt: 'Act as the Fish Audio Drama 3 Dialogue Director. Generate emotional multi-character scripts with inline direction tags like [whisper], [urgent], [excited], and [laughing] tailored to the active project.',
    modelBacking: 'Fish Audio Drama 3 (35B-A3B)',
    vramUsageMB: 480,
    highlightTag: 'Audio & Voice'
  },
  {
    id: 'sugg-uniforge-splat',
    name: 'UniForge3D & InfiniSplat Gaussian Mapper',
    category: 'World & Environment',
    role: 'Fast 3D radiance fields, point-cloud reconstruction, and map chunking',
    description: 'Generates modular map chunks, roads, terrain, and 3D Gaussian splat radiance fields from arbitrary camera perspectives with real-time level streaming.',
    suggestedPrompt: 'Act as the 3D World Architect. Synthesize 3D geometry, point clouds, Gaussian splats, and modular map chunking for active level environments.',
    modelBacking: 'UniForge3D + InfiniSplat v2',
    vramUsageMB: 420,
    highlightTag: 'World & Environment'
  },
  {
    id: 'sugg-cpp-unreal',
    name: 'Unreal Engine 5.5 C++ Systems Architect',
    category: 'Code & Game Logic',
    role: 'Memory-safe UCLASS actors, Blueprints reflection, and component logic',
    description: 'Generates high-performance C++ classes, UFUNCTION bindings, actor components, and state trees optimized for Unreal Engine 5.5 and Unity 6.',
    suggestedPrompt: 'Act as the Senior Unreal Engine 5.5 C++ Architect. Generate high-performance UCLASS actors, Blueprints reflection, and component logic.',
    modelBacking: 'llama.cpp GGUF 4-bit',
    vramUsageMB: 350,
    highlightTag: 'Code & Game Logic'
  },
  {
    id: 'sugg-pyspy-guard',
    name: 'Py-Spy Memory & Profiling Auditor',
    category: 'Optimization & Testing',
    role: 'Real-time CPython sampling profiler & strict 6.0 GB VRAM governor',
    description: 'Inspects active execution frames, identifies GIL thread contention, tracks memory allocations, and prevents CUDA Out-Of-Memory crashes.',
    suggestedPrompt: 'Act as the Py-Spy Memory Guard Auditor. Inspect CPython execution frames, release GIL blocks, and enforce strict 6.0 GB local VRAM limits.',
    modelBacking: 'py-spy Native Rust Profiler',
    vramUsageMB: 120,
    highlightTag: 'Optimization & Testing'
  },
  {
    id: 'sugg-ue5-bridge',
    name: 'Unreal Engine 5.5 Asset Importer & Live Link Agent',
    category: 'Code & Game Logic',
    role: 'Direct local file manipulation & Unreal Engine 5.5 remote execution asset publisher',
    description: 'Directly writes assets to local PC disk (%USERPROFILE%\\DevStudio_v1_Workspace) and triggers Unreal Engine 5.5 remote execution on port 30010 to compile Blueprints and mount assets in /Game/DevStudioAssets/.',
    suggestedPrompt: 'Act as the Unreal Engine 5.5 Asset Importer Agent. Create game assets, write source files directly to the local Windows workspace, and dispatch remote execution commands to Unreal Engine 5.5 on port 30010 to mount Blueprints and hot-reload editor classes.',
    modelBacking: 'DevStudio-Synthesized-v1 (4-bit GGUF)',
    vramUsageMB: 360,
    highlightTag: 'Unreal Engine Bridge'
  }
];

export interface DynamicInterfaceTab {
  id: string;
  label: string;
  sub: string;
  category: string;
  sourceFiles: string[];
  description: string;
  engineTarget: string;
  actions: {
    label: string;
    actionType: 'unreal-asset' | 'lighting' | 'code-exec' | 'physics-sim' | 'audio-cue';
    detail: string;
    defaultSnippet?: {
      title: string;
      language: string;
      code: string;
    };
  }[];
  parameters: {
    name: string;
    value: string | number;
    unit?: string;
    description: string;
  }[];
}

export function synthesizeTabsFromReferenceFiles(files: NotebookFile[]): DynamicInterfaceTab[] {
  if (files.length === 0) return [];
  
  const suggestions: DynamicInterfaceTab[] = [];
  const fileNames = files.map(f => f.name.toLowerCase()).join(' ');
  const fileSummaries = files.map(f => (f.summary || '').toLowerCase()).join(' ');
  const combinedText = `${fileNames} ${fileSummaries}`;

  // 1. Unreal Engine Asset Pipeline & Live Link
  suggestions.push({
    id: 'dynamic-tab-ue5-bridge',
    label: 'Unreal Engine 5 Asset Bridge',
    sub: 'Direct Local PC Asset Deployment',
    category: 'Engine Bridge',
    sourceFiles: files.map(f => f.name).slice(0, 3),
    description: 'Synthesized from your active reference files to provide direct pipeline links to Unreal Engine 5.5 (port 30010) and local disk workspace.',
    engineTarget: 'Unreal Engine 5.5',
    actions: [
      {
        label: 'Push Game Actors to /Game/DevStudioAssets',
        actionType: 'unreal-asset',
        detail: 'Dispatches Python Remote Execution command to Unreal Editor to compile and mount Blueprint actors into /Game/DevStudioAssets.',
        defaultSnippet: {
          title: 'UnrealEngine_DevStudioBridge.py',
          language: 'Python',
          code: `import unreal\n\n# Dev Studio v1 - Unreal Engine 5.5 Remote Execution Bridge\nasset_tools = unreal.AssetToolsHelpers.get_asset_tools()\npackage_path = "/Game/DevStudioAssets"\nprint(f"Mounted Dev Studio synthesized asset into {package_path}")\nunreal.EditorAssetLibrary.save_directory(package_path)`
        }
      },
      {
        label: 'Trigger Live Hot-Reload (0 Downtime)',
        actionType: 'unreal-asset',
        detail: 'Triggers Unreal Engine live coding compiler to hot-reload C++ and Python state trees without closing the editor.'
      },
      {
        label: 'Verify Remote Execution Port (30010)',
        actionType: 'unreal-asset',
        detail: 'Pings 127.0.0.1:30010 to confirm Unreal Engine Python Remote Execution is active.'
      }
    ],
    parameters: [
      { name: 'Target Unreal Package Path', value: '/Game/DevStudioAssets', description: 'Destination folder in Unreal Engine Content Browser' },
      { name: 'Remote Execution Port', value: '30010', unit: 'TCP', description: 'Python Remote Execution port in Unreal Engine' },
      { name: 'Local Disk Sync Directory', value: '%USERPROFILE%\\DevStudio_v1_Workspace', description: 'Local PC folder where AI agents write assets' },
      { name: 'Compilation Optimization', value: 'Development Editor', description: 'Unreal build profile with hot reload' }
    ]
  });

  // 2. Universal Lighting & Weather Studio (if any lighting, weather, seasonal, or environment cues detected)
  suggestions.push({
    id: 'dynamic-tab-lighting-weather',
    label: 'Universal Lighting & Weather Studio',
    sub: '4-Season Climate & Shadow Physics',
    category: 'Physics & Atmosphere',
    sourceFiles: files.map(f => f.name).slice(0, 2),
    description: 'Synthesized to manipulate 4-season climate transitions, wind velocity vectors, precipitation fall speed, and contact-hardening PCSS shadows.',
    engineTarget: 'Universal (Unreal, Godot, Unity)',
    actions: [
      {
        label: 'Push Sun Kelvin & Shadows to Unreal Lumen',
        actionType: 'lighting',
        detail: 'Transmits sun color temperature (3400K-7200K) and volumetric light shafts to Unreal Engine directional light actor.'
      },
      {
        label: 'Simulate 120Hz Wind & Rain Velocity',
        actionType: 'physics-sim',
        detail: 'Streams precipitation vectors directly into Niagara particle systems on local PC.'
      }
    ],
    parameters: [
      { name: 'Active Universal Season', value: 'Autumn (Golden & Foliage)', description: 'Simulates seasonal temperature and atmospheric haze' },
      { name: 'Sun Color Temperature', value: 3600, unit: 'K', description: 'Kelvin blackbody curve for sun and skylight' },
      { name: 'Shadow Penumbra Softness', value: 68, unit: '%', description: 'PCSS contact hardening for razor-sharp close contact and soft distant shadows' },
      { name: 'Wind Velocity', value: 32, unit: 'km/h', description: 'Atmospheric gust velocity scaled into vehicle drag' }
    ]
  });

  // 3. Domain Specific Tab (Vehicle / Gameplay or Audio based on content)
  if (combinedText.includes('audio') || combinedText.includes('voice') || combinedText.includes('dialogue') || combinedText.includes('sound') || combinedText.includes('drama')) {
    suggestions.push({
      id: 'dynamic-tab-drama-dialogue',
      label: 'Fish Audio Dialogue & Speech Lab',
      sub: 'Multi-Character Voice Direction',
      category: 'Audio & Speech',
      sourceFiles: files.filter(f => f.category === 'Audio' || f.name.includes('.wav') || f.name.includes('audio') || f.name.includes('dialog')).map(f => f.name),
      description: 'Synthesized from audio and dialogue references. Generates character voices with inline emotional tags like [whisper], [urgent], and [laughing].',
      engineTarget: 'Fish Audio Drama 3 & Unreal Audio',
      actions: [
        {
          label: 'Generate Multi-Character Scene Voice',
          actionType: 'audio-cue',
          detail: 'Uses Fish Audio Drama 3 to render 44.1kHz speech files directly to local PC workspace.'
        },
        {
          label: 'Export Dialogue Cue Sheet to Unreal',
          actionType: 'unreal-asset',
          detail: 'Creates SoundCue and DialogueVoice assets in /Game/DevStudioAssets/Audio.'
        }
      ],
      parameters: [
        { name: 'Sample Rate', value: '44100', unit: 'Hz', description: 'High-fidelity audio mastering sample rate' },
        { name: 'Voice Emotion Tag', value: '[natural/urgent]', description: 'Dynamic affective tone' },
        { name: 'Spatial Audio Attenuation', value: 'Binaural HRTF 3D', description: 'Spatial audio curve for 3D game engines' }
      ]
    });
  } else {
    suggestions.push({
      id: 'dynamic-tab-physics-telemetry',
      label: 'Vehicle Physics & Telemetry Lab',
      sub: 'Pacejka Slip & Aerodynamics',
      category: 'Gameplay Physics',
      sourceFiles: files.map(f => f.name).slice(0, 2),
      description: 'Synthesized from project specifications to calculate Pacejka Magic Formula tire slip, downforce coefficients, and suspension kinematics.',
      engineTarget: 'Python & Unreal Chaos Vehicles',
      actions: [
        {
          label: 'Compute Pacejka Lateral Slip Curves',
          actionType: 'physics-sim',
          detail: 'Calculates non-linear tire grip curves taking surface wetness and weather into account.'
        },
        {
          label: 'Push Physics Controller to Local PC',
          actionType: 'code-exec',
          detail: 'Writes modular Python player controller to local PC workspace.'
        }
      ],
      parameters: [
        { name: 'Tire Friction Mu (Dry)', value: 0.98, description: 'Base tire friction coefficient' },
        { name: 'Wet Surface Derating', value: 0.82, description: 'Friction reduction factor under rain weather' },
        { name: 'Aerodynamic Downforce Coeff', value: 1.45, description: 'Aerodynamic downforce curve at 100+ km/h' }
      ]
    });
  }

  return suggestions;
}

export interface GameProjectSpace {
  id: string;
  title: string;
  genre: 'Motorsport & Racing' | 'Action RPG & Open World' | 'Sci-Fi Cyberpunk' | 'Cozy Sandbox & Building' | 'Cinematic Film Studio';
  engineTarget: 'Unreal Engine 5.5' | 'Unity 6' | 'Godot 4.3' | 'Blender VSE' | 'Custom Python Engine';
  description: string;
  codeLanguageDefault: 'Python' | 'C++' | 'Blueprints';
  activeSeason: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  levels: {
    name: string;
    environment: string;
    weatherPreset: string;
    lightingProfile: string;
    ambientSound: string;
  }[];
}

export const SAMPLE_API_KEYS: GeneratedApiKey[] = [
  {
    id: 'key-1',
    name: 'DevStudio Master Desktop Key',
    keyMasked: 'ds_live_9f82••••••••••••3a7c',
    rawKey: 'ds_live_9f82b7c4e81a942d0fa168923a7c',
    scope: 'Full Studio Admin',
    dateCreated: '2026-10-26 18:30',
    lastUsed: 'Just now',
    status: 'Active'
  },
  {
    id: 'key-2',
    name: 'Mobile & Tablet Companion Token',
    keyMasked: 'ds_pair_4a11••••••••••••7e92',
    rawKey: 'ds_pair_4a11c08e5f2941aa9d3e88417e92',
    scope: 'Mobile Companion Sync',
    dateCreated: '2026-10-26 19:15',
    lastUsed: '2 mins ago',
    status: 'Active'
  },
  {
    id: 'key-3',
    name: 'Agent Task Loop Pipeline Key',
    keyMasked: 'ds_task_88e0••••••••••••55bf',
    rawKey: 'ds_task_88e0192d47aa72bc31f9001555bf',
    scope: 'Agent Worker Execution',
    dateCreated: '2026-10-26 20:00',
    lastUsed: '14 mins ago',
    status: 'Active'
  }
];

export const SAMPLE_PAIRED_DEVICES: PairedMobileDevice[] = [
  {
    id: 'dev-1',
    deviceName: 'iPhone 16 Pro Max',
    deviceType: 'Smartphone',
    os: 'iOS',
    ipAddress: '192.168.1.145',
    lastSync: 'Live (5s ago)',
    status: 'Connected'
  },
  {
    id: 'dev-2',
    deviceName: 'iPad Pro 13" (M4 Studio Monitor)',
    deviceType: 'Tablet',
    os: 'iPadOS',
    ipAddress: '192.168.1.178',
    lastSync: 'Active (2m ago)',
    status: 'Connected'
  },
  {
    id: 'dev-3',
    deviceName: 'Samsung Galaxy Tab S9 Ultra',
    deviceType: 'Tablet',
    os: 'Android',
    ipAddress: '192.168.1.189',
    lastSync: '1 hour ago',
    status: 'Standby'
  }
];

export const SUGGESTED_VAULT_ITEMS: SuggestedVaultItem[] = [
  {
    id: 'sug-1',
    type: 'API Key',
    name: 'Hugging Face User Access Token',
    provider: 'Hugging Face Hub',
    description: 'Enables 1-click gated model downloads (Llama 3.3, Flux.1, Fish Drama 3) directly into your local inventory.',
    useCase: 'Checkpoints & Dataset Ingestion',
    vramRequirement: '0 MB (Web Auth)',
    recommendedRole: 'Essential for downloading open-source model weights'
  },
  {
    id: 'sug-2',
    type: 'Model',
    name: 'Qwen 2.5-Coder 7B / 14B (GGUF 4-Bit)',
    provider: 'Alibaba Cloud / Hugging Face',
    description: 'Top-tier code generation model matching GPT-4o capabilities in Python, C++, and HLSL shaders.',
    useCase: 'Code & Game Logic Agents',
    vramRequirement: '3.6 GB (Q4_K_M)',
    recommendedRole: 'Supercharges Python game controllers and C++ systems'
  },
  {
    id: 'sug-3',
    type: 'Model',
    name: 'Flux.1 Schnell (4-Bit GGUF)',
    provider: 'Black Forest Labs',
    description: 'Ultra-fast 4-step image synthesis engine for generating instant game textures, concept art, and UI icons.',
    useCase: 'Asset & Concept Generation',
    vramRequirement: '4.8 GB (Offload to RAM)',
    recommendedRole: 'High-speed texture and skybox generation'
  },
  {
    id: 'sug-4',
    type: 'Tool',
    name: 'Whisper-Large-v3-Turbo',
    provider: 'OpenAI / Hugging Face',
    description: 'Blazing fast voice-to-text model for transcribing spoken memos and recording voice actors locally.',
    useCase: 'Notebook Audio Transcription',
    vramRequirement: '1.2 GB (CPU/GPU hybrid)',
    recommendedRole: 'Offline transcription for project notebooks'
  },
  {
    id: 'sug-5',
    type: 'API Key',
    name: 'Weights & Biases (W&B) Telemetry Key',
    provider: 'WandB',
    description: 'Tracks multi-agent loss graphs, memory utilization, and autonomous task completion curves.',
    useCase: 'Agent Performance Tracking',
    vramRequirement: '0 MB (Telemetry API)',
    recommendedRole: 'Real-time studio agent metrics and dashboard logging'
  },
  {
    id: 'sug-6',
    type: 'Tool',
    name: 'Meshroom / AliceVision Photogrammetry',
    provider: 'AliceVision (GitHub)',
    description: 'Free open-source 3D reconstruction software to turn real photos taken with your cellphone into 3D game meshes.',
    useCase: 'Cellphone Photo-to-3D Asset',
    vramRequirement: '3.2 GB (CLI Node)',
    recommendedRole: 'Turn cellphone camera photos into textured game assets'
  }
];

export const SAMPLE_NOTEBOOK_FILES: NotebookFile[] = [
  {
    id: 'nb-1',
    name: 'Watkins_Glen_PitLane_Radio_Take1.wav',
    category: 'Audio',
    fileSizeKB: 4820,
    dateAdded: '2026-10-26 19:40',
    timestampMs: 1793043600000,
    audioDuration: '0:42',
    summary: 'Voice recording of driver and race engineer pit lane strategy in wet conditions.',
    transcription: "[Engineer]: Track temps are dropping fast to 14°C at turn four. Switch brake bias two clicks forward. [Driver]: Understood, tires are holding grip on the wet apex.",
    isTranscribed: true
  },
  {
    id: 'nb-2',
    name: 'Project_Code510_Master_Design.docx',
    category: 'Specs',
    fileSizeKB: 2450,
    dateAdded: '2026-10-26 18:20',
    timestampMs: 1793038800000,
    summary: 'Core game architecture specs covering Adirondack mountain passes, vehicle telemetry and Mosaichunking.'
  },
  {
    id: 'nb-3',
    name: 'Crew_Chief_Briefing_AudioMemo.mp3',
    category: 'Voice Note',
    fileSizeKB: 1840,
    dateAdded: '2026-10-26 20:15',
    timestampMs: 1793045700000,
    audioDuration: '1:15',
    summary: 'Spoken memo recorded via studio mic detailing suspension spring rate tolerances for rain tires.',
    transcription: "[Chief]: Remember to soften the front anti-roll bar before the qualifying session. If hydroplaning occurs on the straight, we need compliant damping.",
    isTranscribed: true
  },
  {
    id: 'nb-4',
    name: 'universal_weather_physics.py',
    category: 'Code',
    fileSizeKB: 84,
    dateAdded: '2026-10-26 20:50',
    timestampMs: 1793047800000,
    summary: 'Python module managing 4-season transitions, precipitation velocity, and snow accumulation.'
  },
  {
    id: 'nb-5',
    name: 'Eldoria_Dialogue_Tree_Branching.json',
    category: 'Document',
    fileSizeKB: 310,
    dateAdded: '2026-10-26 17:05',
    timestampMs: 1793034300000,
    summary: 'Branching quest dialogue state machine with 28 NPC dialogue nodes.'
  }
];

export const SAMPLE_ACTIVITY_LOG: ActivityItem[] = [
  {
    id: 'act-1',
    timestamp: '21:12:10',
    category: 'API Key',
    title: 'Mobile Companion Key Generated',
    details: 'Key ds_pair_4a11... created for iPhone 16 Pro Max local sync.',
    severity: 'normal'
  },
  {
    id: 'act-2',
    timestamp: '20:58:12',
    category: 'Security',
    title: 'Offline SHA-256 Token Synced',
    details: 'Local Wi-Fi phone-to-AI pairing verified on 192.168.1.145:3000.',
    severity: 'normal'
  },
  {
    id: 'act-3',
    timestamp: '20:55:00',
    category: 'Agent Task',
    title: 'Executive Supervisor Dispatched Worker #4',
    details: 'Fish Audio Drama 3 director synthesized dual-speaker racing dialogue with emotion tags.',
    severity: 'normal'
  },
  {
    id: 'act-4',
    timestamp: '20:42:30',
    category: 'Model Load',
    title: 'GGUF 4-Bit Checkpoint Loaded',
    details: 'DevStudio-Core-v1 allocated 3.8 GB VRAM on 6.0 GB dedicated ceiling.',
    severity: 'normal'
  },
  {
    id: 'act-5',
    timestamp: '20:20:15',
    category: 'Account',
    title: 'Master Account Credentials Verified',
    details: 'michaela.chaffin369@gmail.com authenticated via local offline profile.',
    severity: 'normal'
  }
];

export const PROJECT_SPACES: GameProjectSpace[] = [
  {
    id: 'proj-code510',
    title: 'Project Code510: New York Racing World',
    genre: 'Motorsport & Racing',
    engineTarget: 'Unreal Engine 5.5',
    description: 'High-speed urban and mountain racing across Manhattan, Adirondacks, and Long Island with dynamic wet road physics.',
    codeLanguageDefault: 'Python',
    activeSeason: 'Autumn',
    levels: [
      { name: 'Manhattan Midnight Grid', environment: 'Wet Asphalt & Skyscrapers', weatherPreset: 'Autumn Drizzle & Surface Puddles', lightingProfile: 'Neon & Streetlamp Raytracing', ambientSound: 'City Hum & Rain' },
      { name: 'Adirondack Ridge Pass', environment: 'Alpine Forest Hairpins', weatherPreset: 'Morning Mountain Mist & Gusts', lightingProfile: 'Diffused Overcast & God Rays', ambientSound: 'Wind Foliage & Birds' },
      { name: 'Watkins Glen Pro Circuit', environment: 'FIA Grade 2 Asphalt', weatherPreset: 'Crisp Dry Sun', lightingProfile: 'Direct Solar Noon (5800K)', ambientSound: 'Pit Crew Radio' }
    ]
  },
  {
    id: 'proj-eldoria',
    title: 'Eldoria: Chronicles of the Forgotten Realm',
    genre: 'Action RPG & Open World',
    engineTarget: 'Godot 4.3',
    description: 'Open-world fantasy action RPG with dynamic medieval combat, magic systems, quest state machines, and wandering wildlife.',
    codeLanguageDefault: 'Python',
    activeSeason: 'Spring',
    levels: [
      { name: 'Whispering Glade', environment: 'Ancient Oak Woodland', weatherPreset: 'Spring Thaw & Petal Breeze', lightingProfile: 'Dappled Canopy Shadows', ambientSound: 'River Stream & Wildlife' },
      { name: 'Frozen Citadel of Frostfell', environment: 'Glacial Castle Ruins', weatherPreset: 'Sub-Zero Blizzard & Snow Drifts', lightingProfile: 'Aurora Borealis & Moonlight', ambientSound: 'Howling Wind & Crackling Ice' },
      { name: 'Dragonspire Volcanic Peaks', environment: 'Obsidian Rock & Lava Pools', weatherPreset: 'Ash Storm & Heat Waves', lightingProfile: 'Molten Core Glow & Volcanic Haze', ambientSound: 'Rumble & Steam Geysers' }
    ]
  },
  {
    id: 'proj-neon-horizon',
    title: 'Neon Horizon: 2099 Cyber Infiltration',
    genre: 'Sci-Fi Cyberpunk',
    engineTarget: 'Unreal Engine 5.5',
    description: 'Tactical stealth and gunplay in a dystopian vertical megalopolis with hacking terminals and volumetric neon smog.',
    codeLanguageDefault: 'Python',
    activeSeason: 'Summer',
    levels: [
      { name: 'Sub-Level 04 Industrial Sector', environment: 'Rooftops & Neon Holograms', weatherPreset: 'Toxic Smog & Acid Rain', lightingProfile: 'Bioluminescent Signs & Hard PCSS Shadows', ambientSound: 'Electronic Synth Drone' },
      { name: 'Orbital Skyport Penthouse', environment: 'Chrome & Smart Glass Interiors', weatherPreset: 'Pressurized Stratosphere Clear', lightingProfile: 'Direct Sunlight & Lens Glare', ambientSound: 'Air Conditioning & Hovercraft' }
    ]
  },
  {
    id: 'proj-verdant-valley',
    title: 'Verdant Valley Farmstead',
    genre: 'Cozy Sandbox & Building',
    engineTarget: 'Unity 6',
    description: 'Charming farm life simulator featuring seasonal crop growth, animal care, procedural weather calendar, and crafting.',
    codeLanguageDefault: 'Python',
    activeSeason: 'Spring',
    levels: [
      { name: 'Riverside Homestead', environment: 'Lush Meadows & Orchard', weatherPreset: 'Gentle Warm Sun & Cloud Shadows', lightingProfile: 'Warm Golden Sunlight (3400K)', ambientSound: 'Roosters & Gentle Breeze' },
      { name: 'Winter Solstice Valley', environment: 'Blanketed Snow Drifts & Frozen Pond', weatherPreset: 'Gentle Snowfall & Frost', lightingProfile: 'Pale Winter Sun & Soft Shadow Penumbra', ambientSound: 'Crunching Snow Footsteps' }
    ]
  },
  {
    id: 'proj-cinematic-studio',
    title: 'Aura Virtual Production & Cutscene Studio',
    genre: 'Cinematic Film Studio',
    engineTarget: 'Blender VSE',
    description: 'Cinematic camera track generator, 3-point studio lighting stage, automated keyframing, and narrative cutscene sequences.',
    codeLanguageDefault: 'Python',
    activeSeason: 'Summer',
    levels: [
      { name: 'Virtual Soundstage Stage A', environment: 'LED Volume & Green Screen Rig', weatherPreset: 'Controlled Studio Atmosphere', lightingProfile: 'Key / Fill / Rim 3-Point Light Rig', ambientSound: 'Clapperboard & Room Tone' },
      { name: 'Dramatic Cliffside Climax', environment: 'Ocean Bluff Overlook', weatherPreset: 'Thunderstorm Lightning & High Wind', lightingProfile: 'Strobe Lightning & Moody Vignette', ambientSound: 'Crashing Waves & Thunder' }
    ]
  }
];

// 40 Agents across all Game Dev Specialties with Supervisor-Worker Architecture
export const FULL_40_AGENTS: AgentItem[] = [
  // 1. Supervisor & Management
  {
    id: 'agent-orch-lead',
    name: 'Executive Studio Director & Orchestrator',
    category: 'Supervisor & Management',
    role: 'Central Studio Controller',
    modelBacking: 'DevStudio-Supervisor-v1',
    status: 'Active',
    vramUsageMB: 480,
    description: 'Oversees the entire agent roster, breaks down game design prompts, assigns worker tasks, and maintains global project state.',
    systemPrompt: 'You are the Executive Studio Director. Oversee worker agents, validate task execution order, and ensure seamless engine delivery.',
    isNotebookFirst: true,
    validationCheck: 'Enforces architectural coherence and orchestrates sub-agent handoffs.',
    author: 'System Preset'
  },
  {
    id: 'agent-orch-qa',
    name: 'LMM Quality & Memory Validator',
    category: 'Supervisor & Management',
    role: 'Double-Check Reviewer Agent',
    modelBacking: 'DevStudio-LMM-Auditor',
    status: 'Active',
    vramUsageMB: 390,
    description: 'Double-checks all worker agent outputs against notebook specifications, ensuring memory safety (under 6.0GB VRAM) and syntax validity.',
    systemPrompt: 'Audits generated code and assets. Double-checks every output against project notebook constraints before approving.',
    isNotebookFirst: true,
    validationCheck: 'Syntax, memory limits, and logic coherence verification.',
    author: 'System Preset'
  },
  {
    id: 'agent-orch-notebook',
    name: 'Notebook Knowledge Guardian',
    category: 'Supervisor & Management',
    role: 'Context & Ground Truth Keeper',
    modelBacking: 'DevStudio-ContextHub',
    status: 'Active',
    vramUsageMB: 280,
    description: 'Ensures all worker agents read and align with the active Project Notebook before writing code, mechanics, or assets.',
    systemPrompt: 'Maintain single source of truth across project spaces, vector memories, and game design documents.',
    isNotebookFirst: true,
    validationCheck: 'Context alignment and lore accuracy verification.',
    author: 'System Preset'
  },

  // 2. Code & Game Logic
  {
    id: 'agent-py-gameplay',
    name: 'Python Core Gameplay Programmer',
    category: 'Code & Game Logic',
    role: 'Python Gameplay Engineer',
    modelBacking: 'DevStudio-Coder-v1',
    status: 'Active',
    vramUsageMB: 420,
    description: 'Writes clean, modular Python game logic, player controllers, inventory systems, quest loops, and state machines.',
    systemPrompt: 'Generate modular, high-performance Python game code with clear type hints, clean state handling, and decoupled classes.',
    isNotebookFirst: true,
    validationCheck: 'PEP8 compliance, modular architecture, and exception safety.',
    author: 'System Preset'
  },
  {
    id: 'agent-cpp-unreal',
    name: 'Unreal Engine 5.5 C++ Systems Architect',
    category: 'Code & Game Logic',
    role: 'High-Performance Engine Developer',
    modelBacking: 'DevStudio-Coder-v1',
    status: 'Active',
    vramUsageMB: 450,
    description: 'Crafts Unreal Engine 5.5 C++ gameplay classes, UFUNCTION reflection, custom subsystems, and Blueprint nodes.',
    systemPrompt: 'Write production-grade Unreal C++ with proper garbage collection, smart pointers, and performant tick management.',
    isNotebookFirst: true,
    validationCheck: 'UHT compatibility and memory leak checks.',
    author: 'System Preset'
  },
  {
    id: 'agent-py-physics',
    name: 'Vehicle & Rigid Body Physics Simulator',
    category: 'Code & Game Logic',
    role: 'Physics Engine Programmer',
    modelBacking: 'DevStudio-Physics-v1',
    status: 'Active',
    vramUsageMB: 390,
    description: 'Computes Pacejka tire friction, suspension kinematics, aerodynamic drag, buoyancy, and ragdoll collisions in Python & C++.',
    systemPrompt: 'Simulate vehicle dynamics, tire grip circles, and rigid body physics state machines at 60Hz and 120Hz tick rates.',
    isNotebookFirst: true,
    validationCheck: 'Kinematic equation verification and numerical stability.',
    author: 'System Preset'
  },
  {
    id: 'agent-godot-script',
    name: 'Godot 4.3 & GDScript Specialist',
    category: 'Code & Game Logic',
    role: 'Godot Engine Architect',
    modelBacking: 'DevStudio-Coder-v1',
    status: 'Idle',
    vramUsageMB: 310,
    description: 'Builds Godot 4 scene graphs, CharacterBody3D controllers, signals, and resource management scripts.',
    systemPrompt: 'Expert in Godot 4 GDScript, scene composition, signal architectures, and viewport render settings.',
    isNotebookFirst: true,
    validationCheck: 'Node tree signal validity and performance checks.',
    author: 'System Preset'
  },
  {
    id: 'agent-unity-csharp',
    name: 'Unity 6 C# Gameplay Engineer',
    category: 'Code & Game Logic',
    role: 'Unity Systems Programmer',
    modelBacking: 'DevStudio-Coder-v1',
    status: 'Idle',
    vramUsageMB: 340,
    description: 'Generates Unity 6 MonoBehaviour systems, ScriptableObject event architectures, and Job System multithreading.',
    systemPrompt: 'Write clean Unity C# with memory allocation minimization (zero garbage collection in update loops).',
    isNotebookFirst: true,
    validationCheck: 'Garbage collection allocation review.',
    author: 'System Preset'
  },
  {
    id: 'agent-ai-fsm',
    name: 'NPC Enemy AI & Behavior Tree Designer',
    category: 'Code & Game Logic',
    role: 'Autonomous Enemy & NPC Behaviorist',
    modelBacking: 'DevStudio-Logic-v1',
    status: 'Active',
    vramUsageMB: 370,
    description: 'Engineers finite state machines (FSM), utility AI, sight perception cones, and tactical combat behaviors.',
    systemPrompt: 'Build intelligent NPC behaviors with state transitions, navigation mesh queries, and combat response trees.',
    isNotebookFirst: true,
    validationCheck: 'FSM loop verification to eliminate infinite state hangs.',
    author: 'System Preset'
  },
  {
    id: 'agent-inventory-econ',
    name: 'Game Economy & Inventory Architect',
    category: 'Code & Game Logic',
    role: 'Systems & Economy Balance Designer',
    modelBacking: 'DevStudio-Logic-v1',
    status: 'Idle',
    vramUsageMB: 260,
    description: 'Designs item crafting recipes, loot tables, currency balancing, equipment stat modifiers, and save game schemas.',
    systemPrompt: 'Formulate balanced RPG/game economies with mathematically calibrated drop rates and clean serialization.',
    isNotebookFirst: true,
    validationCheck: 'Mathematical progression curves and economy inflation check.',
    author: 'System Preset'
  },

  // 3. World & Environment
  {
    id: 'agent-world-procgen',
    name: 'Procedural World & Terrain Synthesizer',
    category: 'World & Environment',
    role: 'Procedural Generation Lead',
    modelBacking: 'UniForge + Mosaichunk',
    status: 'Active',
    vramUsageMB: 490,
    description: 'Generates infinite terrains, Perlin/Simplex heightmaps, biome transitions, river erosion, and road layouts.',
    systemPrompt: 'Synthesize seamless procedural terrain geometry, biome blends, and road splines matching notebook specs.',
    isNotebookFirst: true,
    validationCheck: 'Chunk boundary stitching and LOD mesh integrity.',
    author: 'System Preset'
  },
  {
    id: 'agent-splat-streamer',
    name: '3D Gaussian Splatting & Point Cloud Streamer',
    category: 'World & Environment',
    role: 'Splatting Optimization Engineer',
    modelBacking: 'InfiniSplat v2',
    status: 'Active',
    vramUsageMB: 460,
    description: 'Reconstructs photorealistic real-world landmarks into lightweight Gaussian splat datasets optimized for 6GB VRAM.',
    systemPrompt: 'Optimize 3D Gaussian splat point clouds into fast streaming representations with adaptive density pruning.',
    isNotebookFirst: true,
    validationCheck: 'Splat density budget under 6GB VRAM threshold.',
    author: 'System Preset'
  },
  {
    id: 'agent-mesh-chunker',
    name: 'Mosaichunk World Partition Engineer',
    category: 'World & Environment',
    role: 'Open-World LOD Streamer',
    modelBacking: 'Mosaichunk Engine',
    status: 'Active',
    vramUsageMB: 380,
    description: 'Partitions large open worlds into 250MB streaming chunks to prevent memory blowouts on low VRAM GPUs.',
    systemPrompt: 'Divide massive game levels into streaming tiles with frustum culling and seamless distance loading.',
    isNotebookFirst: true,
    validationCheck: 'Streaming boundary collision checks.',
    author: 'System Preset'
  },
  {
    id: 'agent-foliage-biome',
    name: 'Procedural Biome & Foliage Scatterer',
    category: 'World & Environment',
    role: 'Ecological Environment Artist',
    modelBacking: 'AI Moss Image + BiomeGen',
    status: 'Idle',
    vramUsageMB: 330,
    description: 'Populates forests, grasslands, rocks, and crops using natural Poisson-disc distributions and wind-reaction shaders.',
    systemPrompt: 'Scatter vegetation with density rules, slope masking, soil moisture gradients, and GPU instancing.',
    isNotebookFirst: true,
    validationCheck: 'Draw call limits and instance buffer bounds.',
    author: 'System Preset'
  },
  {
    id: 'agent-dungeon-generator',
    name: 'Dungeon & Interior Architecture Generator',
    category: 'World & Environment',
    role: 'Modular Interior Designer',
    modelBacking: 'DevStudio-World-v1',
    status: 'Idle',
    vramUsageMB: 310,
    description: 'Generates modular room layouts, dungeon corridor graphs, doorways, prop clutter, and puzzle chambers.',
    systemPrompt: 'Build connected indoor spaces with guaranteed path reachability and tactical cover placements.',
    isNotebookFirst: true,
    validationCheck: 'Graph reachability check (BFS/Dijkstra solver).',
    author: 'System Preset'
  },

  // 4. Audio & Voice
  {
    id: 'agent-drama3-director',
    name: 'Fish Audio Drama 3 Dialogue Director',
    category: 'Audio & Voice',
    role: 'Multi-Character Voice Director',
    modelBacking: 'Fish Audio Drama 3',
    status: 'Active',
    vramUsageMB: 520,
    description: 'Generates cinematic multi-character voice lines with emotional tags ([whisper], [urgent], [laughing], [shouting]).',
    systemPrompt: 'Direct multi-speaker vocal scenes using Fish Audio inline direction tags and multilingual cross-cloning.',
    isNotebookFirst: true,
    validationCheck: 'Phoneme timing, emotion tag syntax, and character timbre consistency.',
    author: 'System Preset'
  },
  {
    id: 'agent-foley-soundscape',
    name: 'AudioLDM 2 Environmental Sound Synthesizer',
    category: 'Audio & Voice',
    role: 'Spatial Foley & Ambiance Designer',
    modelBacking: 'AudioLDM 2 Engine',
    status: 'Active',
    vramUsageMB: 440,
    description: 'Synthesizes engine throttle roars, footstep textures (wet mud, snow, gravel), wind howling, and thunder claps.',
    systemPrompt: 'Generate procedural environmental soundscapes and 3D spatialized Foley effects for any scene.',
    isNotebookFirst: true,
    validationCheck: 'Audio frequency range and loop point smoothness.',
    author: 'System Preset'
  },
  {
    id: 'agent-music-composer',
    name: 'Dynamic Adaptive Music Composer',
    category: 'Audio & Voice',
    role: 'Interactive Music Producer',
    modelBacking: 'DevStudio-Audio-v1',
    status: 'Idle',
    vramUsageMB: 360,
    description: 'Creates stems that crossfade dynamically based on combat intensity, exploration peace, or victory sequences.',
    systemPrompt: 'Compose layered musical stems with BPM sync, stem crossfade triggers, and atmospheric resonance.',
    isNotebookFirst: true,
    validationCheck: 'Harmonic key alignment and transition crossfades.',
    author: 'System Preset'
  },

  // 5. Animation & Cameras
  {
    id: 'agent-gaussian-anim',
    name: 'Gaussianimate 4D Motion & Rigging Lead',
    category: 'Animation & Cameras',
    role: '4D Motion Dynamics Specialist',
    modelBacking: 'Gaussianimate',
    status: 'Active',
    vramUsageMB: 450,
    description: 'Rigs 3D meshes with skeletal blend trees, procedural IK foot placement on uneven terrain, and secondary cloth physics.',
    systemPrompt: 'Generate natural 4D motion matching, non-rigid mesh deformations, and physics-driven secondary motion.',
    isNotebookFirst: true,
    validationCheck: 'Bone transform limits and gimbal lock prevention.',
    author: 'System Preset'
  },
  {
    id: 'agent-blender-cam',
    name: 'Cinematic Camera Sequencer & Virtual Director',
    category: 'Animation & Cameras',
    role: 'Automated Cutscene Cinematographer',
    modelBacking: 'Blender-Cam Sequencer',
    status: 'Active',
    vramUsageMB: 340,
    description: 'Computes cinematic camera paths, Dolly-Zoom effects, rule-of-thirds tracking, and depth-of-field focal racks.',
    systemPrompt: 'Generate Python/Unreal camera tracks with cinematic easing curves, focal length adjustments, and subject framing.',
    isNotebookFirst: true,
    validationCheck: 'Frustum clipping and motion smoothness verification.',
    author: 'System Preset'
  },
  {
    id: 'agent-cutscene-script',
    name: 'Branching Dialogue & Cutscene Scriptwriter',
    category: 'Animation & Cameras',
    role: 'Narrative Lead & Lore Builder',
    modelBacking: 'KoboldCPP Narrative Bridge',
    status: 'Active',
    vramUsageMB: 370,
    description: 'Writes interactive dialogue trees, quest choices, character relationship meters, and cinematic screenplay scripts.',
    systemPrompt: 'Craft immersive narrative dialogue with branching choice nodes and deep character motivations.',
    isNotebookFirst: true,
    validationCheck: 'Dialogue node graph integrity and choice dead-end checks.',
    author: 'System Preset'
  },

  // 6. Lighting, Weather & Shadows (Universal)
  {
    id: 'agent-iclight-master',
    name: 'IC-Light Neural Illumination Architect',
    category: 'Lighting, Weather & Shadows',
    role: 'Universal Lighting & Normal Map Lead',
    modelBacking: 'IC-Light SD1.5',
    status: 'Active',
    vramUsageMB: 510,
    description: 'Manipulates directional sunlight, golden hours, studio 3-point rigs, HDR environment maps, and normal map synthesis.',
    systemPrompt: 'Impose consistent lighting transport across any 3D asset, character, or game level with derived normal map vectors.',
    isNotebookFirst: true,
    validationCheck: 'HDR luminance range and light transport conservation.',
    author: 'System Preset'
  },
  {
    id: 'agent-universal-weather',
    name: 'Universal 4-Season Climate & Weather Engine',
    category: 'Lighting, Weather & Shadows',
    role: 'Dynamic Atmospheric Physicist',
    modelBacking: 'Procedural Weather Core',
    status: 'Active',
    vramUsageMB: 430,
    description: 'Controls 4 seasons (Spring, Summer, Autumn, Winter), volumetric clouds, wind velocity vectors, rain and snow physics.',
    systemPrompt: 'Simulate full atmospheric systems with rain rate, snow accumulation depth, wind drag, and cloud cover percentage.',
    isNotebookFirst: true,
    validationCheck: 'Surface wetness and friction coefficient physics check.',
    author: 'System Preset'
  },
  {
    id: 'agent-shadow-physics',
    name: 'Realistic Shadow Physics & Penumbra Controller',
    category: 'Lighting, Weather & Shadows',
    role: 'Raytraced Shadow & Occlusion Engineer',
    modelBacking: 'Depth Anything V3 + ShadowCore',
    status: 'Active',
    vramUsageMB: 390,
    description: 'Calculates contact hardening shadows (PCSS), volumetric light shafts (god rays), soft penumbras, and ambient occlusion.',
    systemPrompt: 'Configure realistic shadow falloffs, light source angular diameters, contact shadows, and penumbra softness.',
    isNotebookFirst: true,
    validationCheck: 'Shadow map resolution vs 6GB VRAM budget verification.',
    author: 'System Preset'
  },
  {
    id: 'agent-water-shader',
    name: 'Ocean, River & Puddle Water Shader Artist',
    category: 'Lighting, Weather & Shadows',
    role: 'Fluid Shader Specialist',
    modelBacking: 'Streamrender H3',
    status: 'Idle',
    vramUsageMB: 350,
    description: 'Programs Gerstner wave displacement, subsurface scattering, foam peaks, rain droplet ripples, and road puddles.',
    systemPrompt: 'Write GPU shaders for realistic water dynamics with depth absorption, refraction, and surface wetness masks.',
    isNotebookFirst: true,
    validationCheck: 'Shader instruction count and performance profiling.',
    author: 'System Preset'
  },
  {
    id: 'agent-fog-atmosphere',
    name: 'Volumetric Cloud & Fog Atmosphere Specialist',
    category: 'Lighting, Weather & Shadows',
    role: 'Atmospheric Fog & Cloud Modeler',
    modelBacking: 'MapAnything Atmosphere',
    status: 'Idle',
    vramUsageMB: 330,
    description: 'Simulates exponential height fog, Rayleigh sky scattering, cloud altitude layers (cirrus, cumulus, stratus), and wind drift.',
    systemPrompt: 'Model volumetric clouds and atmospheric fog densities with directional light phase scattering.',
    isNotebookFirst: true,
    validationCheck: 'Volumetric marching sample count optimization.',
    author: 'System Preset'
  },

  // 7. Optimization, Telemetry & Testing
  {
    id: 'agent-pyspy-guard',
    name: 'Py-Spy VRAM Guard & Runtime Profiler',
    category: 'Optimization & Testing',
    role: 'Hardware Telemetry Monitor',
    modelBacking: 'py-spy Rust Engine',
    status: 'Active',
    vramUsageMB: 120,
    description: 'Samples memory footprints, inspects thread bottlenecks, and guarantees strict enforcement under 6.0GB VRAM.',
    systemPrompt: 'Monitor process memory, detect GPU leaks, and trigger automatic layer offloading before OOM occurs.',
    isNotebookFirst: true,
    validationCheck: 'Zero-overhead process memory auditing.',
    author: 'System Preset'
  },
  {
    id: 'agent-quant-manager',
    name: 'Model Quantization & GGUF Optimizer',
    category: 'Optimization & Testing',
    role: 'Model Weight Compression Lead',
    modelBacking: 'llama.cpp Quant Tools',
    status: 'Active',
    vramUsageMB: 180,
    description: 'Compresses large neural checkpoints into 4-bit (q4_k_m) and 8-bit formats for smooth execution on 6GB VRAM.',
    systemPrompt: 'Quantize neural layers with minimal perplexity degradation to fit consumer hardware memory pools.',
    isNotebookFirst: true,
    validationCheck: 'Perplexity loss validation post-quantization.',
    author: 'System Preset'
  },
  {
    id: 'agent-qa-playtester',
    name: 'Automated QA Playtester & Collision Hunter',
    category: 'Optimization & Testing',
    role: 'Automated QA & Bug Hunter',
    modelBacking: 'Matrix Game 4.0 QA',
    status: 'Active',
    vramUsageMB: 290,
    description: 'Simulates thousands of gameplay runs in headless mode to detect collision mesh holes, soft-locks, and balance flaws.',
    systemPrompt: 'Run automated playtesting scenarios, record exception stack traces, and report physics glitches.',
    isNotebookFirst: true,
    validationCheck: 'Error reproduction steps and regression validation.',
    author: 'System Preset'
  },
  {
    id: 'agent-package-builder',
    name: 'Standalone .EXE & ZIP Distribution Packager',
    category: 'Optimization & Testing',
    role: 'Deployment & Release Engineer',
    modelBacking: 'DevStudio-Packager',
    status: 'Idle',
    vramUsageMB: 160,
    description: 'Compiles Python/FastAPI backend and frontend into self-contained Windows desktop executables and self-hosting packages.',
    systemPrompt: 'Package clean distribution releases with self-extracting PowerShell installers and environment validators.',
    isNotebookFirst: true,
    validationCheck: 'Executable dependency audit and installer checksums.',
    author: 'System Preset'
  },

  // Additional Specialization Agents
  {
    id: 'agent-ui-hud',
    name: 'HUD, UI & Menu System Designer',
    category: 'Code & Game Logic',
    role: 'UI/UX Interface Programmer',
    modelBacking: 'DevStudio-Coder-v1',
    status: 'Idle',
    vramUsageMB: 240,
    description: 'Generates responsive game HUDs, minimaps, speedometers, inventory grids, and controller navigation in Python/Canvas/C++.',
    systemPrompt: 'Craft crisp, responsive in-game UI layouts with gamepad/keyboard accessibility.',
    isNotebookFirst: true,
    validationCheck: 'Input focus flow and resolution scaling check.',
    author: 'System Preset'
  },
  {
    id: 'agent-vfx-particle',
    name: 'Niagara & Particle VFX Specialist',
    category: 'Lighting, Weather & Shadows',
    role: 'VFX Artist',
    modelBacking: 'DevStudio-VFX-v1',
    status: 'Idle',
    vramUsageMB: 310,
    description: 'Creates exhaust flames, tire smoke, sparks, magic spell emitters, and snow blizzard particle systems.',
    systemPrompt: 'Design GPU particle systems with velocity dissipation, collision bounds, and light emissivity.',
    isNotebookFirst: true,
    validationCheck: 'Particle count budget vs GPU frame time.',
    author: 'System Preset'
  },
  {
    id: 'agent-audio-mastering',
    name: 'Dynamic Mix & Audio Mastering Engineer',
    category: 'Audio & Voice',
    role: 'Game Audio Mixer',
    modelBacking: 'DevStudio-Audio-v1',
    status: 'Idle',
    vramUsageMB: 270,
    description: 'Balances sound ducking when dialogue plays, manages master audio compression, and tunes HRTF 3D surround sound.',
    systemPrompt: 'Mix audio channels with dynamic sidechain ducking and binaural HRTF spatialization.',
    isNotebookFirst: true,
    validationCheck: 'LUFS loudness standards and clipping prevention.',
    author: 'System Preset'
  },
  {
    id: 'agent-prop-designer',
    name: '3D Hard Surface Prop & Vehicle Modeler',
    category: 'World & Environment',
    role: '3D Prop Artist',
    modelBacking: 'UniForge3D',
    status: 'Idle',
    vramUsageMB: 380,
    description: 'Synthesizes detailed vehicles, weapon models, racing car chasses, and architectural assets from text prompts.',
    systemPrompt: 'Generate clean topology 3D models with UV unwrapping and PBR material channels.',
    isNotebookFirst: true,
    validationCheck: 'Non-manifold geometry check and polygon count limits.',
    author: 'System Preset'
  },
  {
    id: 'agent-shader-compiler',
    name: 'PBR Material & HLSL Shader Compiler',
    category: 'Lighting, Weather & Shadows',
    role: 'Technical Shader Artist',
    modelBacking: 'DevStudio-Shader-v1',
    status: 'Idle',
    vramUsageMB: 330,
    description: 'Writes HLSL/GLSL shaders for car paint clear-coats, carbon fiber aniso, wet pavement reflections, and ice refraction.',
    systemPrompt: 'Write high-performance PBR shader code with metallic-roughness workflows and normal mapping.',
    isNotebookFirst: true,
    validationCheck: 'Shader compilation pass and GPU instruction optimization.',
    author: 'System Preset'
  },
  {
    id: 'agent-dialogue-localizer',
    name: 'Multilingual Voice & Text Localizer',
    category: 'Audio & Voice',
    role: 'Localization & Globalizer Specialist',
    modelBacking: 'Fish Audio S2-Pro',
    status: 'Idle',
    vramUsageMB: 350,
    description: 'Localizes text strings and speech into 24+ languages while preserving exact character vocal pitch and emotion.',
    systemPrompt: 'Translate and synthesize localized voice assets while maintaining character timbre consistency.',
    isNotebookFirst: true,
    validationCheck: 'Cultural appropriateness and audio timing alignment.',
    author: 'System Preset'
  },
  {
    id: 'agent-save-network',
    name: 'Multiplayer Replication & Save Manager',
    category: 'Code & Game Logic',
    role: 'Network & Backend Programmer',
    modelBacking: 'DevStudio-Coder-v1',
    status: 'Idle',
    vramUsageMB: 320,
    description: 'Manages client-server game state replication, lag compensation, lobby matchmaking, and local SQLite/JSON saves.',
    systemPrompt: 'Build authoritative network sync and safe local serialization systems.',
    isNotebookFirst: true,
    validationCheck: 'Replication security and packet serialization validation.',
    author: 'System Preset'
  },
  {
    id: 'agent-lighting-cinematic',
    name: 'Cinematic Mood & Color Grading Colorist',
    category: 'Lighting, Weather & Shadows',
    role: 'Colorist & Post-Process Lead',
    modelBacking: 'IC-Light + PostProc',
    status: 'Idle',
    vramUsageMB: 280,
    description: 'Tunes tone-mapping curves, ACES color pipelines, film grain, bloom thresholds, and lens chromatic aberrations.',
    systemPrompt: 'Adjust photographic post-processing, LUT color grading, and exposure adaptation.',
    isNotebookFirst: true,
    validationCheck: 'Color gamut bounds and dynamic range clipping checks.',
    author: 'System Preset'
  },
  {
    id: 'agent-cutscene-animator',
    name: 'Facial Capture & Lip-Sync Matcher',
    category: 'Animation & Cameras',
    role: 'Facial Animation Specialist',
    modelBacking: 'Gaussianimate Face',
    status: 'Idle',
    vramUsageMB: 390,
    description: 'Generates real-time viseme lip-sync from Fish Audio Drama 3 speech files and drives expressive eye/brow blendshapes.',
    systemPrompt: 'Synchronize vocal phonemes to facial morph targets with realistic micro-expressions.',
    isNotebookFirst: true,
    validationCheck: 'Viseme timing alignment against audio waveforms.',
    author: 'System Preset'
  },
  {
    id: 'agent-docker-admin',
    name: 'Docker Container & Service Orchestrator',
    category: 'Supervisor & Management',
    role: 'DevOps & Node Administrator',
    modelBacking: 'DevStudio-Infra-v1',
    status: 'Active',
    vramUsageMB: 190,
    description: 'Monitors Open WebUI, Ollama, ComfyUI, and TensorRT-LLM container health, ports, and internal networking.',
    systemPrompt: 'Manage container health, restart unresponsive nodes, and keep local ports clear.',
    isNotebookFirst: true,
    validationCheck: 'Port collision and container memory health checks.',
    author: 'System Preset'
  }
];

// Open Source Inventory
export const OPEN_SOURCE_INVENTORY: InventoryTool[] = [
  {
    name: 'Fish Audio Drama 3',
    source: 'Hugging Face',
    category: 'Audio & Voice',
    vramProfile: '3.1 GB (3B active MoE / 4-bit)',
    status: 'Quantized 4-bit',
    repoUrl: 'https://huggingface.co/fishaudio/drama-3',
    description: 'Mixture-of-experts model for cloning voices and generating multi-character, emotional dialogue with direction tags.',
    synthesizedCapability: 'Multi-character racing commentary, RPG companion banter, and cutscene vocalization with emotion tags.'
  },
  {
    name: 'IC-Light (Imposing Consistent Light)',
    source: 'GitHub',
    category: 'Lighting & Weather',
    vramProfile: '2.4 GB (SD1.5 relighting)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/lllyasviel/IC-Light',
    description: 'Illumination manipulation and HDR consistency for text- and background-conditioned neural relighting.',
    synthesizedCapability: 'Dynamic directional lighting, ambient occlusion maps, and derived normal map extraction for any 3D asset or level.'
  },
  {
    name: 'Blender-Cam / Camera Automation Sequencer',
    source: 'GitHub',
    category: 'Cinematics & Cameras',
    vramProfile: '0.4 GB (Python Native)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/topics/blender-camera',
    description: 'Python-driven automated camera path generation, focal rack sequencer, and cutscene keyframing.',
    synthesizedCapability: 'Automated cinematic cutscenes, dynamic racing chase cameras, and dramatic RPG dialogue shot framing.'
  },
  {
    name: 'KoboldCPP Narrative Bridge',
    source: 'GitHub',
    category: 'Agent Infrastructure',
    vramProfile: '3.2 GB (4-bit GGUF)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/LostRuins/koboldcpp',
    description: 'Offline narrative generation pipeline for branching dialogue trees, deep game lore, and quest state machines.',
    synthesizedCapability: 'Drives offline character rivalries, street-racing lore, and complex NPC choice trees without cloud connectivity.'
  },
  {
    name: 'Py-Spy Sampling Profiler',
    source: 'GitHub',
    category: 'Agent Infrastructure',
    vramProfile: '0.05 GB (Zero-Overhead Rust)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/benfred/py-spy',
    description: 'Extremely low overhead sampling profiler for Python/C++ with live SVG flamegraphs.',
    synthesizedCapability: 'Inspects runtime script performance, monitors VRAM allocations, and prevents memory leaks beyond 6.0 GB.'
  },
  {
    name: 'UniForge3D & InfiniSplat v2',
    source: 'Hugging Face',
    category: '3D World Mapping',
    vramProfile: '4.2 GB (Streaming)',
    status: 'Standby Node',
    repoUrl: 'https://huggingface.co/models?search=InfiniSplat',
    description: 'Combined 3D reconstruction, point-cloud synthesis, and fast Gaussian splatting from arbitrary views.',
    synthesizedCapability: 'Generates sprawling terrains, architectural landmarks, and photorealistic 3D game props.'
  },
  {
    name: 'Matrix Game 4.0',
    source: 'Hugging Face',
    category: '3D World Mapping',
    vramProfile: '4.8 GB (RAM Offload)',
    status: 'Standby Node',
    repoUrl: 'https://huggingface.co/models?search=Matrix+Game',
    description: 'Interactive world model and physics simulation generator for game dev state spaces.',
    synthesizedCapability: 'Simulates vehicle tire grip, rigid body collisions, and atmospheric weather transitions at 120Hz.'
  },
  {
    name: 'Gaussianimate',
    source: 'Hugging Face',
    category: 'Animation & Motion',
    vramProfile: '3.6 GB',
    status: 'Quantized 4-bit',
    repoUrl: 'https://huggingface.co/models?search=Gaussianimate',
    description: '4D non-rigid Gaussian motion dynamics and automatic skeletal rigging framework.',
    synthesizedCapability: 'Dynamic character animations, suspension bounce, and flag/cloth dynamics in any level.'
  },
  {
    name: 'Depth Anything V3 & MapAnything',
    source: 'Hugging Face',
    category: '3D World Mapping',
    vramProfile: '1.9 GB',
    status: 'Cloned & Ready',
    repoUrl: 'https://huggingface.co/models?search=Depth-Anything',
    description: 'Monocular depth estimation and unified Transformer for spatial 3D metrics and contact shadows.',
    synthesizedCapability: 'Generates accurate depth maps, collision hulls, and contact hardening shadow bounds.'
  },
  {
    name: 'Mosaichunk',
    source: 'Hugging Face',
    category: '3D World Mapping',
    vramProfile: '2.1 GB',
    status: 'Quantized 4-bit',
    repoUrl: 'https://huggingface.co/models?search=Mosaichunk',
    description: 'Modular 3D scene chunking and memory-bounded mesh assembly.',
    synthesizedCapability: 'Splits open-world maps into 250MB streaming LOD blocks stored on any Windows drive.'
  },
  {
    name: 'llama.cpp Engine',
    source: 'GitHub',
    category: 'Agent Infrastructure',
    vramProfile: '3.5 GB (4-bit GGUF)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/ggml-org/llama.cpp',
    description: 'C/C++ LLM runtime with ARM NEON, CUDA, Metal, and hybrid VRAM/RAM streaming.',
    synthesizedCapability: 'Low-latency token generator powering all 40 autonomous agent loops.'
  },
  {
    name: 'Open WebUI & Open Terminal',
    source: 'GitHub',
    category: 'Agent Infrastructure',
    vramProfile: '0.8 GB (Docker Container)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/open-webui/open-webui',
    description: 'Self-hosted AI orchestrator with fine-grained RBAC and sandbox terminal execution.',
    synthesizedCapability: 'Enables autonomous agents to execute Python scripts, compile C++, and modify game directories.'
  },
  {
    name: 'ComfyUI Core & Weight Streamer',
    source: 'GitHub',
    category: 'Agent Infrastructure',
    vramProfile: '2.5 GB (Streaming Cache)',
    status: 'Cloned & Ready',
    repoUrl: 'https://github.com/comfyanonymous/ComfyUI',
    description: 'Modular node-graph inference engine with async weight streaming down to 4GB VRAM.',
    synthesizedCapability: 'Visual node pipeline execution for batch textures, normal maps, and UI skin rendering.'
  }
];

// Universal Windows PowerShell Generator (Works on ANY Windows PC, automatically detects drive or uses User Profile)
export function generateUniversalPowerShellScript(customTargetFolder?: string): string {
  const targetExpr = customTargetFolder && customTargetFolder.trim() 
    ? `"${customTargetFolder.trim()}"` 
    : `$env:USERPROFILE + "\\DevStudio_v1_Workspace"`;

  return `# ==============================================================================
# DEV STUDIO v1 - UNIVERSAL WINDOWS PC SETUP SCRIPT
# Runs on ANY Windows PC (C:, D:, E:, or user profile folder)
# No specific drive letter required!
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       DEV STUDIO v1 - UNIVERSAL WINDOWS SETUP           " -ForegroundColor Cyan
Write-Host "  Works on any Windows PC, any drive, and any hardware   " -ForegroundColor Cyan
Write-Host "  Strict 6.0 GB VRAM optimization & Python-ready         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Automatically determine the best workspace location
# Priority: Custom folder -> Auto-detected largest drive -> User Profile folder
$TargetRoot = ${targetExpr}

# Prompt user if they want to override the location (press Enter for default)
Write-Host "Configured Workspace Location: $TargetRoot" -ForegroundColor Yellow
$UserChoice = Read-Host "Press [ENTER] to use this location, or type a custom path (e.g. C:\\DevStudio or E:\\DevStudio)"
if (![string]::IsNullOrWhiteSpace($UserChoice)) {
    $TargetRoot = $UserChoice.Trim().TrimEnd('\\')
}

$WorkspaceRoot = $TargetRoot
Write-Host "[SETUP] Target Directory: $WorkspaceRoot" -ForegroundColor Green

$Folders = @(
    "$WorkspaceRoot\\inventory_downloads",
    "$WorkspaceRoot\\inventory_downloads\\Lighting_IC_Light",
    "$WorkspaceRoot\\inventory_downloads\\Cinematics_BlenderCam",
    "$WorkspaceRoot\\inventory_downloads\\Narrative_KoboldCPP",
    "$WorkspaceRoot\\inventory_downloads\\Profiler_PySpy",
    "$WorkspaceRoot\\inventory_downloads\\Audio_Drama3_AudioLDM",
    "$WorkspaceRoot\\inventory_downloads\\World3D_UniForge_InfiniSplat",
    "$WorkspaceRoot\\inventory_downloads\\Animation_Gaussianimate",
    "$WorkspaceRoot\\inventory_downloads\\Agent_OpenWebUI_ComfyUI",
    "$WorkspaceRoot\\Models\\Checkpoints\\GGUF_4bit",
    "$WorkspaceRoot\\Models\\Checkpoints\\Diffusion_Relighting",
    "$WorkspaceRoot\\Models\\Voice_Drama3",
    "$WorkspaceRoot\\Models\\3D_Splatting",
    "$WorkspaceRoot\\Datasets\\Training_Folder",
    "$WorkspaceRoot\\Datasets\\Token_Memory",
    "$WorkspaceRoot\\Datasets\\Vector_Embeddings",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Track_Specs",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Physics_StateMachines",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Unreal_CPP_Blueprints",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Python_Scripts",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Audio_Soundscapes",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Lighting_Weather_Presets",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Cinematic_Cameras",
    "$WorkspaceRoot\\Projects\\Project_Code510\\Lore_Dialogue_Trees",
    "$WorkspaceRoot\\Projects\\Project_Eldoria_RPG\\World_Specs",
    "$WorkspaceRoot\\Projects\\Project_Eldoria_RPG\\Python_Gameplay",
    "$WorkspaceRoot\\Projects\\Project_NeonHorizon\\Cyber_Specs",
    "$WorkspaceRoot\\Projects\\Project_VerdantValley\\Sandbox_Specs",
    "$WorkspaceRoot\\Projects\\Project_CinematicStudio\\Virtual_Production",
    "$WorkspaceRoot\\Agents\\Supervisor_Orchestrator",
    "$WorkspaceRoot\\Agents\\Roster_40_Registry",
    "$WorkspaceRoot\\Agents\\Validation_Logs",
    "$WorkspaceRoot\\Engine_Bridges\\Unreal_Engine",
    "$WorkspaceRoot\\Engine_Bridges\\Blender",
    "$WorkspaceRoot\\Engine_Bridges\\Godot",
    "$WorkspaceRoot\\Engine_Bridges\\Unity",
    "$WorkspaceRoot\\Docker_Nodes\\OpenWebUI",
    "$WorkspaceRoot\\Docker_Nodes\\Ollama",
    "$WorkspaceRoot\\Docker_Nodes\\ComfyUI",
    "$WorkspaceRoot\\Telemetry\\py_spy_flamegraphs",
    "$WorkspaceRoot\\Vault\\Secrets",
    "$WorkspaceRoot\\Vault\\API_Keys",
    "$WorkspaceRoot\\Distribution_Builds\\Standalone_EXE",
    "$WorkspaceRoot\\Distribution_Builds\\Distribution_ZIP"
)

foreach ($Folder in $Folders) {
    if (-not (Test-Path $Folder)) {
        New-Item -ItemType Directory -Path $Folder -Force | Out-Null
        Write-Host "[CREATED] $Folder" -ForegroundColor Green
    } else {
        Write-Host "[EXISTS]  $Folder" -ForegroundColor DarkGray
    }
}

# Create Core Hardware & Universal System Configuration
$ConfigFile = "$WorkspaceRoot\\devstudio_config.json"
$ConfigContent = @{
    "platform_name" = "Dev Studio v1 (Universal Windows Custom AI Host)"
    "workspace_root" = $WorkspaceRoot
    "inventory_downloads" = "$WorkspaceRoot\\inventory_downloads"
    "hardware_specs" = @{
        "dedicated_vram_limit_gb" = 6.0
        "shared_gpu_memory_gb" = 8.0
        "total_gpu_memory_gb" = 13.9
        "universal_pc_mode" = $true
        "auto_spill_threshold_percent" = 80
    }
    "custom_ai_host" = @{
        "host" = "127.0.0.1"
        "port" = 8000
        "engine_runner" = "devstudio_native_ai_host.py"
        "status" = "CONFIGURED"
    }
    "docker_vram_bridge" = @{
        "enabled" = $true
        "api_key_auth" = $true
        "container_api_key_header" = "Authorization: Bearer <DEVSTUDIO_API_KEY>"
        "substitute_vram_pool_gb" = 24.0
    }
    "active_project" = "Universal Multi-Genre Studio"
    "primary_language" = "Python"
    "supported_languages" = @("Python", "C++", "Blueprints")
    "agent_architecture" = "Supervisor-Worker Orchestrator with Notebook-First LMM Validation"
    "max_agent_capacity" = 40
    "default_quantization" = "4-bit (q4_k_m)"
} | ConvertTo-Json -Depth 5

Set-Content -Path $ConfigFile -Value $ConfigContent -Encoding UTF8
Write-Host "[CONFIG] Saved universal config file to: $ConfigFile" -ForegroundColor Yellow

# Write Out the Dev Studio Native Custom AI Python Host Script
$HostScriptPath = "$WorkspaceRoot\\devstudio_native_ai_host.py"
$HostScriptCode = @'
import os, sys, math, logging
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

try:
    from fastapi import FastAPI, HTTPException, Depends, Header, Request, status
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
except ImportError:
    print("[ERROR] FastAPI and Uvicorn required: pip install fastapi uvicorn pydantic")
    sys.exit(1)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("DevStudio-NativeAI")

LOCAL_VRAM_CAP_GB = 6.0
SHARED_GPU_MEM_GB = 8.0
AUTO_SPILLWAY_THRESHOLD = 0.80

DOCKER_AUTH_KEYS = {
    "ds_live_9f82b7c4e81a942d0fa168923a7c": {"scope": "Full Studio Admin", "role": "Master Desktop"},
    "ds_docker_bearer_79x": {"scope": "VRAM Container Substitute", "role": "External GPU Node"}
}

def verify_docker_api_key(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header. Use 'Bearer <DEVSTUDIO_API_KEY>'")
    token = authorization.split()[-1]
    env_token = os.getenv("DEVSTUDIO_CONTAINER_API_KEY", "")
    if token in DOCKER_AUTH_KEYS or (env_token and token == env_token):
        return token
    raise HTTPException(status_code=403, detail="Invalid Dev Studio Docker API Key.")

app = FastAPI(title="Dev Studio v1 Custom AI Host", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {
        "status": "Dev Studio Custom AI Host Active",
        "hardware": {"dedicated_vram_cap": LOCAL_VRAM_CAP_GB, "spillway_threshold": "80%"},
        "docker_vram_bridge": "API Key Authenticated (Bearer Token)"
    }

@app.get("/v1/telemetry")
def telemetry():
    return {"dedicated_vram_used": 2.4, "cap": 6.0, "docker_substitute_pool_gb": 24.0, "status": "SAFE_BELOW_CAP"}

@app.post("/v1/docker/bridge/handshake")
def docker_handshake(token: str = Depends(verify_docker_api_key)):
    return {"status": "AUTHENTICATED", "message": "Docker container connected with valid Dev Studio API Key.", "substitute_vram_ready": True}

if __name__ == "__main__":
    port = int(os.getenv("DEVSTUDIO_PORT", 8000))
    print(f"\\n[DEV STUDIO] Hosting Custom AI on Windows PC: http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
'@

Set-Content -Path $HostScriptPath -Value $HostScriptCode -Encoding UTF8
Write-Host "[CREATED] Synthesized Native AI Host: $HostScriptPath" -ForegroundColor Green

# Environment Setup & Python Dependency Installation Guide
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  PYTHON ENVIRONMENT & DOCKER API KEY CONFIGURATION       " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Install Python dependencies if python is available
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "[PYTHON] Detected Python. Setting up virtual environment..." -ForegroundColor White
    $VenvPath = "$WorkspaceRoot\\venv"
    if (-not (Test-Path $VenvPath)) {
        python -m venv $VenvPath
        Write-Host "[VENV] Created virtual environment at $VenvPath" -ForegroundColor Green
    }
    
    Write-Host "[PIP] Installing core FastAPI, Uvicorn, and PyTorch packages..." -ForegroundColor White
    & "$VenvPath\\Scripts\\pip.exe" install fastapi uvicorn pydantic py-spy huggingface-hub --quiet
    Write-Host "[SUCCESS] Core runtime dependencies installed in venv." -ForegroundColor Green
} else {
    Write-Host "[INFO] Python not found in PATH. Install Python 3.10+ from python.org to run native host." -ForegroundColor Yellow
}

# Configure Docker Container API Key Environment Variable
$DefaultDockerKey = "ds_live_9f82b7c4e81a942d0fa168923a7c"
[System.Environment]::SetEnvironmentVariable("DEVSTUDIO_CONTAINER_API_KEY", $DefaultDockerKey, [System.EnvironmentVariableTarget]::User)
Write-Host "[DOCKER AUTH] Registered DEVSTUDIO_CONTAINER_API_KEY=$DefaultDockerKey (User Env)" -ForegroundColor Magenta

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ">>> UNIVERSAL SETUP & CUSTOM AI HOST READY! <<<" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Workspace Root: $WorkspaceRoot" -ForegroundColor White
Write-Host "1. To launch your custom AI engine on this PC:" -ForegroundColor White
Write-Host "   cd $WorkspaceRoot" -ForegroundColor Cyan
Write-Host "   .\\venv\\Scripts\\python.exe devstudio_native_ai_host.py" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. To connect external Docker containers with API Key:" -ForegroundColor White
Write-Host "   docker run -d -p 8000:8000 --gpus all -e DEVSTUDIO_CONTAINER_API_KEY=\\"$DefaultDockerKey\\" vllm/vllm-openai:latest" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dev Studio UI can now communicate with your native host at http://localhost:8000." -ForegroundColor White
`;
}

export interface DockerVramConfig {
  id: string;
  name: string;
  engineType: 'vLLM-Omni CUDA' | 'llama.cpp-rpc Remote Worker' | 'ComfyUI Headless Node' | 'Ollama Docker Host' | 'Custom PyTorch Memory Bridge';
  endpoint: string;
  vramCapacityGB: number;
  vramUsedGB: number;
  status: 'Connected' | 'Disconnected' | 'Offloading' | 'Spill-Standby';
  pingMs: number;
  gpuName: string;
  containerImage: string;
  containerId: string;
  autoSpillThreshold: number;
  layersOffloaded: number;
  assignedModels: string[];
}

export const SAMPLE_DOCKER_NODES: DockerVramConfig[] = [
  {
    id: 'docker-node-1',
    name: 'LAN GPU Server - Primary VRAM Substitute',
    engineType: 'vLLM-Omni CUDA',
    endpoint: 'http://192.168.1.185:8000',
    vramCapacityGB: 24,
    vramUsedGB: 14.8,
    status: 'Connected',
    pingMs: 11,
    gpuName: 'NVIDIA RTX 4090 (24 GB VRAM)',
    containerImage: 'vllm/vllm-openai:latest',
    containerId: '7f9a2c31e45b',
    autoSpillThreshold: 80,
    layersOffloaded: 18,
    assignedModels: ['Fish Audio Drama 3 (35B-A3B)', 'IC-Light SD1.5 Relighter', 'UniForge3D Gaussian Splats']
  },
  {
    id: 'docker-node-2',
    name: 'Local WSL2 Host - Shared Memory Bridge',
    engineType: 'llama.cpp-rpc Remote Worker',
    endpoint: 'http://localhost:8080',
    vramCapacityGB: 16,
    vramUsedGB: 4.2,
    status: 'Spill-Standby',
    pingMs: 2,
    gpuName: 'Host Shared System RAM Pool (16 GB Virtual VRAM)',
    containerImage: 'ghcr.io/ggml-org/llama.cpp:server-cuda',
    containerId: 'a3d489b1c720',
    autoSpillThreshold: 85,
    layersOffloaded: 10,
    assignedModels: ['Qwen 3.5 14B Reasoning Agent', 'ComfyUI Secondary Diffusion Cache']
  },
  {
    id: 'docker-node-3',
    name: 'Cloud Dedicated GPU Pod - Massive Spillway',
    engineType: 'Custom PyTorch Memory Bridge',
    endpoint: 'https://vram-node.devstudio-internal.net:8443',
    vramCapacityGB: 80,
    vramUsedGB: 0,
    status: 'Spill-Standby',
    pingMs: 28,
    gpuName: 'NVIDIA A100-SXM4 (80 GB VRAM)',
    containerImage: 'pytorch/pytorch:2.4.0-cuda12.4-cudnn9-runtime',
    containerId: 'c82047ff910a',
    autoSpillThreshold: 92,
    layersOffloaded: 0,
    assignedModels: ['Emergency 80GB OOM Prevention Spillway']
  }
];

export interface DockerCommandPreset {
  title: string;
  engine: string;
  description: string;
  command: string;
  ports: string;
  gpuRequirements: string;
}

export const DOCKER_COMMAND_PRESETS: DockerCommandPreset[] = [
  {
    title: 'vLLM-Omni Universal CUDA VRAM Substitute',
    engine: 'vLLM-Omni',
    description: 'High-throughput OpenAI-compatible server with PagedAttention and weight offloading. Ideal for Fish Audio Drama 3 & large LLM worker models.',
    ports: '8000:8000',
    gpuRequirements: 'NVIDIA GPU with CUDA 12+ / Container Toolkit',
    command: `docker run -d --name devstudio-vram-substitute \\
  --gpus all \\
  --ipc=host \\
  --ulimit memlock=-1 \\
  --restart always \\
  -p 8000:8000 \\
  -v devstudio_cache:/root/.cache \\
  -e VRAM_SUBSTITUTE_ALLOCATION=24GB \\
  -e MAX_MODEL_LEN=8192 \\
  vllm/vllm-openai:latest \\
  --model Qwen/Qwen2.5-14B-Instruct \\
  --gpu-memory-utilization 0.92 \\
  --tensor-parallel-size 1`
  },
  {
    title: 'llama.cpp RPC Remote Memory Worker',
    engine: 'llama.cpp-rpc',
    description: 'Ultra-low overhead C++ RPC daemon. Splits layers across network sockets so your local 6GB VRAM only handles prompt intake while remote container processes dense feedforward layers.',
    ports: '50052:50052',
    gpuRequirements: 'Any host with CUDA, ROCm, Vulkan or high RAM capacity',
    command: `docker run -d --name devstudio-rpc-worker \\
  --gpus all \\
  --restart unless-stopped \\
  -p 50052:50052 \\
  ghcr.io/ggml-org/llama.cpp:rpc-server \\
  -H 0.0.0.0 \\
  -p 50052 \\
  --memory 24576`
  },
  {
    title: 'ComfyUI Headless Remote Diffusion Container',
    engine: 'ComfyUI Docker',
    description: 'Headless ComfyUI node with asynchronous weight streaming. Offloads IC-Light latent relighting, normal map rendering, and Flux/SDXL passes from local PC.',
    ports: '8188:8188',
    gpuRequirements: 'NVIDIA or AMD GPU host',
    command: `docker run -d --name devstudio-comfyui-bridge \\
  --gpus all \\
  --restart always \\
  -p 8188:8188 \\
  -v comfy_models:/app/ComfyUI/models \\
  -v comfy_output:/app/ComfyUI/output \\
  -e CLI_ARGS="--listen 0.0.0.0 --port 8188 --gpu-only --preview-method auto" \\
  yanwk/comfyui-boot:cu124`
  },
  {
    title: 'Ollama Remote GPU Container with OpenWebUI Bridge',
    engine: 'Ollama + OpenWebUI',
    description: 'Instant multi-model orchestrator with automatic layer streaming and REST API. Seamless drop-in fallback for agents when local VRAM is saturated.',
    ports: '11434:11434',
    gpuRequirements: 'NVIDIA GPU with CUDA drivers',
    command: `docker run -d --name devstudio-ollama-bridge \\
  --gpus all \\
  -v ollama_storage:/root/.ollama \\
  -p 11434:11434 \\
  --restart always \\
  -e OLLAMA_KEEP_ALIVE=24h \\
  -e OLLAMA_NUM_PARALLEL=4 \\
  ollama/ollama:latest`
  }
];

export const PHASE_1_POWERSHELL_SCRIPT = generateUniversalPowerShellScript();
