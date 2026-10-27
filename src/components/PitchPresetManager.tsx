import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  Bookmark,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Download,
  Upload,
  X,
  User,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Search,
  Zap,
  Music,
  ChevronDown,
  ChevronRight,
  Filter,
  Info,
  CheckCircle2
} from 'lucide-react';

export interface OctaveLeapSettings {
  /** Detection threshold in semitones before triggering an octave-leap alert (default: 12) */
  leapThresholdSemitones: number;
  /** Sensitivity level from 1 (lenient) to 10 (strict vigilance) */
  sensitivity: number;
  /** Minimum temporal hold duration in ms before confirming a leap artifact */
  debounceMs: number;
  /** Action when an octave artifact is caught */
  correctionMode: 'flag-only' | 'suppress' | 'snap-to-octave';
  /** Vocal intonation tolerance corridor in cents (e.g., ±15¢, ±25¢, ±50¢) */
  toleranceCents: number;
}

export interface PitchCharacterPreset {
  id: string;
  name: string;
  characterName: string;
  characterRole: string;
  genderVoiceType: 'bass' | 'baritone' | 'tenor' | 'contralto' | 'mezzo' | 'soprano' | 'creature' | 'robot';
  colorTag: string;
  minMidi: number; // e.g., 36 = C2 (65.4 Hz)
  maxMidi: number; // e.g., 60 = C4 (261.6 Hz)
  octaveLeapSettings: OctaveLeapSettings;
  notes?: string;
  isCustom?: boolean;
  lastUpdated?: string;
}

export const midiToFreq = (midi: number): number => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

export const midiToNoteName = (midi: number): string => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const note = noteNames[((midi % 12) + 12) % 12];
  return `${note}${octave}`;
};

export const DEFAULT_PITCH_PRESETS: PitchCharacterPreset[] = [
  {
    id: 'preset-basso-profondo',
    name: 'Basso Profondo',
    characterName: 'Lord Vaelgor',
    characterRole: 'Abyssal Titan & Underworld Monarch',
    genderVoiceType: 'bass',
    colorTag: '#6366f1',
    minMidi: 28, // E1 (~41.2 Hz)
    maxMidi: 48, // C3 (~130.8 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 12,
      sensitivity: 8,
      debounceMs: 60,
      correctionMode: 'suppress',
      toleranceCents: 15
    },
    notes: 'Sub-harmonic resonance filtering. Strictly clamps high frequency bleed and rogue first-overtone octave doubling.'
  },
  {
    id: 'preset-baritone-lead',
    name: 'Baritone Lead',
    characterName: 'Commander Marcus',
    characterRole: 'Gravelly Squad Leader / Protagonist',
    genderVoiceType: 'baritone',
    colorTag: '#06b6d4',
    minMidi: 36, // C2 (~65.4 Hz)
    maxMidi: 60, // C4 (~261.6 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 12,
      sensitivity: 7,
      debounceMs: 45,
      correctionMode: 'flag-only',
      toleranceCents: 25
    },
    notes: 'Balanced theatrical chest voice. Highlights abrupt falsetto octave flips during battle shouts.'
  },
  {
    id: 'preset-tenor-protagonist',
    name: 'Tenor Hero',
    characterName: 'Kaelen Vane',
    characterRole: 'Youthful Knight Ranger / Anime Hero',
    genderVoiceType: 'tenor',
    colorTag: '#10b981',
    minMidi: 48, // C3 (~130.8 Hz)
    maxMidi: 69, // A4 (~440.0 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 12,
      sensitivity: 6,
      debounceMs: 40,
      correctionMode: 'flag-only',
      toleranceCents: 25
    },
    notes: 'High chest to mix register. Suppresses microphone proximity pop and sub-harmonic undertone spikes.'
  },
  {
    id: 'preset-contralto-warm',
    name: 'Contralto Warm',
    characterName: 'High Matron Selene',
    characterRole: 'Deep Mystical Oracle / Veteran Operative',
    genderVoiceType: 'contralto',
    colorTag: '#f59e0b',
    minMidi: 53, // F3 (~174.6 Hz)
    maxMidi: 74, // D5 (~587.3 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 12,
      sensitivity: 7,
      debounceMs: 50,
      correctionMode: 'suppress',
      toleranceCents: 20
    },
    notes: 'Warm, low-register female voice profile with tight 20-cent intonation corridor.'
  },
  {
    id: 'preset-mezzo-soprano',
    name: 'Mezzo-Soprano',
    characterName: 'Lyra Valen',
    characterRole: 'Agile Spellblade & Dynamic Heroine',
    genderVoiceType: 'mezzo',
    colorTag: '#ec4899',
    minMidi: 57, // A3 (~220.0 Hz)
    maxMidi: 78, // F#5 (~740.0 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 12,
      sensitivity: 7,
      debounceMs: 35,
      correctionMode: 'flag-only',
      toleranceCents: 20
    },
    notes: 'Broad vocal dynamic range with rapid pitch glides. Ideal for energetic combat lines and expressive dialogue.'
  },
  {
    id: 'preset-soprano-highs',
    name: 'Soprano Highs',
    characterName: 'Aurelia Lumina',
    characterRole: 'Celestial Archon / Whistle Voice Elf',
    genderVoiceType: 'soprano',
    colorTag: '#a855f7',
    minMidi: 60, // C4 (~261.6 Hz)
    maxMidi: 84, // C6 (~1046.5 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 12,
      sensitivity: 8,
      debounceMs: 30,
      correctionMode: 'snap-to-octave',
      toleranceCents: 15
    },
    notes: 'High bell-tone clarity. Snaps accidental sub-harmonic pitch drop-outs back up to target register.'
  },
  {
    id: 'preset-creature-monster-lows',
    name: 'Creature / Monster Lows',
    characterName: 'Gargantuan Behemoth',
    characterRole: 'Colossal Golem / Demonic Growl',
    genderVoiceType: 'creature',
    colorTag: '#ef4444',
    minMidi: 24, // C1 (~32.7 Hz)
    maxMidi: 45, // A2 (~110.0 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 10,
      sensitivity: 9,
      debounceMs: 80,
      correctionMode: 'suppress',
      toleranceCents: 35
    },
    notes: 'Ultra-low guttural pitch profile. Aggressively shields against microphone rumble and room hum.'
  },
  {
    id: 'preset-robot-monotone',
    name: 'Robot / Android Monotone',
    characterName: 'Unit-8 Synth Guard',
    characterRole: 'Cybernetic AI / Vocoder Drone',
    genderVoiceType: 'robot',
    colorTag: '#38bdf8',
    minMidi: 45, // A2 (~110.0 Hz)
    maxMidi: 57, // A3 (~220.0 Hz)
    octaveLeapSettings: {
      leapThresholdSemitones: 7,
      sensitivity: 10,
      debounceMs: 15,
      correctionMode: 'snap-to-octave',
      toleranceCents: 10
    },
    notes: 'Ultra-narrow locked intonation band (±10¢). Snaps any human vibrato or pitch drift strictly to the grid.'
  }
];

interface PitchPresetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  activePresetId: string;
  onSelectPreset: (preset: PitchCharacterPreset) => void;
  currentMinMidi: number;
  currentMaxMidi: number;
  currentToleranceCents: number;
  onUpdateRangeAndTolerance: (minMidi: number, maxMidi: number, toleranceCents: number) => void;
  octaveLeapsCount: number;
  onResetLeapsCount: () => void;
  simulateOctaveGlitch: boolean;
  onToggleSimulateOctaveGlitch: () => void;
  themeMode: 'light' | 'dark';
  showToast: (msg: string) => void;
  onOctaveLeapSettingsChange?: (settings: OctaveLeapSettings) => void;
}

export function PitchPresetManager({
  isOpen,
  onClose,
  activePresetId,
  onSelectPreset,
  currentMinMidi,
  currentMaxMidi,
  currentToleranceCents,
  onUpdateRangeAndTolerance,
  octaveLeapsCount,
  onResetLeapsCount,
  simulateOctaveGlitch,
  onToggleSimulateOctaveGlitch,
  themeMode,
  showToast,
  onOctaveLeapSettingsChange
}: PitchPresetManagerProps) {
  // Preset Storage State
  const [presets, setPresets] = useState<PitchCharacterPreset[]>(() => {
    try {
      const saved = localStorage.getItem('devstudio_pitch_presets_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PITCH_PRESETS;
  });

  // Active Selected Preset State
  const activePreset = useMemo(() => {
    return presets.find(p => p.id === activePresetId) || presets[0] || DEFAULT_PITCH_PRESETS[0];
  }, [presets, activePresetId]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState<string>('all');

  // Edit / Creation Mode State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editingPreset, setEditingPreset] = useState<PitchCharacterPreset | null>(null);

  // JSON Import / Export Drawer
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  // Sync Presets to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('devstudio_pitch_presets_v1', JSON.stringify(presets));
    } catch (e) {
      console.warn('Failed to save pitch presets to localStorage', e);
    }
  }, [presets]);

  // When active preset changes, notify parent of octave leap settings
  useEffect(() => {
    if (activePreset && onOctaveLeapSettingsChange) {
      onOctaveLeapSettingsChange(activePreset.octaveLeapSettings);
    }
  }, [activePreset, onOctaveLeapSettingsChange]);

  // Check if current pitch range deviates from the active preset
  const isRangeModified = useMemo(() => {
    if (!activePreset) return false;
    return (
      activePreset.minMidi !== currentMinMidi ||
      activePreset.maxMidi !== currentMaxMidi ||
      activePreset.octaveLeapSettings.toleranceCents !== currentToleranceCents
    );
  }, [activePreset, currentMinMidi, currentMaxMidi, currentToleranceCents]);

  // Filtered presets
  const filteredPresets = useMemo(() => {
    return presets.filter(preset => {
      const matchesSearch =
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.characterRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        midiToNoteName(preset.minMidi).toLowerCase().includes(searchQuery.toLowerCase()) ||
        midiToNoteName(preset.maxMidi).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedFilterType === 'all' ||
        preset.genderVoiceType === selectedFilterType ||
        (selectedFilterType === 'custom' && preset.isCustom);

      return matchesSearch && matchesType;
    });
  }, [presets, searchQuery, selectedFilterType]);

  // Handle Preset Selection
  const handleApplyPreset = (preset: PitchCharacterPreset) => {
    onSelectPreset(preset);
    onUpdateRangeAndTolerance(
      preset.minMidi,
      preset.maxMidi,
      preset.octaveLeapSettings.toleranceCents
    );
    if (onOctaveLeapSettingsChange) {
      onOctaveLeapSettingsChange(preset.octaveLeapSettings);
    }
    showToast(`Loaded Preset: "${preset.name}" (${midiToNoteName(preset.minMidi)}–${midiToNoteName(preset.maxMidi)})`);
  };

  // Overwrite current active preset with current sliders
  const handleSaveActivePresetChanges = () => {
    if (!activePreset) return;
    const updated: PitchCharacterPreset = {
      ...activePreset,
      minMidi: currentMinMidi,
      maxMidi: currentMaxMidi,
      octaveLeapSettings: {
        ...activePreset.octaveLeapSettings,
        toleranceCents: currentToleranceCents
      },
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPresets(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast(`Saved changes to "${updated.name}"`);
  };

  // Reset current pitch sliders to the active preset baseline
  const handleRevertToActivePreset = () => {
    if (!activePreset) return;
    onUpdateRangeAndTolerance(
      activePreset.minMidi,
      activePreset.maxMidi,
      activePreset.octaveLeapSettings.toleranceCents
    );
    showToast(`Reverted to saved "${activePreset.name}" settings`);
  };

  // Duplicate Preset
  const handleDuplicatePreset = (preset: PitchCharacterPreset, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned: PitchCharacterPreset = {
      ...preset,
      id: `preset-custom-${Date.now()}`,
      name: `${preset.name} (Copy)`,
      characterName: `${preset.characterName} (Alt)`,
      isCustom: true,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPresets(prev => [cloned, ...prev]);
    onSelectPreset(cloned);
    showToast(`Duplicated into custom preset "${cloned.name}"`);
  };

  // Delete Custom Preset
  const handleDeletePreset = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (presets.length <= 1) {
      showToast('Cannot delete the last remaining preset.');
      return;
    }
    setPresets(prev => prev.filter(p => p.id !== id));
    if (activePresetId === id) {
      const remaining = presets.filter(p => p.id !== id);
      if (remaining.length > 0) {
        handleApplyPreset(remaining[0]);
      }
    }
    showToast(`Deleted preset "${name}"`);
  };

  // Restore Default Factory Archetypes
  const handleResetFactoryDefaults = () => {
    if (window.confirm('Restore factory vocal archetype presets? Your custom presets will be retained.')) {
      const customOnes = presets.filter(p => p.isCustom);
      const combined = [...DEFAULT_PITCH_PRESETS, ...customOnes];
      setPresets(combined);
      handleApplyPreset(DEFAULT_PITCH_PRESETS[0]);
      showToast('Restored studio default voice archetypes');
    }
  };

  // Initialize New Preset Form
  const handleStartCreateNew = () => {
    setEditingPreset({
      id: `preset-custom-${Date.now()}`,
      name: 'Custom Character Register',
      characterName: 'New Character',
      characterRole: 'Supporting Role / NPC Voice',
      genderVoiceType: 'baritone',
      colorTag: '#3b82f6',
      minMidi: currentMinMidi || 36,
      maxMidi: currentMaxMidi || 60,
      octaveLeapSettings: {
        leapThresholdSemitones: 12,
        sensitivity: 7,
        debounceMs: 40,
        correctionMode: 'flag-only',
        toleranceCents: currentToleranceCents || 25
      },
      notes: 'Custom character voice intonation boundaries & sensitivity envelope.',
      isCustom: true
    });
    setIsCreatingNew(true);
  };

  // Save Created or Edited Preset
  const handleSaveEditedPreset = () => {
    if (!editingPreset) return;
    if (!editingPreset.name.trim()) {
      showToast('Preset name cannot be empty');
      return;
    }
    if (editingPreset.minMidi >= editingPreset.maxMidi) {
      showToast('Minimum pitch note must be lower than maximum pitch note');
      return;
    }

    const payload: PitchCharacterPreset = {
      ...editingPreset,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (isCreatingNew) {
      setPresets(prev => [payload, ...prev]);
      handleApplyPreset(payload);
      showToast(`Created new character preset "${payload.name}"`);
    } else {
      setPresets(prev => prev.map(p => (p.id === payload.id ? payload : p)));
      if (activePresetId === payload.id) {
        handleApplyPreset(payload);
      }
      showToast(`Updated preset "${payload.name}"`);
    }

    setEditingPreset(null);
    setIsCreatingNew(false);
    setIsEditingSettings(false);
  };

  // Open JSON Export/Import
  const handleOpenExportJson = () => {
    setJsonText(JSON.stringify(presets, null, 2));
    setShowJsonModal(true);
    setCopiedJson(false);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        showToast('Invalid JSON: Must be an array of preset objects');
        return;
      }
      // Basic validation
      const valid = parsed.every(p => p.id && p.name && typeof p.minMidi === 'number' && typeof p.maxMidi === 'number');
      if (!valid) {
        showToast('Invalid JSON structure. Missing id, name, or pitch boundaries');
        return;
      }
      setPresets(parsed);
      handleApplyPreset(parsed[0]);
      setShowJsonModal(false);
      showToast(`Successfully imported ${parsed.length} pitch presets!`);
    } catch (err) {
      showToast('Failed to parse JSON string. Check formatting.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] md:w-[480px] shadow-2xl flex flex-col border-l transition-transform duration-300 ${
        themeMode === 'light'
          ? 'bg-slate-50/98 border-slate-300 text-slate-800'
          : 'bg-[#0b0e17]/98 border-cyan-500/30 text-slate-100 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]'
      }`}
    >
      {/* Sidebar Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
        themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-cyan-500/20'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-wide">Pitch Preset Manager</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Voice Profiles
              </span>
            </div>
            <p className="text-[11px] opacity-70">
              Character pitch ranges & octave-leap sensitivity matrix
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-500/15 transition-colors cursor-pointer text-slate-400"
          title="Close Pitch Preset Manager"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Preset Quick Status Ribbon */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 text-xs shrink-0 ${
        themeMode === 'light' ? 'bg-indigo-50/70 border-indigo-100' : 'bg-cyan-950/20 border-cyan-500/20'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-60 shrink-0">Active:</span>
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0" 
            style={{ backgroundColor: activePreset.colorTag }} 
          />
          <span className="font-bold truncate text-cyan-400 text-xs">
            {activePreset.name}
          </span>
          <span className="text-[10px] font-mono opacity-80 shrink-0">
            [{midiToNoteName(currentMinMidi)}–{midiToNoteName(currentMaxMidi)}]
          </span>
          {isRangeModified && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              Modified
            </span>
          )}
        </div>

        {/* Save / Revert Actions if Modified */}
        {isRangeModified && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleSaveActivePresetChanges}
              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] cursor-pointer flex items-center gap-1 shadow-sm"
              title="Save current slider values into active preset"
            >
              <Check className="w-3 h-3" />
              <span>Save</span>
            </button>
            <button
              onClick={handleRevertToActivePreset}
              className="px-1.5 py-1 rounded border border-slate-600 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer flex items-center gap-1"
              title="Revert sliders to saved preset values"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Preset Creation / Edit Form Overlay */}
        {(isCreatingNew || isEditingSettings) && editingPreset && (
          <div className={`p-4 rounded-xl border space-y-3.5 shadow-lg animate-in fade-in zoom-in-95 duration-200 ${
            themeMode === 'light' ? 'bg-white border-cyan-400 shadow-cyan-100' : 'bg-slate-900 border-cyan-500/40 shadow-black/60'
          }`}>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-cyan-300">
                  {isCreatingNew ? 'Create New Character Preset' : `Edit Preset: ${editingPreset.name}`}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditingPreset(null);
                  setIsCreatingNew(false);
                  setIsEditingSettings(false);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono opacity-70">Preset Name</label>
                <input
                  type="text"
                  value={editingPreset.name}
                  onChange={e => setEditingPreset({ ...editingPreset, name: e.target.value })}
                  placeholder="e.g., Soprano Highs"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-semibold text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono opacity-70">Character Name</label>
                <input
                  type="text"
                  value={editingPreset.characterName}
                  onChange={e => setEditingPreset({ ...editingPreset, characterName: e.target.value })}
                  placeholder="e.g., Lyra Valen"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-semibold text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono opacity-70">Character Role</label>
                <input
                  type="text"
                  value={editingPreset.characterRole}
                  onChange={e => setEditingPreset({ ...editingPreset, characterRole: e.target.value })}
                  placeholder="e.g., Arch-Mage / Anti-Hero"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono opacity-70">Voice Archetype</label>
                <select
                  value={editingPreset.genderVoiceType}
                  onChange={e => setEditingPreset({ ...editingPreset, genderVoiceType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="bass">Bass / Deep Low</option>
                  <option value="baritone">Baritone Lead</option>
                  <option value="tenor">Tenor Hero</option>
                  <option value="contralto">Contralto Warm</option>
                  <option value="mezzo">Mezzo-Soprano</option>
                  <option value="soprano">Soprano Highs</option>
                  <option value="creature">Creature / Monster</option>
                  <option value="robot">Robot / Android</option>
                </select>
              </div>
            </div>

            {/* Custom Pitch Range Boundaries */}
            <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 text-[11px] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pitch Passband Boundaries</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold text-[11px]">
                  {midiToNoteName(editingPreset.minMidi)} ({midiToFreq(editingPreset.minMidi).toFixed(1)}Hz) ➔{' '}
                  {midiToNoteName(editingPreset.maxMidi)} ({midiToFreq(editingPreset.maxMidi).toFixed(1)}Hz)
                </span>
              </div>

              {/* Min Note Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Floor Cutoff (Min): {midiToNoteName(editingPreset.minMidi)}</span>
                  <span>{midiToFreq(editingPreset.minMidi).toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={60}
                  step={1}
                  value={editingPreset.minMidi}
                  onChange={e => setEditingPreset({ ...editingPreset, minMidi: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Max Note Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Ceiling Cutoff (Max): {midiToNoteName(editingPreset.maxMidi)}</span>
                  <span>{midiToFreq(editingPreset.maxMidi).toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min={48}
                  max={96}
                  step={1}
                  value={editingPreset.maxMidi}
                  onChange={e => setEditingPreset({ ...editingPreset, maxMidi: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Octave Leap Sensitivity Envelope Settings */}
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-300 text-[11px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Octave-Leap Sensitivity Matrix</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300">
                  Level {editingPreset.octaveLeapSettings.sensitivity}/10
                </span>
              </div>

              {/* Sensitivity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Detection Sensitivity:</span>
                  <span className="text-rose-400 font-bold">
                    {editingPreset.octaveLeapSettings.sensitivity === 10
                      ? 'Strict / Zero-Tolerance'
                      : editingPreset.octaveLeapSettings.sensitivity <= 3
                      ? 'Lenient / High Tolerance'
                      : `Standard (${editingPreset.octaveLeapSettings.sensitivity}/10)`}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={editingPreset.octaveLeapSettings.sensitivity}
                  onChange={e =>
                    setEditingPreset({
                      ...editingPreset,
                      octaveLeapSettings: {
                        ...editingPreset.octaveLeapSettings,
                        sensitivity: Number(e.target.value)
                      }
                    })
                  }
                  className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Leap Threshold Semitones */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Leap Trigger Threshold:</span>
                  <span className="text-cyan-300 font-bold">
                    {editingPreset.octaveLeapSettings.leapThresholdSemitones} Semitones ({editingPreset.octaveLeapSettings.leapThresholdSemitones === 12 ? '1 Full Octave' : `${editingPreset.octaveLeapSettings.leapThresholdSemitones}st`})
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={24}
                  step={1}
                  value={editingPreset.octaveLeapSettings.leapThresholdSemitones}
                  onChange={e =>
                    setEditingPreset({
                      ...editingPreset,
                      octaveLeapSettings: {
                        ...editingPreset.octaveLeapSettings,
                        leapThresholdSemitones: Number(e.target.value)
                      }
                    })
                  }
                  className="w-full accent-indigo-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Debounce Window & Intonation Corridor */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono opacity-70">Debounce Window</label>
                  <select
                    value={editingPreset.octaveLeapSettings.debounceMs}
                    onChange={e =>
                      setEditingPreset({
                        ...editingPreset,
                        octaveLeapSettings: {
                          ...editingPreset.octaveLeapSettings,
                          debounceMs: Number(e.target.value)
                        }
                      })
                    }
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value={15}>15 ms (Instant / Ultra-Fast)</option>
                    <option value={30}>30 ms (Fast Speech)</option>
                    <option value={45}>45 ms (Standard Vocal)</option>
                    <option value={60}>60 ms (Operatic Vibrato)</option>
                    <option value={100}>100 ms (High Inertia)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono opacity-70">Correction Mode</label>
                  <select
                    value={editingPreset.octaveLeapSettings.correctionMode}
                    onChange={e =>
                      setEditingPreset({
                        ...editingPreset,
                        octaveLeapSettings: {
                          ...editingPreset.octaveLeapSettings,
                          correctionMode: e.target.value as any
                        }
                      })
                    }
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="flag-only">Flag & Mask in Red</option>
                    <option value="suppress">Suppress Artifacts</option>
                    <option value="snap-to-octave">Snap / Fold to Octave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes / Description */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono opacity-70">Character Voice Notes</label>
              <textarea
                rows={2}
                value={editingPreset.notes || ''}
                onChange={e => setEditingPreset({ ...editingPreset, notes: e.target.value })}
                placeholder="Performance notes or microphone positioning details..."
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setEditingPreset(null);
                  setIsCreatingNew(false);
                  setIsEditingSettings(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedPreset}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isCreatingNew ? 'Create Preset' : 'Save Preset'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Filters, New Preset Button */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search presets, notes, characters..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none transition-all ${
                  themeMode === 'light'
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500'
                    : 'bg-slate-900/90 border-slate-700 text-white focus:border-cyan-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={handleStartCreateNew}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow cursor-pointer shrink-0"
              title="Create a new character pitch preset"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Preset</span>
            </button>
          </div>

          {/* Archetype Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium no-scrollbar">
            {[
              { id: 'all', label: 'All Presets' },
              { id: 'bass', label: 'Bass / Profondo' },
              { id: 'baritone', label: 'Baritone' },
              { id: 'tenor', label: 'Tenor' },
              { id: 'contralto', label: 'Contralto' },
              { id: 'mezzo', label: 'Mezzo' },
              { id: 'soprano', label: 'Soprano Highs' },
              { id: 'creature', label: 'Creature' },
              { id: 'robot', label: 'Robot' },
              { id: 'custom', label: 'Custom' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer border text-[11px] ${
                  selectedFilterType === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold shadow-sm'
                    : 'bg-slate-800/30 text-slate-400 border-slate-700/50 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Octave-Leap Inspector & Glitch Tester Card */}
        <div className={`p-3 rounded-xl border flex flex-col gap-2.5 text-xs ${
          themeMode === 'light' ? 'bg-rose-50/70 border-rose-200' : 'bg-rose-950/20 border-rose-500/30 shadow-inner'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-rose-300">
                Octave-Leap Detector
              </span>
            </div>

            <div className="flex items-center gap-2">
              {octaveLeapsCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                    ⚡ {octaveLeapsCount} Leaps Caught
                  </span>
                  <button
                    onClick={onResetLeapsCount}
                    className="p-1 rounded hover:bg-rose-900/40 text-rose-300 cursor-pointer"
                    title="Reset leap counter"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>No Leaps Detected</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-[11px]">
            <p className="text-[11px] opacity-75">
              Active sensitivity:{' '}
              <span className="font-bold text-rose-300">
                Level {activePreset.octaveLeapSettings.sensitivity}/10
              </span>{' '}
              · Threshold:{' '}
              <span className="font-mono text-cyan-300">
                {activePreset.octaveLeapSettings.leapThresholdSemitones}st
              </span>{' '}
              ({activePreset.octaveLeapSettings.correctionMode})
            </p>

            <button
              onClick={onToggleSimulateOctaveGlitch}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all border shrink-0 flex items-center gap-1 ${
                simulateOctaveGlitch
                  ? 'bg-red-600 text-white border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-rose-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>{simulateOctaveGlitch ? 'Glitch Active' : 'Test Glitch'}</span>
            </button>
          </div>
        </div>

        {/* Preset Cards List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1 text-slate-400 font-mono">
            <span>AVAILABLE CHARACTER PROFILES ({filteredPresets.length})</span>
            <span className="text-[10px]">Click to Load</span>
          </div>

          {filteredPresets.map(preset => {
            const isCurrentActive = preset.id === activePreset.id;
            const minFreq = midiToFreq(preset.minMidi);
            const maxFreq = midiToFreq(preset.maxMidi);

            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isCurrentActive
                    ? themeMode === 'light'
                      ? 'bg-cyan-50/90 border-cyan-400 shadow-md'
                      : 'bg-[#121927] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.18)]'
                    : themeMode === 'light'
                    ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Active Indicator Strip */}
                {isCurrentActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: preset.colorTag || '#06b6d4' }}
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: preset.colorTag || '#06b6d4' }}
                      />
                      <h4 className="font-bold text-xs truncate flex items-center gap-1.5 text-white">
                        <span>{preset.name}</span>
                        {preset.isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Custom
                          </span>
                        )}
                        {isCurrentActive && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active
                          </span>
                        )}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] opacity-75">
                      <span className="font-medium text-slate-300 truncate">
                        {preset.characterName}
                      </span>
                      <span>•</span>
                      <span className="truncate italic text-slate-400">
                        {preset.characterRole}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Edit, Duplicate, Delete */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setEditingPreset({ ...preset });
                        setIsCreatingNew(false);
                        setIsEditingSettings(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-cyan-300 cursor-pointer"
                      title="Edit preset settings"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={e => handleDuplicatePreset(preset, e)}
                      className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-indigo-300 cursor-pointer"
                      title="Duplicate preset"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {preset.isCustom && (
                      <button
                        onClick={e => handleDeletePreset(preset.id, preset.name, e)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer"
                        title="Delete custom preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Pitch Range Strip & Badges */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[10px] text-slate-400">Passband:</span>
                    <span className="font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                      {midiToNoteName(preset.minMidi)} ({minFreq.toFixed(0)}Hz) ➔{' '}
                      {midiToNoteName(preset.maxMidi)} ({maxFreq.toFixed(0)}Hz)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30" title="Octave leap sensitivity & threshold">
                      ⚡ Sens {preset.octaveLeapSettings.sensitivity}/10 · {preset.octaveLeapSettings.leapThresholdSemitones}st
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30" title="Pitch stability corridor">
                      ±{preset.octaveLeapSettings.toleranceCents}¢
                    </span>
                  </div>
                </div>

                {/* Performance Notes preview if present */}
                {preset.notes && (
                  <p className="mt-1.5 text-[10px] text-slate-400/90 italic truncate">
                    "{preset.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer: Management Utilities */}
      <div className={`p-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 ${
        themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-cyan-500/20'
      }`}>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleOpenExportJson}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 cursor-pointer flex items-center gap-1"
            title="Export or Import JSON Preset Bank"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>JSON Bank</span>
          </button>

          <button
            onClick={handleResetFactoryDefaults}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 cursor-pointer flex items-center gap-1"
            title="Restore default character vocal archetypes"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Factory Reset</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-sm transition-all"
        >
          Done
        </button>
      </div>

      {/* JSON Import/Export Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-5 rounded-2xl border shadow-2xl space-y-3.5 ${
            themeMode === 'light' ? 'bg-white border-slate-300' : 'bg-[#0e121d] border-cyan-500/40 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-sm">Preset Bank JSON Sync</h4>
              </div>
              <button onClick={() => setShowJsonModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs opacity-75">
              Copy your character presets to share or paste an external JSON configuration to import.
            </p>

            <textarea
              rows={10}
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="w-full font-mono text-xs p-3 rounded-xl border border-slate-700 bg-slate-950 text-cyan-300 focus:outline-none focus:border-cyan-400"
            />

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  setCopiedJson(true);
                  showToast('Copied presets JSON to clipboard');
                  setTimeout(() => setCopiedJson(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportJson}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import & Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
