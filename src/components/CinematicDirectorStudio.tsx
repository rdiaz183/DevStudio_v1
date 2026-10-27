import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Film,
  Sliders,
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Layers,
  Sun,
  CloudRain,
  Eye,
  Radio,
  FileCode,
  CheckCircle2,
  Terminal,
  Volume2,
  Zap,
  Folder,
  Scissors,
  Crop,
  Trash2,
  Plus,
  Send,
  MessageSquare,
  History,
  Settings,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Edit3,
  Video,
  CornerDownLeft,
  ArrowRight,
  Upload,
  Box,
  Music,
  Image,
  FileText,
  X,
  EyeOff,
  Move,
  Bookmark,
  Tag
} from 'lucide-react';
import { triggerFileDownload } from '../data/windows11Setup';

export interface CinematicSceneAsset {
  id: string;
  name: string;
  type: '3d-mesh' | 'audio-track' | 'video-plate' | 'texture-lut' | 'vfx-particle' | 'script-driver' | 'generic';
  source: 'Created in App' | 'External Upload' | 'Vault Preset';
  format: string;
  sizeStr: string;
  status: 'In Scene' | 'Standby';
  roleInScene: '3D Actor / Hero Prop' | 'Camera Plate / Skybox' | 'BGM / Audio Track' | 'Volumetric Particle VFX' | 'Procedural Script Controller' | 'Custom Component';
  assignedClipId?: string;
  url?: string;
  details?: string;
  transform?: {
    posX: number;
    posY: number;
    posZ: number;
    scale: number;
    rotationY: number;
  };
}

export const INITIAL_SCENE_ASSETS: CinematicSceneAsset[] = [
  {
    id: 'asset-1',
    name: 'Cyberpunk_Hovercar_Hero.fbx',
    type: '3d-mesh',
    source: 'Created in App',
    format: 'FBX',
    sizeStr: '42.5 MB',
    status: 'In Scene',
    roleInScene: '3D Actor / Hero Prop',
    assignedClipId: 'global',
    details: 'Custom high-poly sci-fi vehicle with dynamic wheel emissive neon shaders and suspension rigging.',
    transform: { posX: 0, posY: 0, posZ: 0, scale: 1.0, rotationY: 0 }
  },
  {
    id: 'asset-2',
    name: 'Synthwave_Director_Anthem.wav',
    type: 'audio-track',
    source: 'Created in App',
    format: 'WAV',
    sizeStr: '28.4 MB',
    status: 'In Scene',
    roleInScene: 'BGM / Audio Track',
    assignedClipId: 'global',
    details: 'Synthesized via MusicGen Studio at 130 BPM with analog arpeggios, sidechained kick, and stereo sub bass.',
    transform: { posX: 0, posY: 0, posZ: 0, scale: 1.0, rotationY: 0 }
  },
  {
    id: 'asset-3',
    name: 'NeoTokyo_Rain_Skybox.exr',
    type: 'video-plate',
    source: 'Created in App',
    format: 'EXR',
    sizeStr: '18.2 MB',
    status: 'In Scene',
    roleInScene: 'Camera Plate / Skybox',
    assignedClipId: 'global',
    details: '32-bit floating point HDR panoramic environment skybox with volumetric city night lights and overcast clouds.',
    transform: { posX: 0, posY: 0, posZ: 0, scale: 1.0, rotationY: 0 }
  },
  {
    id: 'asset-4',
    name: 'Pacejka_Vehicle_Dynamics.py',
    type: 'script-driver',
    source: 'Created in App',
    format: 'PY',
    sizeStr: '12 KB',
    status: 'In Scene',
    roleInScene: 'Procedural Script Controller',
    assignedClipId: 'global',
    details: 'Real-time Python slip angle and drift physics controller linked into Unreal LiveLink bridge.',
    transform: { posX: 0, posY: 0, posZ: 0, scale: 1.0, rotationY: 0 }
  }
];

export const AVAILABLE_APP_ASSETS: Array<{
  id: string;
  name: string;
  type: CinematicSceneAsset['type'];
  format: string;
  sizeStr: string;
  sourceTab: string;
  roleInScene: CinematicSceneAsset['roleInScene'];
  description: string;
}> = [
  {
    id: 'app-asset-hovercar',
    name: 'Cyberpunk_Hovercar_Hero.fbx',
    type: '3d-mesh',
    format: 'FBX',
    sizeStr: '42.5 MB',
    sourceTab: 'Asset Vault',
    roleInScene: '3D Actor / Hero Prop',
    description: 'Hero vehicle asset with emissive neon strips, aerodynamic spoiler, and wheel glow.'
  },
  {
    id: 'app-asset-drone',
    name: 'SciFi_Drone_Scout.gltf',
    type: '3d-mesh',
    format: 'GLTF',
    sizeStr: '14.8 MB',
    sourceTab: 'Asset Vault',
    roleInScene: '3D Actor / Hero Prop',
    description: 'Autonomous camera drone with gimbal stabilizer and navigation thrusters.'
  },
  {
    id: 'app-asset-golem',
    name: 'Gargantuan_Golem_Titan.obj',
    type: '3d-mesh',
    format: 'OBJ',
    sizeStr: '68.2 MB',
    sourceTab: 'Asset Vault',
    roleInScene: '3D Actor / Hero Prop',
    description: 'Colossal rocky creature with glowing magma runes and heavy ground impact physics.'
  },
  {
    id: 'app-asset-bgm-synthwave',
    name: 'Synthwave_Director_Anthem.wav',
    type: 'audio-track',
    format: 'WAV',
    sizeStr: '28.4 MB',
    sourceTab: 'MusicGen Studio',
    roleInScene: 'BGM / Audio Track',
    description: 'Driving 130 BPM cinematic electronic anthem with analog lead synths and sub bass.'
  },
  {
    id: 'app-asset-bgm-orchestral',
    name: 'Cyber_Orchestral_Climax.flac',
    type: 'audio-track',
    format: 'FLAC',
    sizeStr: '34.1 MB',
    sourceTab: 'MusicGen Studio',
    roleInScene: 'BGM / Audio Track',
    description: 'Dramatic brass stabs, taiko drums, and choir swell for intense scene finales.'
  },
  {
    id: 'app-asset-voice-marcus',
    name: 'Marcus_ShieldFailure_Take01.wav',
    type: 'audio-track',
    format: 'WAV',
    sizeStr: '4.8 MB',
    sourceTab: 'Voice & Audio Studio',
    roleInScene: 'BGM / Audio Track',
    description: 'Fish Audio Drama 3 vocal take: Commander Marcus "[gasp] The perimeter shields have collapsed!"'
  },
  {
    id: 'app-asset-voice-lyra',
    name: 'Lyra_AI_Guide_Warning_Take02.wav',
    type: 'audio-track',
    format: 'WAV',
    sizeStr: '6.2 MB',
    sourceTab: 'Voice & Audio Studio',
    roleInScene: 'BGM / Audio Track',
    description: 'Melodic cybernetic voice take: "[whisper] Thermal core variance exceeding nominal limits."'
  },
  {
    id: 'app-asset-skybox',
    name: 'NeoTokyo_Rain_Skybox.exr',
    type: 'video-plate',
    format: 'EXR',
    sizeStr: '18.2 MB',
    sourceTab: 'Asset Vault',
    roleInScene: 'Camera Plate / Skybox',
    description: '32-bit panoramic night city plate with reflective wet horizon and sodium streetlamps.'
  },
  {
    id: 'app-asset-puddle-vfx',
    name: 'Rain_Puddle_Splatter.vfx',
    type: 'vfx-particle',
    format: 'VFX',
    sizeStr: '2.4 MB',
    sourceTab: 'Asset Vault',
    roleInScene: 'Volumetric Particle VFX',
    description: 'Niagara GPU particle emitter simulation for rain impact splashes and puddle ripples.'
  },
  {
    id: 'app-asset-physics-script',
    name: 'Pacejka_Vehicle_Dynamics.py',
    type: 'script-driver',
    format: 'PY',
    sizeStr: '12 KB',
    sourceTab: 'Project Notebooks',
    roleInScene: 'Procedural Script Controller',
    description: 'Python wheel slip lateral force calculator for realistic vehicular drifts.'
  }
];

export interface CinematicClip {
  id: string;
  name: string;
  startSec: number;
  endSec: number;
  prompt: string;
  cameraMotion: 'drone-chase' | 'orbit-spline' | 'crane-overhead' | 'bumper-low' | 'handheld';
  focalLengthMm: number;
  apertureFStop: number;
  dutchAngleDeg: number;
  lightingPreset: 'midnight-neon' | 'sunset-golden' | 'cyber-violet' | 'noir-rain' | 'studio-key';
  rainDensityPct: number;
  colorGradeLut: 'teal-orange' | 'matrix-green' | 'noir-monochrome' | 'kodak-warm' | 'cyberpunk-magenta';
  cropRatio: '2.39:1' | '16:9' | '4:3' | '9:16';
  speed: number;
  accentColor: string;
}

export interface DirectorMessage {
  id: string;
  sender: 'director' | 'ai';
  text: string;
  appliedAction?: string;
  timestamp: string;
}

export interface CinematicDirectorStudioProps {
  themeMode: 'light' | 'dark';
  showToast: (msg: string) => void;
  onPushToUnreal: (assetName: string, code: string, lang: string) => void;
}

const INITIAL_CLIPS: CinematicClip[] = [
  {
    id: 'clip-1',
    name: 'Shot 1: Low Bumper Push',
    startSec: 0,
    endSec: 3.5,
    prompt: 'Low-angle wet asphalt push through neon-lit Neo-Manhattan tunnel with ground water reflection and headlight beams.',
    cameraMotion: 'bumper-low',
    focalLengthMm: 24,
    apertureFStop: 2.8,
    dutchAngleDeg: 4,
    lightingPreset: 'midnight-neon',
    rainDensityPct: 80,
    colorGradeLut: 'teal-orange',
    cropRatio: '2.39:1',
    speed: 1.0,
    accentColor: '#06b6d4' // cyan
  },
  {
    id: 'clip-2',
    name: 'Shot 2: Drone Sweep & Drift',
    startSec: 3.5,
    endSec: 7.0,
    prompt: 'High-speed drone swoop down over the rear spoiler into a dynamic Dutch tilt as the car initiates a high-angle drift.',
    cameraMotion: 'drone-chase',
    focalLengthMm: 35,
    apertureFStop: 2.0,
    dutchAngleDeg: 16,
    lightingPreset: 'cyber-violet',
    rainDensityPct: 65,
    colorGradeLut: 'cyberpunk-magenta',
    cropRatio: '2.39:1',
    speed: 1.0,
    accentColor: '#8b5cf6' // violet
  },
  {
    id: 'clip-3',
    name: 'Shot 3: 180° Orbital Wrap',
    startSec: 7.0,
    endSec: 10.0,
    prompt: 'Slow-motion 180-degree orbital camera rotation wrapping around the driver cockpit with anamorphic flares and flying water droplets.',
    cameraMotion: 'orbit-spline',
    focalLengthMm: 50,
    apertureFStop: 1.4,
    dutchAngleDeg: -8,
    lightingPreset: 'midnight-neon',
    rainDensityPct: 50,
    colorGradeLut: 'teal-orange',
    cropRatio: '2.39:1',
    speed: 0.5,
    accentColor: '#ec4899' // pink
  },
  {
    id: 'clip-4',
    name: 'Shot 4: Hero Frontal Rack-Focus',
    startSec: 10.0,
    endSec: 12.0,
    prompt: 'Tight telephoto head-on shot racking focus from the gleaming grille to the windshield reflections under overhead sodium highway lamps.',
    cameraMotion: 'crane-overhead',
    focalLengthMm: 85,
    apertureFStop: 2.0,
    dutchAngleDeg: 0,
    lightingPreset: 'sunset-golden',
    rainDensityPct: 20,
    colorGradeLut: 'kodak-warm',
    cropRatio: '2.39:1',
    speed: 1.0,
    accentColor: '#10b981' // emerald
  }
];

export function CinematicDirectorStudio({
  themeMode,
  showToast,
  onPushToUnreal
}: CinematicDirectorStudioProps) {
  // Timeline Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copiedCodeType, setCopiedCodeType] = useState<string | null>(null);

  // Non-Linear Clips / Shots State
  const [clips, setClips] = useState<CinematicClip[]>(INITIAL_CLIPS);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-1');
  const [clipboardClip, setClipboardClip] = useState<CinematicClip | null>(null);

  // Section Editing Modal / Inspector
  const [isEditingSection, setIsEditingSection] = useState<boolean>(false);
  const [editSectionPrompt, setEditSectionPrompt] = useState<string>('');

  // Conversational Director Prompt Bar State
  const [conversationalInput, setConversationalInput] = useState<string>('');
  const [directorHistory, setDirectorHistory] = useState<DirectorMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'AI Cinematic Director initialized. Type conversational commands like "Add dramatic lightning", "Zoom in 85mm lens with 20° tilt", or "Cut clip here and make it golden hour sunset" to edit the sequence in real time.',
      timestamp: '12:00:00'
    }
  ]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [lastDirectorialAction, setLastDirectorialAction] = useState<string | null>(null);

  // Overlays & Viewport settings
  const [showRuleOfThirds, setShowRuleOfThirds] = useState<boolean>(true);
  const [bloomIntensity, setBloomIntensity] = useState<number>(65);
  const [keyLightIntensity, setKeyLightIntensity] = useState<number>(85);
  const [rimLightIntensity, setRimLightIntensity] = useState<number>(90);

  // Scene Assets & Staging Hub State
  const [sceneAssets, setSceneAssets] = useState<CinematicSceneAsset[]>(INITIAL_SCENE_ASSETS);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
  const [assetModalTab, setAssetModalTab] = useState<'app-creations' | 'external-upload' | 'app-created' | 'outside-source'>('app-created');
  const [isAssetPanelExpanded, setIsAssetPanelExpanded] = useState<boolean>(true);
  const [selectedAssetForTransform, setSelectedAssetForTransform] = useState<string | null>(null);
  const [uploadRole, setUploadRole] = useState<CinematicSceneAsset['roleInScene']>('3D Actor / Hero Prop');
  const [uploadClipTarget, setUploadClipTarget] = useState<string>('global');
  const [isDraggingAssetFile, setIsDraggingAssetFile] = useState<boolean>(false);
  const fileInputAssetRef = useRef<HTMLInputElement | null>(null);

  const handleAddExternalFiles = (e: React.ChangeEvent<HTMLInputElement> | FileList | File[]) => {
    let fileList: File[] = [];
    if ('target' in e && e.target && e.target.files) {
      fileList = Array.from(e.target.files);
    } else if (Array.isArray(e)) {
      fileList = e;
    } else if (e instanceof FileList) {
      fileList = Array.from(e);
    }
    if (fileList.length === 0) return;

    const newAssets: CinematicSceneAsset[] = fileList.map((file, idx) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'RAW';
      let type: CinematicSceneAsset['type'] = 'generic';
      let defaultRole: CinematicSceneAsset['roleInScene'] = uploadRole;

      if (['FBX', 'OBJ', 'GLTF', 'GLB', 'USD', 'USDZ', 'BLEND', 'STL', 'DAE', 'MAX', 'C4D'].includes(ext)) {
        type = '3d-mesh';
        defaultRole = '3D Actor / Hero Prop';
      } else if (['MP4', 'WEBM', 'MOV', 'AVI', 'MKV', 'EXR', 'HDR'].includes(ext)) {
        type = 'video-plate';
        defaultRole = 'Camera Plate / Skybox';
      } else if (['WAV', 'MP3', 'OGG', 'FLAC', 'AAC', 'M4A', 'AIFF'].includes(ext)) {
        type = 'audio-track';
        defaultRole = 'BGM / Audio Track';
      } else if (['PNG', 'JPG', 'JPEG', 'WEBP', 'TGA', 'BMP', 'TIFF', 'LUT', 'CUBE'].includes(ext)) {
        type = 'texture-lut';
        defaultRole = 'Camera Plate / Skybox';
      } else if (['PY', 'CPP', 'CS', 'JS', 'JSON', 'UASSET', 'UMAP'].includes(ext)) {
        type = 'script-driver';
        defaultRole = 'Procedural Script Controller';
      } else if (['VFX', 'NIAGARA', 'PARTICLE'].includes(ext)) {
        type = 'vfx-particle';
        defaultRole = 'Volumetric Particle VFX';
      }

      const sizeMB = file.size / (1024 * 1024);
      const sizeStr = sizeMB >= 1 ? `${sizeMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `ext-asset-${Date.now()}-${idx}`,
        name: file.name,
        type,
        source: 'External Upload',
        format: ext,
        sizeStr,
        status: 'In Scene',
        roleInScene: defaultRole,
        assignedClipId: uploadClipTarget,
        url: URL.createObjectURL(file),
        details: `Imported external asset (${file.type || 'all formats'}). Staged into scene.`,
        transform: {
          posX: (idx * 30) - 30,
          posY: 0,
          posZ: 0,
          scale: 1.0,
          rotationY: 0
        }
      };
    });

    setSceneAssets(prev => [...newAssets, ...prev]);
    setIsAssetModalOpen(false);
    showToast(`✓ Staged ${newAssets.length} asset${newAssets.length > 1 ? 's' : ''} into scene!`);
  };

  const handleAddAppAssetToScene = (appAsset: typeof AVAILABLE_APP_ASSETS[0]) => {
    if (sceneAssets.some(a => a.name === appAsset.name && a.status === 'In Scene')) {
      showToast(`"${appAsset.name}" is already active in scene.`);
      return;
    }

    const newAsset: CinematicSceneAsset = {
      id: `app-asset-${Date.now()}`,
      name: appAsset.name,
      type: appAsset.type,
      source: 'Created in App',
      format: appAsset.format,
      sizeStr: appAsset.sizeStr,
      status: 'In Scene',
      roleInScene: appAsset.roleInScene,
      assignedClipId: activeClip.id,
      details: appAsset.description,
      transform: {
        posX: 0,
        posY: 0,
        posZ: 0,
        scale: 1.0,
        rotationY: 0
      }
    };

    setSceneAssets(prev => [newAsset, ...prev]);
    showToast(`✓ Added app asset "${appAsset.name}" into ${activeClip.name}!`);
  };

  const handleToggleAssetStatus = (id: string) => {
    setSceneAssets(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: a.status === 'In Scene' ? 'Standby' : 'In Scene' } : a
      )
    );
  };

  const handleRemoveAssetFromScene = (id: string, name?: string) => {
    setSceneAssets(prev => prev.filter(a => a.id !== id));
    showToast(`Removed ${name ? `"${name}"` : 'asset'} from scene.`);
  };

  const handleUpdateAssetRole = (id: string, role: CinematicSceneAsset['roleInScene']) => {
    setSceneAssets(prev => prev.map(a => (a.id === id ? { ...a, roleInScene: role } : a)));
  };

  const handleUpdateAssetClip = (id: string, clipId: string) => {
    setSceneAssets(prev => prev.map(a => (a.id === id ? { ...a, assignedClipId: clipId } : a)));
  };

  const handleUpdateAssetTransform = (id: string, delta: Partial<NonNullable<CinematicSceneAsset['transform']>>) => {
    setSceneAssets(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              transform: {
                posX: a.transform?.posX ?? 0,
                posY: a.transform?.posY ?? 0,
                posZ: a.transform?.posZ ?? 0,
                scale: a.transform?.scale ?? 1.0,
                rotationY: a.transform?.rotationY ?? 0,
                ...delta
              }
            }
          : a
      )
    );
  };

  // Canvas Viewport Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Calculate total sequence duration
  const totalDurationSec = clips.length > 0 ? clips[clips.length - 1].endSec : 12.0;

  // Find currently active clip based on playhead currentTimeSec
  const activeClipIndex = clips.findIndex(
    c => currentTimeSec >= c.startSec && currentTimeSec < c.endSec
  );
  const activeClip = activeClipIndex !== -1 ? clips[activeClipIndex] : clips[0] || INITIAL_CLIPS[0];

  // Currently selected clip in the editor (for detail inspection)
  const currentSelectedClip = clips.find(c => c.id === selectedClipId) || activeClip;

  // Keep section editing prompt in sync with selected clip
  useEffect(() => {
    if (currentSelectedClip) {
      setEditSectionPrompt(currentSelectedClip.prompt);
    }
  }, [currentSelectedClip?.id]);

  // Keyboard shortcut listener (Spacebar for play/pause, C for Cut)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCutClip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTimeSec, clips]);

  // ============================================================================
  // CONVERSATIONAL DIRECTOR PARSER & REAL-TIME EDITS
  // ============================================================================
  const handleSendDirectorCommand = (commandText?: string) => {
    const input = (commandText || conversationalInput).trim();
    if (!input) return;

    const lower = input.toLowerCase();
    let actionDesc = '';
    const nowStr = new Date().toLocaleTimeString();

    // 1. Cut / Split command
    if (lower.includes('cut') || lower.includes('split') || lower.includes('slice')) {
      handleCutClip();
      actionDesc = `Split sequence at playhead (${currentTimeSec.toFixed(2)}s)`;
    }
    // 2. Weather & Atmospheric lightning / rain
    else if (lower.includes('lightning') || lower.includes('storm') || lower.includes('thunder')) {
      updateActiveClipAttributes({
        rainDensityPct: 95,
        lightingPreset: 'midnight-neon',
        colorGradeLut: 'teal-orange'
      });
      actionDesc = 'Applied heavy thunderstorm with dynamic volumetric lightning strikes';
    } else if (lower.includes('rain') || lower.includes('wet')) {
      const density = lower.includes('heavy') ? 90 : lower.includes('light') ? 30 : 70;
      updateActiveClipAttributes({ rainDensityPct: density });
      actionDesc = `Set volumetric rain density to ${density}%`;
    }
    // 3. Lighting Presets
    else if (lower.includes('golden') || lower.includes('sunset') || lower.includes('warm')) {
      updateActiveClipAttributes({
        lightingPreset: 'sunset-golden',
        colorGradeLut: 'kodak-warm',
        rainDensityPct: 0
      });
      actionDesc = 'Switched to Golden Hour Sunset lighting and Kodak warm grading';
    } else if (lower.includes('cyber') || lower.includes('neon') || lower.includes('violet') || lower.includes('purple')) {
      updateActiveClipAttributes({
        lightingPreset: 'cyber-violet',
        colorGradeLut: 'cyberpunk-magenta'
      });
      actionDesc = 'Switched to Cyber Violet lighting with magenta grade';
    } else if (lower.includes('noir') || lower.includes('monochrome') || lower.includes('black and white')) {
      updateActiveClipAttributes({
        lightingPreset: 'noir-rain',
        colorGradeLut: 'noir-monochrome'
      });
      actionDesc = 'Applied Film Noir high-contrast monochrome grade with rain';
    }
    // 4. Camera Motions
    else if (lower.includes('orbit') || lower.includes('360')) {
      updateActiveClipAttributes({ cameraMotion: 'orbit-spline', dutchAngleDeg: -8 });
      actionDesc = 'Camera switched to 360° orbital wrap spline';
    } else if (lower.includes('bumper') || lower.includes('ground') || lower.includes('road')) {
      updateActiveClipAttributes({ cameraMotion: 'bumper-low', focalLengthMm: 24, dutchAngleDeg: 4 });
      actionDesc = 'Camera lowered to road-level ultra-low bumper tracking';
    } else if (lower.includes('drone') || lower.includes('chase') || lower.includes('aerial')) {
      updateActiveClipAttributes({ cameraMotion: 'drone-chase', focalLengthMm: 35, dutchAngleDeg: 14 });
      actionDesc = 'Camera switched to dynamic drone chase spline';
    } else if (lower.includes('crane') || lower.includes('overhead') || lower.includes('jib')) {
      updateActiveClipAttributes({ cameraMotion: 'crane-overhead', focalLengthMm: 50 });
      actionDesc = 'Camera raised to overhead crane sweep';
    } else if (lower.includes('handheld') || lower.includes('shaky') || lower.includes('organic')) {
      updateActiveClipAttributes({ cameraMotion: 'handheld', dutchAngleDeg: 6 });
      actionDesc = 'Camera motion set to handheld organic camera shake';
    }
    // 5. Optics / Zoom / Dutch Angle
    else if (lower.includes('zoom') || lower.includes('lens') || lower.includes('mm') || lower.includes('telephoto')) {
      const match = lower.match(/\b(18|24|35|50|85|135)\b/);
      const mm = match ? parseInt(match[1]) : lower.includes('in') ? 85 : 24;
      updateActiveClipAttributes({ focalLengthMm: mm });
      actionDesc = `Focal length adjusted to ${mm}mm cinema lens`;
    } else if (lower.includes('dutch') || lower.includes('tilt') || lower.includes('angle')) {
      const match = lower.match(/-?\d+/);
      const deg = match ? parseInt(match[0]) : 18;
      updateActiveClipAttributes({ dutchAngleDeg: deg });
      actionDesc = `Dutch angle tilt set to ${deg}°`;
    }
    // 6. Speed / Slow motion
    else if (lower.includes('slow') || lower.includes('slomo') || lower.includes('slowmo')) {
      updateActiveClipAttributes({ speed: 0.5 });
      setPlaybackSpeed(0.5);
      actionDesc = 'Set section to 0.5x cinematic slow-motion';
    } else if (lower.includes('fast') || lower.includes('hyper')) {
      updateActiveClipAttributes({ speed: 1.5 });
      setPlaybackSpeed(1.5);
      actionDesc = 'Accelerated section to 1.5x fast-motion';
    }
    // 7. General prompt rewrite for current section
    else {
      updateActiveClipAttributes({ prompt: input });
      actionDesc = `Updated section prompt: "${input.slice(0, 48)}..."`;
    }

    // Add user message & AI response to history
    setDirectorHistory(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'director',
        text: input,
        timestamp: nowStr
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: 'ai',
        text: `Understood! ${actionDesc}. Real-time viewport and sequence parameters synchronized.`,
        appliedAction: actionDesc,
        timestamp: nowStr
      }
    ]);

    setLastDirectorialAction(actionDesc);
    setConversationalInput('');
    showToast(`Director: ${actionDesc}`);
  };

  // Helper to update active or selected clip attributes
  const updateActiveClipAttributes = (partial: Partial<CinematicClip>) => {
    const targetId = currentSelectedClip ? currentSelectedClip.id : 'clip-1';
    setClips(prev =>
      prev.map(c => {
        if (c.id === targetId) {
          return { ...c, ...partial };
        }
        return c;
      })
    );
  };

  // ============================================================================
  // NON-LINEAR VIDEO EDITING OPERATIONS (Cut, Crop/Trim, Paste/Duplicate, Delete)
  // ============================================================================

  // 1. Cut / Split Clip at current playhead
  const handleCutClip = () => {
    if (clips.length === 0) return;

    // Find the clip containing currentTimeSec
    const targetIdx = clips.findIndex(
      c => currentTimeSec > c.startSec + 0.1 && currentTimeSec < c.endSec - 0.1
    );

    if (targetIdx === -1) {
      showToast('Playhead is too close to a cut point. Move playhead to split within a section.');
      return;
    }

    const clipToSplit = clips[targetIdx];
    const splitTime = currentTimeSec;

    const clipA: CinematicClip = {
      ...clipToSplit,
      endSec: splitTime,
      name: `${clipToSplit.name} (Part 1)`
    };

    const clipB: CinematicClip = {
      ...clipToSplit,
      id: `clip-${Date.now()}`,
      startSec: splitTime,
      name: `${clipToSplit.name} (Part 2)`,
      prompt: `Continuation of ${clipToSplit.prompt} with modified camera dynamics.`,
      accentColor: getNextAccentColor(clipToSplit.accentColor)
    };

    const newClips = [
      ...clips.slice(0, targetIdx),
      clipA,
      clipB,
      ...clips.slice(targetIdx + 1)
    ];

    setClips(newClips);
    setSelectedClipId(clipB.id);
    showToast(`✂️ Split clip into 2 sections at ${splitTime.toFixed(2)}s!`);
  };

  // 2. Crop / Trim Section In & Out
  const handleTrimClip = (clipId: string, newStart: number, newEnd: number) => {
    if (newEnd <= newStart + 0.5) {
      showToast('Clip duration must be at least 0.5 seconds.');
      return;
    }

    setClips(prev => {
      const idx = prev.findIndex(c => c.id === clipId);
      if (idx === -1) return prev;

      const durationChange = (newEnd - newStart) - (prev[idx].endSec - prev[idx].startSec);
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        startSec: newStart,
        endSec: newEnd
      };

      // Shift subsequent clips
      for (let i = idx + 1; i < updated.length; i++) {
        const dur = updated[i].endSec - updated[i].startSec;
        updated[i] = {
          ...updated[i],
          startSec: updated[i - 1].endSec,
          endSec: updated[i - 1].endSec + dur
        };
      }

      return updated;
    });

    showToast('Trimmed section timing!');
  };

  // 3. Paste / Duplicate Section
  const handleDuplicateClip = (clipId?: string) => {
    const target = clips.find(c => c.id === (clipId || selectedClipId)) || activeClip;
    if (!target) return;

    const duration = target.endSec - target.startSec;
    const newClip: CinematicClip = {
      ...target,
      id: `clip-${Date.now()}`,
      name: `${target.name} (Copy)`,
      startSec: target.endSec,
      endSec: target.endSec + duration,
      accentColor: getNextAccentColor(target.accentColor)
    };

    const targetIdx = clips.findIndex(c => c.id === target.id);
    const updated = [...clips];
    updated.splice(targetIdx + 1, 0, newClip);

    // Shift subsequent clips
    for (let i = targetIdx + 2; i < updated.length; i++) {
      const dur = updated[i].endSec - updated[i].startSec;
      updated[i] = {
        ...updated[i],
        startSec: updated[i - 1].endSec,
        endSec: updated[i - 1].endSec + dur
      };
    }

    setClips(updated);
    setSelectedClipId(newClip.id);
    showToast(`📋 Duplicated "${target.name}" into sequence!`);
  };

  // 4. Delete Section
  const handleDeleteClip = (clipId?: string) => {
    if (clips.length <= 1) {
      showToast('Cannot delete the only remaining shot in sequence.');
      return;
    }

    const idToDelete = clipId || selectedClipId;
    const targetIdx = clips.findIndex(c => c.id === idToDelete);
    if (targetIdx === -1) return;

    const deletedClip = clips[targetIdx];
    const duration = deletedClip.endSec - deletedClip.startSec;

    const remaining = clips.filter(c => c.id !== idToDelete);

    // Ripple shift subsequent clips backwards
    for (let i = targetIdx; i < remaining.length; i++) {
      const dur = remaining[i].endSec - remaining[i].startSec;
      remaining[i] = {
        ...remaining[i],
        startSec: i === 0 ? 0 : remaining[i - 1].endSec,
        endSec: (i === 0 ? 0 : remaining[i - 1].endSec) + dur
      };
    }

    setClips(remaining);
    if (remaining.length > 0) setSelectedClipId(remaining[Math.max(0, targetIdx - 1)].id);

    // Adjust playhead if past end
    const newTotal = remaining[remaining.length - 1].endSec;
    if (currentTimeSec > newTotal) {
      setCurrentTimeSec(Math.max(0, newTotal - 0.1));
    }

    showToast(`🗑️ Deleted "${deletedClip.name}" from timeline.`);
  };

  // 5. Edit Section Prompt Submit
  const handleSaveSectionPrompt = () => {
    if (!currentSelectedClip) return;
    setClips(prev =>
      prev.map(c =>
        c.id === currentSelectedClip.id
          ? { ...c, prompt: editSectionPrompt }
          : c
      )
    );
    setIsEditingSection(false);
    showToast(`Saved new prompt for "${currentSelectedClip.name}"!`);
  };

  const getNextAccentColor = (curr: string) => {
    const palette = ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    const idx = palette.indexOf(curr);
    return palette[(idx + 1) % palette.length];
  };

  // ============================================================================
  // 60 FPS REAL-TIME VIEWPORT RENDER LOOP
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      // Progress timeline when playing
      if (isPlaying) {
        setCurrentTimeSec(prev => {
          const next = prev + deltaSec * playbackSpeed * activeClip.speed;
          if (next >= totalDurationSec) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return totalDurationSec;
          }
          return next;
        });
      }

      // Render 3D Canvas Frame
      drawCinematicViewport(ctx, canvas.width, canvas.height, currentTimeSec, activeClip);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, isLooping, totalDurationSec, activeClip, showRuleOfThirds, bloomIntensity]);

  // Viewport Drawing Function
  const drawCinematicViewport = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    clip: CinematicClip
  ) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Dutch angle tilt & camera shake
    ctx.translate(width / 2, height / 2);
    let tiltRad = (clip.dutchAngleDeg * Math.PI) / 180;
    if (clip.cameraMotion === 'handheld') {
      tiltRad += Math.sin(time * 8) * 0.02 + Math.cos(time * 5) * 0.015;
    }
    ctx.rotate(tiltRad);
    ctx.translate(-width / 2, -height / 2);

    // 1. Sky / Background Gradient based on lighting preset
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (clip.lightingPreset === 'sunset-golden') {
      skyGrad.addColorStop(0, '#1c0a00');
      skyGrad.addColorStop(0.4, '#5e2504');
      skyGrad.addColorStop(0.7, '#d97706');
      skyGrad.addColorStop(1, '#1e1b4b');
    } else if (clip.lightingPreset === 'cyber-violet') {
      skyGrad.addColorStop(0, '#0a0014');
      skyGrad.addColorStop(0.5, '#2e1065');
      skyGrad.addColorStop(0.8, '#701a75');
      skyGrad.addColorStop(1, '#020617');
    } else if (clip.lightingPreset === 'noir-rain') {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.6, '#0f172a');
      skyGrad.addColorStop(1, '#020617');
    } else {
      // midnight-neon
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.5, '#082f49');
      skyGrad.addColorStop(0.85, '#0f172a');
      skyGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Distant City Skyline Silhouettes with Neon Glows
    const horizonY = height * 0.52;
    ctx.fillStyle = '#050811';
    for (let i = 0; i < 18; i++) {
      const bWidth = 35 + (i * 17) % 45;
      const bHeight = 70 + ((i * 31) % 90);
      const bX = (i * 45 - (time * 12) % 45) % width;
      ctx.fillRect(bX, horizonY - bHeight, bWidth, bHeight);

      // Random lit windows
      ctx.fillStyle = (i % 2 === 0) ? '#38bdf8' : '#ec4899';
      for (let wy = horizonY - bHeight + 10; wy < horizonY - 10; wy += 14) {
        if ((wy + i) % 3 === 0) {
          ctx.fillRect(bX + 6, wy, 4, 6);
          ctx.fillRect(bX + bWidth - 10, wy, 4, 6);
        }
      }
      ctx.fillStyle = '#050811';
    }

    // 3. Ground / Wet Asphalt Road Surface
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    groundGrad.addColorStop(0, '#090d16');
    groundGrad.addColorStop(0.3, '#0b1120');
    groundGrad.addColorStop(1, '#020617');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    // 4. Perspective Highway Road Lines (Streaming towards camera at 60 FPS)
    const centerX = width / 2;
    const roadSpeed = time * 24;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;

    // Road Edge Curbs with Neon Glow
    ctx.beginPath();
    ctx.moveTo(centerX - 40, horizonY);
    ctx.lineTo(0, height);
    ctx.moveTo(centerX + 40, horizonY);
    ctx.lineTo(width, height);
    ctx.stroke();

    // Center Dashed Lane Markings
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    const numDashes = 10;
    for (let d = 0; d < numDashes; d++) {
      const p = ((d / numDashes) + (roadSpeed % 1)) % 1;
      const y = horizonY + Math.pow(p, 2.2) * (height - horizonY);
      const nextY = horizonY + Math.pow(Math.min(1, p + 0.05), 2.2) * (height - horizonY);
      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.lineTo(centerX, nextY);
      ctx.stroke();
    }

    // 5. Stylized Hero Vehicle / Camera Focus Object
    const carY = horizonY + (height - horizonY) * 0.65;
    let carOffset = Math.sin(time * 3) * 60;
    if (clip.cameraMotion === 'bumper-low') {
      carOffset = 0;
    } else if (clip.cameraMotion === 'orbit-spline') {
      carOffset = Math.cos(time * 2) * 120;
    }

    const heroX = centerX + carOffset;
    // Tail-lights / Headlights Glow
    const glowColor = clip.lightingPreset === 'sunset-golden' ? '#f59e0b' : '#ef4444';
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 24;
    ctx.fillStyle = glowColor;

    // Car silhouette
    ctx.beginPath();
    ctx.roundRect(heroX - 55, carY - 24, 110, 40, [8, 8, 4, 4]);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bright Neon Tail-light bars
    ctx.fillStyle = glowColor;
    ctx.fillRect(heroX - 48, carY - 6, 32, 7);
    ctx.fillRect(heroX + 16, carY - 6, 32, 7);

    // Wet Road Light Reflection
    ctx.fillStyle = glowColor;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(heroX - 48, carY + 18, 32, 50);
    ctx.fillRect(heroX + 16, carY + 18, 32, 50);
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    // 6. Volumetric Rain Particles (Rain density slider)
    if (clip.rainDensityPct > 0) {
      const dropCount = Math.floor((clip.rainDensityPct / 100) * 160);
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = 1;
      for (let r = 0; r < dropCount; r++) {
        const rx = ((r * 37 + time * 480) % width);
        const ry = ((r * 89 + time * 920) % height);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 3, ry + 16);
        ctx.stroke();
      }
    }

    // 7. Anamorphic Lens Flare Bar (Focal length & bloom)
    if (bloomIntensity > 30) {
      const flareGrad = ctx.createLinearGradient(0, carY, width, carY);
      flareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      flareGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.15)');
      flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
      flareGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
      flareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, carY - 2, width, 4);
    }

    // 8. Rule-of-Thirds Grid Overlay (Toggleable)
    if (showRuleOfThirds) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical 1/3 lines
      ctx.beginPath();
      ctx.moveTo(width / 3, 0);
      ctx.lineTo(width / 3, height);
      ctx.moveTo((width * 2) / 3, 0);
      ctx.lineTo((width * 2) / 3, height);

      // Horizontal 1/3 lines
      ctx.moveTo(0, height / 3);
      ctx.lineTo(width, height / 3);
      ctx.moveTo(0, (height * 2) / 3);
      ctx.lineTo(width, (height * 2) / 3);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center crosshair
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX, height / 2, 8, 0, Math.PI * 2);
      ctx.moveTo(centerX - 14, height / 2);
      ctx.lineTo(centerX + 14, height / 2);
      ctx.moveTo(centerX, height / 2 - 14);
      ctx.lineTo(centerX, height / 2 + 14);
      ctx.stroke();
    }

    // 9. Active Staged Scene Assets in 3D Space (Actors, Props, Holograms)
    const activeStagedAssets = sceneAssets.filter(
      a => a.status === 'In Scene' && (a.assignedClipId === 'global' || a.assignedClipId === clip.id)
    );

    const staged3DMeshes = activeStagedAssets.filter(
      a => a.type === '3d-mesh' || a.roleInScene === '3D Actor / Hero Prop'
    );

    staged3DMeshes.forEach((mesh, idx) => {
      if (mesh.id === 'asset-1') return; // Default car already drawn as primary hero
      const customX = centerX + (mesh.transform?.posX || (idx % 2 === 0 ? 115 : -115));
      const customY = carY - 20 + (mesh.transform?.posY || 0);
      const scale = mesh.transform?.scale || 1.0;

      ctx.save();
      ctx.strokeStyle = idx % 2 === 0 ? '#38bdf8' : '#a855f7';
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);

      // 3D holographic wireframe proxy
      ctx.beginPath();
      ctx.strokeRect(customX - 32 * scale, customY - 18 * scale, 64 * scale, 36 * scale);
      ctx.fillRect(customX - 32 * scale, customY - 18 * scale, 64 * scale, 36 * scale);

      // Wireframe depth diagonals
      ctx.beginPath();
      ctx.moveTo(customX - 32 * scale, customY - 18 * scale);
      ctx.lineTo(customX - 22 * scale, customY - 28 * scale);
      ctx.lineTo(customX + 42 * scale, customY - 28 * scale);
      ctx.lineTo(customX + 32 * scale, customY - 18 * scale);
      ctx.stroke();

      // Label floating over asset
      ctx.setLineDash([]);
      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#c084fc';
      ctx.textAlign = 'center';
      ctx.fillText(`📦 ${mesh.name} [${mesh.format}]`, customX, customY - 32 * scale);
      ctx.restore();
    });

    // 10. On-Screen Director HUD (Timecode, active shot ID, section prompt preview)
    ctx.restore(); // Restore pre-tilt coordinates for HUD

    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(12, 12, 340, 68);
    ctx.strokeStyle = clip.accentColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, 340, 68);

    // HUD Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`REC [60 FPS] • TC 00:00:${Math.floor(time).toString().padStart(2, '0')}:${Math.floor((time % 1) * 60).toString().padStart(2, '0')}`, 20, 28);

    ctx.fillStyle = clip.accentColor;
    ctx.fillText(`${clip.name.toUpperCase()} (${clip.startSec.toFixed(1)}s - ${clip.endSec.toFixed(1)}s)`, 20, 44);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    const truncatedPrompt = clip.prompt.length > 50 ? clip.prompt.slice(0, 50) + '...' : clip.prompt;
    ctx.fillText(`"${truncatedPrompt}"`, 20, 60);

    // Live Staged Asset Floating Badge in Viewport (Audio / VFX)
    const activeAudioTracks = activeStagedAssets.filter(
      a => a.type === 'audio-track' || a.roleInScene === 'BGM / Audio Track'
    );
    if (activeAudioTracks.length > 0) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width - 400, 12, 200, 30, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#c084fc';
      ctx.textAlign = 'left';
      ctx.fillText(`🎵 ${activeAudioTracks[0].name.slice(0, 16)}...`, width - 392, 26);

      // Mini EQ bars
      for (let b = 0; b < 5; b++) {
        const barH = Math.sin(time * 9 + b) * 5 + 6;
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(width - 240 + b * 6, 32 - barH, 3.5, barH);
      }
    }

    // Lens & Cam info top right
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(width - 190, 12, 178, 48);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(width - 190, 12, 178, 48);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText(`CAM: ${clip.cameraMotion.toUpperCase()}`, width - 180, 28);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`LENS: ${clip.focalLengthMm}mm f/${clip.apertureFStop} • ${clip.dutchAngleDeg}°`, width - 180, 44);
  };

  // ============================================================================
  // CODE EXPORTS FOR UNREAL 5.5 & BLENDER 4.2
  // ============================================================================
  const generateUnrealCode = () => {
    return `# ==============================================================================
# Dev Studio AI - Unreal Engine 5.5 Automated Level Sequence & Multi-Shot Director
# Generated: ${new Date().toISOString()}
# ==============================================================================
import unreal

def build_cinematic_sequence():
    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    factory = unreal.LevelSequenceFactoryNew()
    
    sequence_path = "/Game/Cinematics"
    sequence_name = "LS_DevStudio_DirectorSequence"
    
    sequence = asset_tools.create_asset(
        sequence_name, sequence_path, unreal.LevelSequence, factory
    )
    
    # Set Framerate & Total Range
    sequence.set_display_rate(unreal.FrameRate(numerator=60, denominator=1))
    total_frames = int(${Math.round(totalDurationSec * 60)})
    sequence.set_playback_start(0)
    sequence.set_playback_end(total_frames)
    
    print(f"[Dev Studio AI] LevelSequence initialized with ${clips.length} shot cuts:")
${clips.map((c, i) => `
    # --- SHOT ${i + 1}: ${c.name} (${c.startSec}s - ${c.endSec}s) ---
    # Prompt: "${c.prompt}"
    # Lens: ${c.focalLengthMm}mm, f/${c.apertureFStop}, Motion: ${c.cameraMotion}
    cam_${i} = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.CineCameraActor, unreal.Vector(0, ${i * -300}, 140)
    )
    cam_${i}.set_actor_label("${c.name}")
    cam_comp_${i} = cam_${i}.get_cine_camera_component()
    cam_comp_${i}.current_focal_length = ${c.focalLengthMm}
    cam_comp_${i}.current_aperture = ${c.apertureFStop}
`).join('')}

    # ==============================================================================
    # Staged Scene Assets & Actors (Imported / App Created)
    # ==============================================================================
${sceneAssets.filter(a => a.status === 'In Scene').map((asset, idx) => `
    # Staged Asset #${idx + 1}: ${asset.name} (${asset.format}) - Role: ${asset.roleInScene}
    # Source: ${asset.source} - Clip Assignment: ${asset.assignedClipId}
    asset_actor_${idx} = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.StaticMeshActor, unreal.Vector(${asset.transform?.posX || 0} * 10, ${asset.transform?.posY || 0} * 10, 50)
    )
    asset_actor_${idx}.set_actor_label("${asset.name.replace(/[^a-zA-Z0-9_-]/g, '_')}")
    asset_actor_${idx}.set_actor_scale3d(unreal.Vector(${asset.transform?.scale || 1.0}, ${asset.transform?.scale || 1.0}, ${asset.transform?.scale || 1.0}))
`).join('')}

    print("[Dev Studio AI] Sequence successfully bound to CineCameraActors with ${sceneAssets.filter(a => a.status === 'In Scene').length} staged assets!")

build_cinematic_sequence()
`;
  };

  const generateBlenderCode = () => {
    return `# ==============================================================================
# Dev Studio AI - Blender 4.2 Multi-Shot Camera Rig & Keyframe Timeline
# ==============================================================================
import bpy, math

# Setup Scene Dimensions & Framerate
bpy.context.scene.render.fps = 60
bpy.context.scene.frame_start = 0
bpy.context.scene.frame_end = int(${Math.round(totalDurationSec * 60)})

# Create timeline markers for each cut section:
${clips.map((c) => `
bpy.context.scene.timeline_markers.new(
    "${c.name.replace(/"/g, '')}",
    frame=int(${Math.round(c.startSec * 60)})
)
`).join('')}

# Create Primary Cine Camera
cam_data = bpy.data.cameras.new("DevStudio_DirectorCam")
cam_data.lens = ${activeClip.focalLengthMm}
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = ${activeClip.apertureFStop}

cam_obj = bpy.data.objects.new("DevStudio_DirectorCam", cam_data)
bpy.context.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

# Staged Scene Assets & Props:
${sceneAssets.filter(a => a.status === 'In Scene').map((asset, idx) => `
# Asset: ${asset.name} [${asset.format}] - Role: ${asset.roleInScene}
prop_${idx} = bpy.data.objects.new("${asset.name.replace(/"/g, '')}", None)
prop_${idx}.location = (${(asset.transform?.posX || 0) / 50}, ${(asset.transform?.posY || 0) / 50}, 0)
prop_${idx}.scale = (${asset.transform?.scale || 1}, ${asset.transform?.scale || 1}, ${asset.transform?.scale || 1})
bpy.context.collection.objects.link(prop_${idx})
`).join('')}

print("[Dev Studio AI] Blender 4.2 Cinematic Scene with ${clips.length} shot sections and ${sceneAssets.filter(a => a.status === 'In Scene').length} staged assets generated.")
`;
  };

  const generateSceneManifestJson = () => {
    return JSON.stringify(
      {
        schema: 'DevStudio_Cinematic_Manifest_v2',
        title: 'Cinematic Sequence - Multi-Shot Director',
        totalDurationSeconds: totalDurationSec,
        framerate: 60,
        aspectRatio: activeClip.cropRatio,
        clipsCount: clips.length,
        clips: clips.map(c => ({
          id: c.id,
          name: c.name,
          startSec: c.startSec,
          endSec: c.endSec,
          durationSec: c.endSec - c.startSec,
          prompt: c.prompt,
          cameraMotion: c.cameraMotion,
          lensMm: c.focalLengthMm,
          fStop: c.apertureFStop,
          dutchAngleDeg: c.dutchAngleDeg,
          lightingPreset: c.lightingPreset,
          rainDensityPct: c.rainDensityPct,
          colorGradeLut: c.colorGradeLut,
          cropRatio: c.cropRatio,
          speed: c.speed
        })),
        sceneAssets: sceneAssets.map(a => ({
          id: a.id,
          name: a.name,
          type: a.type,
          source: a.source,
          format: a.format,
          sizeStr: a.sizeStr,
          status: a.status,
          roleInScene: a.roleInScene,
          assignedClipId: a.assignedClipId,
          transform: a.transform
        }))
      },
      null,
      2
    );
  };

  const copyCode = (type: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeType(type);
    showToast(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedCodeType(null), 2500);
  };

  return (
    <div className={`h-full w-full flex flex-col overflow-y-auto ${
      themeMode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#090b10] text-slate-100'
    }`}>
      {/* 1. Header Bar with Virtual Production status & Quick Engine Bridges */}
      <div className={`p-4 sm:p-6 border-b transition-colors ${
        themeMode === 'light' ? 'border-slate-200 bg-white' : 'border-white/10 bg-[#0e121b]'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Virtual Production & NLE Sequencer
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                60 FPS Real-Time Canvas Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-cyan-400" />
              <span>Cinematics & Direction Studio</span>
            </h1>
            <p className="text-xs opacity-75 mt-0.5 max-w-2xl">
              Direct and edit scene cuts in real time. Use the conversational director prompt bar, pause, cut, crop, paste, delete, or re-prompt any section on the fly.
            </p>
          </div>

          {/* Quick Engine Actions & Asset Hub */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAssetModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-emerald-600/25 transition-all"
              title="Add 3D Models, BGM, Audio Takes, or Upload any file into the Scene"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Asset to Scene</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/35 font-mono font-bold">
                {sceneAssets.filter(a => a.status === 'In Scene').length} Active
              </span>
            </button>
            <button
              onClick={() => onPushToUnreal('LS_DevStudio_DirectorSequence.py', generateUnrealCode(), 'python')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-indigo-600/20 transition-all"
              title="Push Level Sequence directly to local Unreal Engine 5.5 bridge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Push to Unreal 5.5</span>
            </button>
            <button
              onClick={() => {
                triggerFileDownload('unreal_director_sequence.py', generateUnrealCode(), 'text/x-python');
                showToast('Downloaded unreal_director_sequence.py');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer border border-white/10 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .py</span>
            </button>
            <button
              onClick={() => {
                triggerFileDownload('cinematic_manifest.json', generateSceneManifestJson(), 'application/json');
                showToast('Downloaded cinematic_manifest.json');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs cursor-pointer border border-cyan-500/40 transition-all"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Manifest JSON</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-5">
        {/* ==================================================================== */}
        {/* 2. CONVERSATIONAL DIRECTOR PROMPT BAR (REAL-TIME EDITS) */}
        {/* ==================================================================== */}
        <div className={`p-4 rounded-2xl border transition-all ${
          themeMode === 'light'
            ? 'bg-white border-slate-300 shadow-md'
            : 'bg-[#10141f] border-cyan-500/30 shadow-xl shadow-cyan-950/20'
        }`}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                Director Conversation Bar
                <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Real-Time Directing
                </span>
              </span>
            </div>

            <button
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="text-[11px] font-medium text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({directorHistory.length})</span>
              {showHistoryDrawer ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Conversation Input Form */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={conversationalInput}
                onChange={(e) => setConversationalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendDirectorCommand();
                  }
                }}
                placeholder="Direct scene in real time (e.g. 'Add dramatic lightning', 'Cut clip here and make it golden hour sunset', 'Zoom in 85mm lens with 25° Dutch angle')..."
                className={`w-full py-3 pl-4 pr-10 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                }`}
              />
              <button
                type="button"
                onClick={() => handleSendDirectorCommand()}
                className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white shadow-sm transition-all cursor-pointer"
                title="Send Command (Enter)"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleSendDirectorCommand()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Direction</span>
            </button>
          </div>

          {/* Quick Command Pills for 1-Click Real-Time Tweaks */}
          <div className="flex items-center gap-1.5 pt-2.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Direct:</span>
            {[
              { label: '⚡ Add Lightning & Rain', cmd: 'Add dramatic thunderstorm with volumetric lightning strikes' },
              { label: '🌅 Golden Hour Sunset', cmd: 'Switch lighting to golden hour sunset with warm Kodak LUT' },
              { label: '🎥 360° Hero Orbit', cmd: 'Switch camera motion to 360 orbital wrap' },
              { label: '🏎️ Low Bumper Drift', cmd: 'Camera motion to low bumper with ground reflections' },
              { label: '⏱️ Slow-Mo 0.5x', cmd: 'Slow down section to 0.5x speed' },
              { label: '✂️ Cut at Playhead', cmd: 'Cut clip at playhead' },
              { label: '🔍 Zoom In (85mm)', cmd: 'Zoom in with 85mm cinema lens' },
              { label: '🌧️ Film Noir Rain', cmd: 'Switch to film noir high-contrast monochrome with rain' }
            ].map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendDirectorCommand(pill.cmd)}
                className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-100 hover:bg-cyan-50 border-slate-200 text-slate-700 hover:text-cyan-700'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-white/10 text-cyan-300 hover:border-cyan-500/40'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Collapsible History Drawer */}
          {showHistoryDrawer && (
            <div className={`mt-3 pt-3 border-t max-h-48 overflow-y-auto space-y-2 text-xs font-mono ${
              themeMode === 'light' ? 'border-slate-200' : 'border-slate-800'
            }`}>
              {directorHistory.map(msg => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg flex items-start gap-2 ${
                    msg.sender === 'director'
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <span className="font-bold shrink-0">{msg.sender === 'director' ? 'DIRECTOR:' : 'AI:'}</span>
                  <p className="flex-1 text-[11px] leading-relaxed">{msg.text}</p>
                  <span className="text-[10px] opacity-50 shrink-0">{msg.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 3. 60 FPS CINEMATIC VIEWPORT */}
        {/* ==================================================================== */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
          themeMode === 'light' ? 'bg-white border-slate-300 shadow-sm' : 'bg-[#10141e] border-white/10 shadow-xl'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-sm text-cyan-400">Cinematic Viewport</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                {activeClip.cropRatio} Widescreen
              </span>
              <span className="text-[11px] opacity-70">
                {currentTimeSec.toFixed(2)}s / {totalDurationSec.toFixed(1)}s
              </span>
              {lastDirectorialAction && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] truncate max-w-xs">
                  Active: {lastDirectorialAction}
                </span>
              )}
            </div>

            {/* Viewport Overlay Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  showRuleOfThirds ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'opacity-60 border-white/10'
                }`}
                title="Toggle Rule of Thirds and Center Target Grid"
              >
                Rule of 3rds
              </button>

              {/* Crop Aspect Ratio Selector */}
              <div className="flex border border-white/10 rounded-lg p-0.5 text-[11px]">
                {(['2.39:1', '16:9', '4:3', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => updateActiveClipAttributes({ cropRatio: ratio })}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                      activeClip.cropRatio === ratio ? 'bg-cyan-600 text-white font-bold' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-Time Canvas Viewport */}
          <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black shadow-2xl">
            <canvas
              ref={canvasRef}
              width={854}
              height={480}
              className="w-full h-80 sm:h-96 block cursor-crosshair object-cover"
              title="Real-Time 60 FPS Cinematic Viewport"
            />

            {/* Interactive Playhead Scrubber Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                setCurrentTimeSec(pct * totalDurationSec);
              }}
              className="relative h-3 w-full bg-slate-900 cursor-pointer overflow-hidden border-t border-white/10 group"
              title="Click or drag to scrub playhead"
            >
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 relative transition-all duration-75"
                style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_12px_white]" />
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 4. TRANSPORT & NON-LINEAR EDITING TOOLBAR (CUT, CROP, PASTE, DELETE, EDIT PROMPT) */}
          {/* ==================================================================== */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            {/* Play, Pause, Rewind, Loop Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-cyan-600/30 transition-all"
                title="Toggle Play / Pause (Spacebar)"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Cinematic'}</span>
              </button>

              <button
                onClick={() => setCurrentTimeSec(0)}
                className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 font-semibold cursor-pointer text-xs"
                title="Rewind to Beginning (0:00)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  isLooping ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300' : 'opacity-60 border-white/10'
                }`}
              >
                {isLooping ? '✓ Loop' : 'Loop Off'}
              </button>

              {/* Playback speed */}
              <div className="flex items-center gap-1 font-mono text-[11px] opacity-80 ml-1">
                <span>Speed:</span>
                {[0.5, 1.0, 1.5].map(spd => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      playbackSpeed === spd ? 'bg-white/20 font-bold text-cyan-300' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* VIDEO EDITING TOOLS (CUT, CROP, PASTE, DELETE, EDIT PROMPT) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* CUT / SPLIT BUTTON */}
              <button
                onClick={handleCutClip}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Cut / Split clip at playhead position (Shortcut: C)"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Cut (Split)</span>
              </button>

              {/* DUPLICATE / PASTE BUTTON */}
              <button
                onClick={() => handleDuplicateClip(selectedClipId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Duplicate / Paste selected clip into sequence"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate / Paste</span>
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDeleteClip(selectedClipId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Delete selected section from timeline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              {/* EDIT SECTION PROMPT BUTTON */}
              <button
                onClick={() => setIsEditingSection(!isEditingSection)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  isEditingSection
                    ? 'bg-cyan-500 text-white'
                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                }`}
                title="Edit custom prompt and parameters for this section"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Section Prompt</span>
              </button>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* 5. INTERACTIVE MULTI-SHOT TIMELINE TRACK (VISUAL CLIPS) */}
          {/* ==================================================================== */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-[11px] font-mono opacity-70">
              <span>Timeline Sequence ({clips.length} Sections • Total: {totalDurationSec.toFixed(1)}s)</span>
              <span>Click section block to select or jump playhead</span>
            </div>

            {/* Timeline Clip Blocks Row */}
            <div className="relative w-full h-14 rounded-xl bg-slate-950 p-1 flex items-center gap-1 border border-white/10 overflow-hidden shadow-inner">
              {clips.map((clip, idx) => {
                const clipDur = clip.endSec - clip.startSec;
                const widthPct = (clipDur / totalDurationSec) * 100;
                const isCurrentActive = clip.id === activeClip.id;
                const isSelected = clip.id === selectedClipId;

                return (
                  <div
                    key={clip.id}
                    onClick={() => {
                      setSelectedClipId(clip.id);
                      setCurrentTimeSec(clip.startSec);
                    }}
                    style={{
                      width: `${widthPct}%`,
                      borderLeftColor: clip.accentColor
                    }}
                    className={`h-full rounded-lg p-1.5 border-l-4 flex flex-col justify-between transition-all cursor-pointer select-none group relative overflow-hidden ${
                      isCurrentActive
                        ? 'bg-slate-800/90 ring-2 ring-cyan-400 shadow-md'
                        : isSelected
                        ? 'bg-slate-800/60 ring-1 ring-white/40'
                        : 'bg-slate-900/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold truncate text-white">
                        {clip.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {clipDur.toFixed(1)}s
                      </span>
                    </div>

                    <p className="text-[9px] text-slate-400 truncate font-mono">
                      {clip.cameraMotion} • {clip.focalLengthMm}mm
                    </p>

                    {/* Active Playhead indicator bar */}
                    {isCurrentActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                    )}
                  </div>
                );
              })}

              {/* Real-time Playhead Vertical Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 pointer-events-none shadow-[0_0_8px_#f43f5e] z-10"
                style={{ left: `${(currentTimeSec / totalDurationSec) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 6. SECTION RE-PROMPTING & PARAMETERS INSPECTOR */}
        {/* ==================================================================== */}
        {isEditingSection && currentSelectedClip && (
          <div className={`p-5 rounded-2xl border space-y-4 animate-in fade-in duration-200 ${
            themeMode === 'light' ? 'bg-white border-cyan-400 shadow-lg' : 'bg-[#101426] border-cyan-500/40 shadow-2xl'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  Section Re-Prompting Engine
                </span>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-cyan-400" />
                  <span>Edit Specific Prompt for: {currentSelectedClip.name}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                  Time: {currentSelectedClip.startSec.toFixed(2)}s – {currentSelectedClip.endSec.toFixed(2)}s
                </span>
                <button
                  onClick={() => setIsEditingSection(false)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Prompt Editor for This Specific Section */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Section Prompt Description (Directs this clip in real time)
              </label>
              <textarea
                rows={3}
                value={editSectionPrompt}
                onChange={(e) => setEditSectionPrompt(e.target.value)}
                placeholder="Enter new prompt for this section (e.g., 'Volumetric lightning illuminates neon puddle as camera zooms into front bumper with heavy motion blur')..."
                className={`w-full p-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  themeMode === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            {/* Section Parameters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Section Camera Motion */}
              <div>
                <label className="font-semibold block mb-1 text-slate-400">Section Camera Motion</label>
                <select
                  value={currentSelectedClip.cameraMotion}
                  onChange={(e) => updateActiveClipAttributes({ cameraMotion: e.target.value as any })}
                  className={`w-full p-2 rounded-xl border text-xs font-mono ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700 text-cyan-300'
                  }`}
                >
                  <option value="bumper-low">Ultra-Low Bumper Road Level</option>
                  <option value="drone-chase">Drone High-Speed Chase</option>
                  <option value="orbit-spline">360° Orbital Hero Wrap</option>
                  <option value="crane-overhead">Overhead Crane Sweep</option>
                  <option value="handheld">Organic Handheld Shake</option>
                </select>
              </div>

              {/* Section Focal Length */}
              <div>
                <div className="flex justify-between font-mono mb-1 text-slate-400">
                  <span>Lens Focal Length</span>
                  <span className="font-bold text-cyan-400">{currentSelectedClip.focalLengthMm}mm</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={135}
                  value={currentSelectedClip.focalLengthMm}
                  onChange={(e) => updateActiveClipAttributes({ focalLengthMm: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Section Lighting */}
              <div>
                <label className="font-semibold block mb-1 text-slate-400">Section Lighting Preset</label>
                <select
                  value={currentSelectedClip.lightingPreset}
                  onChange={(e) => updateActiveClipAttributes({ lightingPreset: e.target.value as any })}
                  className={`w-full p-2 rounded-xl border text-xs font-mono ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700 text-cyan-300'
                  }`}
                >
                  <option value="midnight-neon">Midnight Neo-Tokyo Neon</option>
                  <option value="sunset-golden">Golden Hour Coastal Sunset</option>
                  <option value="cyber-violet">Cyber Violet Anamorphic</option>
                  <option value="noir-rain">Film Noir Rain & Alley</option>
                  <option value="studio-key">Virtual Production Stage</option>
                </select>
              </div>

              {/* Section Speed */}
              <div>
                <label className="font-semibold block mb-1 text-slate-400">Section Speed Rate</label>
                <select
                  value={currentSelectedClip.speed}
                  onChange={(e) => updateActiveClipAttributes({ speed: Number(e.target.value) })}
                  className={`w-full p-2 rounded-xl border text-xs font-mono ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700 text-cyan-300'
                  }`}
                >
                  <option value={0.25}>0.25x Ultra Slow-Mo</option>
                  <option value={0.5}>0.5x Cinematic Slow-Mo</option>
                  <option value={1.0}>1.0x Real-Time Speed</option>
                  <option value={1.5}>1.5x Dynamic Fast Motion</option>
                  <option value={2.0}>2.0x Hyper-Speed</option>
                </select>
              </div>
            </div>

            {/* Save & Apply Button */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleSaveSectionPrompt}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Apply Section Prompt</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 6.5 SCENE ASSETS & STAGING HUB (APP CREATED & EXTERNAL SOURCES)     */}
        {/* ==================================================================== */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          themeMode === 'light' ? 'bg-white border-slate-300 shadow-sm' : 'bg-[#10141e] border-white/10'
        }`}>
          {/* Hub Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold">Scene Assets & Staging Hub</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {sceneAssets.filter(a => a.status === 'In Scene').length} In Scene / {sceneAssets.length} Staged
                  </span>
                </div>
                <p className="text-xs opacity-70">
                  Bind 3D models, audio tracks, skyboxes, and scripts from the app or outside sources directly into the cinematic scene.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={fileInputAssetRef}
                type="file"
                multiple
                accept="*/*"
                className="hidden"
                onChange={handleAddExternalFiles}
              />
              <button
                onClick={() => fileInputAssetRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs cursor-pointer transition-all"
                title="Upload any file format (*/*) from your local computer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Outside File (*/*)</span>
              </button>
              <button
                onClick={() => setIsAssetModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-emerald-600/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Asset to Scene</span>
              </button>
              <button
                onClick={() => setIsAssetPanelExpanded(!isAssetPanelExpanded)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-all"
                title={isAssetPanelExpanded ? 'Collapse Staging Hub' : 'Expand Staging Hub'}
              >
                {isAssetPanelExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Staged Assets List */}
          {isAssetPanelExpanded && (
            <div className="mt-4 space-y-3">
              {sceneAssets.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-xs opacity-60">
                  No assets currently staged. Click "Add Asset to Scene" to import from MusicGen, Voice Studio, Vault, or upload your own files!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sceneAssets.map((asset) => {
                    const isInScene = asset.status === 'In Scene';
                    const is3D = asset.type === '3d-mesh' || asset.roleInScene === '3D Actor / Hero Prop';
                    const isAudio = asset.type === 'audio-track' || asset.roleInScene === 'BGM / Audio Track';

                    return (
                      <div
                        key={asset.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isInScene
                            ? themeMode === 'light'
                              ? 'bg-slate-50 border-emerald-300/80 shadow-sm'
                              : 'bg-emerald-950/15 border-emerald-500/30'
                            : themeMode === 'light'
                            ? 'bg-white border-slate-200 opacity-60'
                            : 'bg-slate-900/50 border-white/5 opacity-60'
                        }`}
                      >
                        {/* Top row: Icon, Name, Format, Source */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              is3D
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : isAudio
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {is3D ? <Box className="w-4 h-4" /> : isAudio ? <Music className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs truncate">{asset.name}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-white/10 text-slate-300">
                                  {asset.format}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] opacity-70">
                                <span>{asset.source}</span>
                                <span>•</span>
                                <span>{asset.sizeStr}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Toggle In/Out of Scene */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleToggleAssetStatus(asset.id)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                                isInScene
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                              }`}
                              title={isInScene ? 'Disable in active viewport' : 'Activate in scene viewport'}
                            >
                              {isInScene ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                              <span>{isInScene ? 'In Scene' : 'Staged'}</span>
                            </button>
                            <button
                              onClick={() => handleRemoveAssetFromScene(asset.id)}
                              className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer transition-all"
                              title="Remove from staging list"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Controls row: Role & Shot Binding */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <label className="text-[10px] opacity-70 font-semibold block mb-0.5">Scene Role</label>
                            <select
                              value={asset.roleInScene}
                              onChange={(e) => handleUpdateAssetRole(asset.id, e.target.value as any)}
                              className={`w-full p-1.5 rounded-lg border text-[11px] font-medium cursor-pointer ${
                                themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-slate-900 border-white/10 text-slate-200'
                              }`}
                            >
                              <option value="3D Actor / Hero Prop">3D Actor / Hero Prop</option>
                              <option value="Camera Plate / Skybox">Camera Plate / Skybox</option>
                              <option value="BGM / Audio Track">BGM / Audio Track</option>
                              <option value="Volumetric Particle VFX">Volumetric Particle VFX</option>
                              <option value="Procedural Script Controller">Procedural Script Controller</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] opacity-70 font-semibold block mb-0.5">Shot Assignment</label>
                            <select
                              value={asset.assignedClipId}
                              onChange={(e) => handleUpdateAssetClip(asset.id, e.target.value)}
                              className={`w-full p-1.5 rounded-lg border text-[11px] font-medium cursor-pointer ${
                                themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-slate-900 border-white/10 text-slate-200'
                              }`}
                            >
                              <option value="global">All Shots (Global Sequence)</option>
                              {clips.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* 3D Transform mini-sliders if 3D */}
                        {is3D && asset.transform && (
                          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between gap-3 text-[10px] font-mono">
                            <span className="opacity-70 flex items-center gap-1">
                              <Move className="w-3 h-3 text-cyan-400" />
                              <span>Transform:</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1">
                                <span className="opacity-60">X:</span>
                                <input
                                  type="number"
                                  value={asset.transform.posX}
                                  onChange={(e) => handleUpdateAssetTransform(asset.id, { posX: Number(e.target.value) })}
                                  className="w-14 px-1.5 py-0.5 rounded bg-black/30 border border-white/10 text-center"
                                />
                              </label>
                              <label className="flex items-center gap-1">
                                <span className="opacity-60">Y:</span>
                                <input
                                  type="number"
                                  value={asset.transform.posY}
                                  onChange={(e) => handleUpdateAssetTransform(asset.id, { posY: Number(e.target.value) })}
                                  className="w-14 px-1.5 py-0.5 rounded bg-black/30 border border-white/10 text-center"
                                />
                              </label>
                              <label className="flex items-center gap-1">
                                <span className="opacity-60">Scale:</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  max="5.0"
                                  value={asset.transform.scale}
                                  onChange={(e) => handleUpdateAssetTransform(asset.id, { scale: Number(e.target.value) })}
                                  className="w-12 px-1 py-0.5 rounded bg-black/30 border border-white/10 text-center"
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* ADD ASSET TO SCENE MODAL (APP CREATED & EXTERNAL SOURCES)            */}
        {/* ==================================================================== */}
        {isAssetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
              themeMode === 'light' ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0f1420] border-cyan-500/30 text-slate-100'
            }`}>
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Add Asset to Cinematic Scene</h3>
                    <p className="text-xs opacity-70">Import assets generated in the studio or upload any outside file</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssetModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Switcher */}
              <div className="flex border-b border-white/10 px-4 pt-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setAssetModalTab('app-created')}
                  className={`px-4 py-2 border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
                    assetModalTab === 'app-created'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Created by App ({AVAILABLE_APP_ASSETS.length})</span>
                </button>
                <button
                  onClick={() => setAssetModalTab('outside-source')}
                  className={`px-4 py-2 border-b-2 cursor-pointer transition-all flex items-center gap-2 ${
                    assetModalTab === 'outside-source'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Outside Source (*/*)</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                {assetModalTab === 'app-created' ? (
                  <div className="space-y-3">
                    <div className="text-xs opacity-75">
                      Select assets created across the studio (MusicGen tracks, Voice Acting takes, 3D Vault assets, or Python scripts):
                    </div>
                    <div className="space-y-2">
                      {AVAILABLE_APP_ASSETS.map((appAsset) => {
                        const isAlreadyAdded = sceneAssets.some(a => a.name === appAsset.name);
                        return (
                          <div
                            key={appAsset.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                              themeMode === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                appAsset.type === '3d-mesh'
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : appAsset.type === 'audio-track'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {appAsset.type === '3d-mesh' ? <Box className="w-4 h-4" /> : appAsset.type === 'audio-track' ? <Music className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs truncate">{appAsset.name}</span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-white/10">
                                    {appAsset.format}
                                  </span>
                                </div>
                                <div className="text-[10px] opacity-70 flex items-center gap-2 mt-0.5">
                                  <span className="text-cyan-400 font-semibold">{appAsset.sourceTab}</span>
                                  <span>•</span>
                                  <span>Role: {appAsset.roleInScene}</span>
                                  <span>•</span>
                                  <span>{appAsset.sizeStr}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              disabled={isAlreadyAdded}
                              onClick={() => handleAddAppAssetToScene(appAsset)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                                isAlreadyAdded
                                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                                  : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/20'
                              }`}
                            >
                              {isAlreadyAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Scene</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Settings before upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Assign Role in Scene</label>
                        <select
                          value={uploadRole}
                          onChange={(e) => setUploadRole(e.target.value as any)}
                          className={`w-full p-2 rounded-xl border text-xs font-medium cursor-pointer ${
                            themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/10 text-slate-200'
                          }`}
                        >
                          <option value="3D Actor / Hero Prop">3D Actor / Hero Prop</option>
                          <option value="Camera Plate / Skybox">Camera Plate / Skybox</option>
                          <option value="BGM / Audio Track">BGM / Audio Track</option>
                          <option value="Volumetric Particle VFX">Volumetric Particle VFX</option>
                          <option value="Procedural Script Controller">Procedural Script Controller</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1">Shot Target</label>
                        <select
                          value={uploadClipTarget}
                          onChange={(e) => setUploadClipTarget(e.target.value)}
                          className={`w-full p-2 rounded-xl border text-xs font-medium cursor-pointer ${
                            themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/10 text-slate-200'
                          }`}
                        >
                          <option value="global">All Shots (Global Sequence)</option>
                          {clips.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Universal File Dropzone */}
                    <div
                      onClick={() => fileInputAssetRef.current?.click()}
                      className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        themeMode === 'light'
                          ? 'border-cyan-400/60 bg-cyan-50/40 hover:bg-cyan-50/70'
                          : 'border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/40'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 animate-bounce" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">Click to Upload Any File (*/*)</h4>
                      <p className="text-xs opacity-75 max-w-md mb-3">
                        Accepts ALL file formats: 3D (.fbx, .obj, .gltf, .glb, .usd, .blend), Video (.mp4, .webm, .mov), Audio (.wav, .mp3, .ogg, .flac), Textures (.png, .jpg, .exr, .hdr), Code (.py, .cpp, .uasset), and Archives (.zip).
                      </p>
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Supports Multi-File Selection
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs opacity-70">
                <span>Staged assets are integrated into Unreal 5.5 LevelSequences and manifest exports.</span>
                <button
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* 7. REAL-TIME PARAMETER SLIDERS (LIVE TWEAKING ACROSS SHOTS) */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Camera Optics & Spline Track */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-[#10141e] border-white/10'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Camera Optics & Spline</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">Live 60 FPS</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Camera Motion Trajectory</label>
                <select
                  value={activeClip.cameraMotion}
                  onChange={(e) => updateActiveClipAttributes({ cameraMotion: e.target.value as any })}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/10 text-cyan-300'
                  }`}
                >
                  <option value="drone-chase">Drone High-Speed Chase (Follow Spline)</option>
                  <option value="orbit-spline">360° Orbital Wrap (Hero Center)</option>
                  <option value="crane-overhead">Overhead Crane Sweep (Jib Arm)</option>
                  <option value="bumper-low">Ultra-Low Bumper Road Level</option>
                  <option value="handheld">Handheld Organic Shaky-Cam</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="opacity-80">Focal Length (Lens):</span>
                  <span className="font-bold text-cyan-400">{activeClip.focalLengthMm} mm</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={135}
                  step={1}
                  value={activeClip.focalLengthMm}
                  onChange={(e) => updateActiveClipAttributes({ focalLengthMm: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="opacity-80">Dutch Angle Tilt:</span>
                  <span className="font-bold text-cyan-400">{activeClip.dutchAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  step={1}
                  value={activeClip.dutchAngleDeg}
                  onChange={(e) => updateActiveClipAttributes({ dutchAngleDeg: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Lighting & Atmosphere */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-[#10141e] border-white/10'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Lighting & Atmosphere</span>
              </h3>
              <span className="text-[10px] font-mono text-amber-400">3-Point Rig</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Lighting Scheme Preset</label>
                <select
                  value={activeClip.lightingPreset}
                  onChange={(e) => updateActiveClipAttributes({ lightingPreset: e.target.value as any })}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/10 text-cyan-300'
                  }`}
                >
                  <option value="midnight-neon">Midnight Neo-Tokyo Neon</option>
                  <option value="sunset-golden">Golden Hour Coastal Sunset</option>
                  <option value="cyber-violet">Cyber Violet Anamorphic</option>
                  <option value="noir-rain">Film Noir Rain & Alley</option>
                  <option value="studio-key">Virtual Production Stage</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="opacity-80">Volumetric Rain Density:</span>
                  <span className="font-bold text-cyan-400">{activeClip.rainDensityPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={activeClip.rainDensityPct}
                  onChange={(e) => updateActiveClipAttributes({ rainDensityPct: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span className="opacity-80">Anamorphic Bloom Glow:</span>
                  <span className="font-bold text-cyan-400">{bloomIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bloomIntensity}
                  onChange={(e) => setBloomIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Color Grading & Master Output */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-[#10141e] border-white/10'
          }`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Color Grading & Export</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">ACEScg / LUT</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Color Grade LUT</label>
                <select
                  value={activeClip.colorGradeLut}
                  onChange={(e) => updateActiveClipAttributes({ colorGradeLut: e.target.value as any })}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-cyan-500 font-mono text-xs cursor-pointer ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/10 text-cyan-300'
                  }`}
                >
                  <option value="teal-orange">Teal & Orange Blockbuster</option>
                  <option value="matrix-green">Matrix Cyber Green</option>
                  <option value="noir-monochrome">Film Noir Monochrome</option>
                  <option value="kodak-warm">Kodak 5219 Warm 35mm</option>
                  <option value="cyberpunk-magenta">Cyberpunk Neon Magenta</option>
                </select>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={() => copyCode('Unreal 5.5 Script', generateUnrealCode())}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedCodeType === 'Unreal 5.5 Script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Unreal 5.5 Sequence Script</span>
                </button>

                <button
                  onClick={() => copyCode('Blender Script', generateBlenderCode())}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedCodeType === 'Blender Script' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Blender 4.2 Camera Script</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
