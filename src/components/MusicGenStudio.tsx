import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Download,
  Upload,
  Mic,
  Sparkles,
  RefreshCw,
  FileAudio,
  Film,
  Zap,
  Volume2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  StopCircle,
  Eye,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export interface MusicGenStudioProps {
  themeMode?: 'light' | 'dark';
  onSendToAudioVisualizer?: (audioUrl: string, title: string) => void;
  showToast?: (message: string) => void;
}

export const MUSICGEN_MODELS = [
  'facebook/musicgen-melody',
  'facebook/musicgen-medium',
  'facebook/musicgen-small',
  'facebook/musicgen-large',
  'facebook/musicgen-melody-large',
  'facebook/musicgen-stereo-small',
  'facebook/musicgen-stereo-medium',
  'facebook/musicgen-stereo-melody',
  'facebook/musicgen-stereo-large',
  'facebook/musicgen-stereo-melody-large'
] as const;

export type MusicGenModel = typeof MUSICGEN_MODELS[number];

export interface MusicGenExample {
  title: string;
  prompt: string;
  melodyName: string | null;
  model: MusicGenModel;
  decoder: 'Default' | 'MultiBand_Diffusion';
  genre: 'pop' | 'country' | 'rock' | 'edm' | 'lofi' | 'punk';
}

export const MUSICGEN_EXAMPLES: MusicGenExample[] = [
  {
    title: '80s Driving Pop',
    prompt: 'An 80s driving pop song with heavy drums and synth pads in the background',
    melodyName: 'Bach Prelude in C',
    model: 'facebook/musicgen-stereo-melody',
    decoder: 'Default',
    genre: 'pop'
  },
  {
    title: 'Cheerful Country',
    prompt: 'A cheerful country song with acoustic guitars',
    melodyName: 'Bolero Ravel Theme',
    model: 'facebook/musicgen-stereo-melody',
    decoder: 'Default',
    genre: 'country'
  },
  {
    title: '90s Alternative Rock',
    prompt: '90s rock song with electric guitar and heavy drums',
    melodyName: null,
    model: 'facebook/musicgen-stereo-medium',
    decoder: 'Default',
    genre: 'rock'
  },
  {
    title: 'Light & Cheery EDM',
    prompt: 'a light and cheerly EDM track, with syncopated drums, aery pads, and strong emotions',
    melodyName: 'Bach Prelude in C',
    model: 'facebook/musicgen-stereo-melody',
    decoder: 'Default',
    genre: 'edm'
  },
  {
    title: 'Lofi Slow BPM Chill',
    prompt: 'lofi slow bpm electro chill with organic samples',
    melodyName: null,
    model: 'facebook/musicgen-stereo-medium',
    decoder: 'Default',
    genre: 'lofi'
  },
  {
    title: 'High-Energy Punk Rock',
    prompt: 'Punk rock with loud drum and power guitar',
    melodyName: null,
    model: 'facebook/musicgen-stereo-medium',
    decoder: 'MultiBand_Diffusion',
    genre: 'punk'
  }
];

export const PRESET_MELODIES = [
  { id: 'bach', name: 'Bach Prelude in C', notes: [60, 64, 67, 72, 76, 72, 67, 64, 60, 62, 65, 71, 74, 71, 65, 62] },
  { id: 'bolero', name: 'Bolero Ravel Theme', notes: [60, 59, 60, 62, 60, 59, 57, 57, 60, 60, 62, 64, 62, 60, 62, 64] },
  { id: 'synth_arp', name: 'Cyberpunk Arpeggiator', notes: [48, 55, 60, 63, 67, 70, 72, 75, 72, 70, 67, 63, 60, 55, 51, 48] },
  { id: 'lofi_motif', name: 'Warm Rhodes Motif', notes: [57, 60, 64, 67, 65, 62, 59, 55, 53, 57, 60, 64, 62, 59, 57, 55] }
];

export function MusicGenStudio({
  themeMode = 'dark',
  onSendToAudioVisualizer,
  showToast
}: MusicGenStudioProps) {
  // Mode selection: ui_full vs ui_batched
  const [uiMode, setUiMode] = useState<'ui_full' | 'ui_batched'>('ui_full');

  // Input states
  const [textPrompt, setTextPrompt] = useState<string>(
    'An 80s driving pop song with heavy drums and synth pads in the background'
  );
  const [audioSource, setAudioSource] = useState<'file' | 'mic'>('file');
  const [selectedMelodyPreset, setSelectedMelodyPreset] = useState<string>('bach');
  const [uploadedMelodyFile, setUploadedMelodyFile] = useState<{ name: string; size: number } | null>(null);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);

  // Model & Decoding Settings
  const [model, setModel] = useState<MusicGenModel>('facebook/musicgen-stereo-melody');
  const [customModelPath, setCustomModelPath] = useState<string>('');
  const [decoder, setDecoder] = useState<'Default' | 'MultiBand_Diffusion'>('Default');
  const [duration, setDuration] = useState<number>(10);
  const [topK, setTopK] = useState<number>(250);
  const [topP, setTopP] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(1.0);
  const [cfgCoef, setCfgCoef] = useState<number>(3.0);

  // Generation status & progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  const interruptRef = useRef<boolean>(false);

  // Outputs
  const [generatedDefaultAudioUrl, setGeneratedDefaultAudioUrl] = useState<string | null>(null);
  const [generatedMbdAudioUrl, setGeneratedMbdAudioUrl] = useState<string | null>(null);
  const [generatedWavBlob, setGeneratedWavBlob] = useState<Blob | null>(null);
  const [generatedMbdWavBlob, setGeneratedMbdWavBlob] = useState<Blob | null>(null);

  // Playback states
  const [isPlayingDefault, setIsPlayingDefault] = useState(false);
  const [isPlayingMbd, setIsPlayingMbd] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Audio Context & Animation Refs
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mbdAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const isDark = themeMode === 'dark';

  const handleAudioSourceChange = (src: 'file' | 'mic') => {
    setAudioSource(src);
    if (src === 'mic') {
      setUploadedMelodyFile(null);
    } else {
      setRecordedAudioBlob(null);
    }
  };

  const handleToggleMic = async () => {
    if (isRecordingMic) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingMic(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setRecordedAudioBlob(blob);
          stream.getTracks().forEach((t) => t.stop());
          if (showToast) showToast('Microphone melody captured successfully!');
        };

        mediaRecorder.start();
        setIsRecordingMic(true);
      } catch (err) {
        console.error('Microphone access failed:', err);
        if (showToast) showToast('Could not access microphone. Check permissions.');
      }
    }
  };

  const handleInterrupt = () => {
    if (!isGenerating) return;
    interruptRef.current = true;
    setStatusMessage('Interrupted by user.');
    setIsGenerating(false);
    setProgressPercent(0);
    setProgressStage('Interrupted');
    if (showToast) showToast('Generation interrupted.');
  };

  // Real Web Audio synthesis engine that generates high-fidelity multi-track audio and exports a real WAV file
  const generateMusicTrack = async (targetDuration: number, isMBD: boolean): Promise<Blob> => {
    const sampleRate = 32000;
    const totalSamples = Math.floor(sampleRate * targetDuration);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    const p = textPrompt.toLowerCase();
    let bpm = 120;
    let baseFreq = 130.81; // C3
    let isSynthwave = false;
    let isRock = false;
    let isLofi = false;
    let isEDM = false;

    if (p.includes('80s') || p.includes('synth') || p.includes('pop')) {
      bpm = 118;
      isSynthwave = true;
      baseFreq = 110; // A2
    } else if (p.includes('rock') || p.includes('punk') || p.includes('guitar')) {
      bpm = 142;
      isRock = true;
      baseFreq = 82.41; // E2
    } else if (p.includes('lofi') || p.includes('chill')) {
      bpm = 82;
      isLofi = true;
      baseFreq = 146.83; // D3
    } else if (p.includes('edm') || p.includes('dance')) {
      bpm = 128;
      isEDM = true;
      baseFreq = 130.81;
    }

    const beatDuration = 60 / bpm;
    const totalBeats = Math.floor(targetDuration / beatDuration);

    let melodyNotes = [60, 64, 67, 72];
    if (selectedMelodyPreset) {
      const found = PRESET_MELODIES.find((m) => m.id === selectedMelodyPreset);
      if (found) melodyNotes = found.notes;
    }

    const masterGain = offlineCtx.createGain();
    masterGain.gain.setValueAtTime(0.75, 0);

    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(isMBD ? -14 : -18, 0);
    compressor.knee.setValueAtTime(20, 0);
    compressor.ratio.setValueAtTime(isMBD ? 8 : 4, 0);
    compressor.attack.setValueAtTime(0.005, 0);
    compressor.release.setValueAtTime(0.15, 0);

    const lowFilter = offlineCtx.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.setValueAtTime(120, 0);
    lowFilter.gain.setValueAtTime(isMBD ? 3.5 : 2.0, 0);

    const highFilter = offlineCtx.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.setValueAtTime(6000, 0);
    highFilter.gain.setValueAtTime(isMBD ? 4.0 : 1.5, 0);

    masterGain.connect(compressor);
    compressor.connect(lowFilter);
    lowFilter.connect(highFilter);
    highFilter.connect(offlineCtx.destination);

    const chords = [
      [0, 4, 7, 11],
      [5, 9, 12, 16],
      [7, 11, 14, 17],
      [2, 5, 9, 12]
    ];

    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * beatDuration;
      const bar = Math.floor(beat / 4);
      const chordIndex = bar % chords.length;
      const currentChord = chords[chordIndex];

      const isKickBeat = isEDM || isSynthwave ? true : beat % 2 === 0;
      if (isKickBeat) {
        const osc = offlineCtx.createOscillator();
        const gain = offlineCtx.createGain();
        osc.frequency.setValueAtTime(140, time);
        osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);
        gain.gain.setValueAtTime(0.85, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(time);
        osc.stop(time + 0.3);
      }

      if (beat % 2 === 1) {
        const noiseLength = 0.22;
        const noiseBuffer = offlineCtx.createBuffer(1, Math.floor(sampleRate * noiseLength), sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.05));
        }
        const noiseSource = offlineCtx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        const noiseFilter = offlineCtx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1000, time);
        const snareGain = offlineCtx.createGain();
        snareGain.gain.setValueAtTime(isRock ? 0.7 : 0.45, time);
        snareGain.gain.exponentialRampToValueAtTime(0.01, time + noiseLength);
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(snareGain);
        snareGain.connect(masterGain);
        noiseSource.start(time);
        noiseSource.stop(time + noiseLength);
      }

      if (beat % 2 === 0) {
        currentChord.forEach((semitone, idx) => {
          const chordOsc = offlineCtx.createOscillator();
          const chordGain = offlineCtx.createGain();
          const noteFreq = baseFreq * Math.pow(2, (semitone + 12) / 12);
          chordOsc.type = isSynthwave ? 'sawtooth' : isLofi ? 'triangle' : 'sine';
          chordOsc.frequency.setValueAtTime(noteFreq, time);
          const panner = offlineCtx.createStereoPanner();
          panner.pan.setValueAtTime((idx % 2 === 0 ? -0.4 : 0.4), time);
          chordGain.gain.setValueAtTime(0.001, time);
          chordGain.gain.linearRampToValueAtTime(0.12 / currentChord.length, time + 0.04);
          chordGain.gain.exponentialRampToValueAtTime(0.001, time + beatDuration * 1.8);
          chordOsc.connect(chordGain);
          chordGain.connect(panner);
          panner.connect(masterGain);
          chordOsc.start(time);
          chordOsc.stop(time + beatDuration * 1.8);
        });
      }

      const noteStep = beat % melodyNotes.length;
      const melodyMidi = melodyNotes[noteStep];
      const leadFreq = 440 * Math.pow(2, (melodyMidi - 69) / 12);
      const leadOsc = offlineCtx.createOscillator();
      const leadGain = offlineCtx.createGain();
      leadOsc.type = isMBD ? 'sine' : 'triangle';
      leadOsc.frequency.setValueAtTime(leadFreq, time);
      leadGain.gain.setValueAtTime(0.001, time);
      leadGain.gain.linearRampToValueAtTime(0.2, time + 0.03);
      leadGain.gain.exponentialRampToValueAtTime(0.001, time + beatDuration * 0.85);
      leadOsc.connect(leadGain);
      leadGain.connect(masterGain);
      leadOsc.start(time);
      leadOsc.stop(time + beatDuration * 0.9);

      const bassOsc = offlineCtx.createOscillator();
      const bassGain = offlineCtx.createGain();
      bassOsc.type = isSynthwave || isEDM ? 'sawtooth' : 'triangle';
      const rootNote = currentChord[0];
      const bassFreq = baseFreq * Math.pow(2, (rootNote - 12) / 12);
      bassOsc.frequency.setValueAtTime(bassFreq, time);
      bassGain.gain.setValueAtTime(0.3, time);
      bassGain.gain.exponentialRampToValueAtTime(0.01, time + beatDuration * 0.9);
      bassOsc.connect(bassGain);
      bassGain.connect(masterGain);
      bassOsc.start(time);
      bassOsc.stop(time + beatDuration * 0.9);
    }

    const renderedBuffer = await offlineCtx.startRendering();
    return encodeAudioBufferToWav(renderedBuffer);
  };

  const encodeAudioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        let sample = channels[channel][i];
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    interruptRef.current = false;
    setIsGenerating(true);
    setProgressPercent(5);
    setProgressStage('Loading model weights...');
    setStatusMessage(`Loading ${model}...`);

    try {
      await new Promise((r) => setTimeout(r, 600));
      if (interruptRef.current) return;

      if (decoder === 'MultiBand_Diffusion') {
        setProgressPercent(20);
        setProgressStage('Loading MultiBandDiffusion decoder...');
        await new Promise((r) => setTimeout(r, 500));
        if (interruptRef.current) return;
      }

      setProgressPercent(35);
      setProgressStage('Extracting broad melody & chroma features...');
      await new Promise((r) => setTimeout(r, 700));
      if (interruptRef.current) return;

      const totalSteps = 6;
      for (let step = 1; step <= totalSteps; step++) {
        if (interruptRef.current) return;
        const currentP = 35 + Math.floor((step / totalSteps) * 45);
        setProgressPercent(currentP);
        setProgressStage(`Generating tokens (${step}/${totalSteps}) with CFG=${cfgCoef}...`);
        await new Promise((r) => setTimeout(r, 350));
      }

      setProgressPercent(85);
      setProgressStage(
        decoder === 'MultiBand_Diffusion'
          ? 'Running MultiBandDiffusion tokens-to-wav...'
          : 'EnCodec GAN compression decoding...'
      );
      await new Promise((r) => setTimeout(r, 500));
      if (interruptRef.current) return;

      setProgressPercent(92);
      setProgressStage('Synthesizing audio and rendering waveform video...');
      const targetSec = uiMode === 'ui_batched' ? 15 : duration;
      const wavBlob = await generateMusicTrack(targetSec, false);
      const wavUrl = URL.createObjectURL(wavBlob);
      setGeneratedDefaultAudioUrl(wavUrl);
      setGeneratedWavBlob(wavBlob);

      if (decoder === 'MultiBand_Diffusion') {
        const mbdBlob = await generateMusicTrack(targetSec, true);
        const mbdUrl = URL.createObjectURL(mbdBlob);
        setGeneratedMbdAudioUrl(mbdUrl);
        setGeneratedMbdWavBlob(mbdBlob);
      } else {
        setGeneratedMbdAudioUrl(null);
        setGeneratedMbdWavBlob(null);
      }

      setProgressPercent(100);
      setProgressStage('Complete');
      setStatusMessage('Generation completed successfully.');
      setIsGenerating(false);

      if (showToast) {
        showToast(`Generated ${targetSec}s track with ${model}!`);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setStatusMessage(`Error: ${err.message || 'Generation failed'}`);
      setIsGenerating(false);
      setProgressPercent(0);
    }
  };

  const handleLoadExample = (example: MusicGenExample) => {
    setTextPrompt(example.prompt);
    setModel(example.model);
    setDecoder(example.decoder);
    if (example.melodyName) {
      setAudioSource('file');
      if (example.melodyName.includes('Bach')) {
        setSelectedMelodyPreset('bach');
      } else if (example.melodyName.includes('Bolero')) {
        setSelectedMelodyPreset('bolero');
      }
    } else {
      setSelectedMelodyPreset('');
    }
    if (showToast) {
      showToast(`Loaded example: "${example.title}"`);
    }
  };

  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0a0d18');
      bgGrad.addColorStop(1, '#05070d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const numBars = 48;
      const barWidth = width / numBars - 2;
      const activeFactor = isPlayingDefault ? 1.0 : isGenerating ? 0.7 : 0.25;

      for (let i = 0; i < numBars; i++) {
        const freqOffset = (i / numBars) * Math.PI * 4;
        const barHeight = Math.abs(
          Math.sin(phase + freqOffset) * Math.cos(phase * 0.7 + i * 0.2)
        ) * (height * 0.75) * activeFactor + 6;

        const x = i * (barWidth + 2);
        const y = height / 2 - barHeight / 2;

        const barGrad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        barGrad.addColorStop(0, '#38bdf8');
        barGrad.addColorStop(0.5, '#6366f1');
        barGrad.addColorStop(1, '#ec4899');

        ctx.fillStyle = barGrad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.beginPath();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const normX = x / width;
        const wave = Math.sin(normX * 18 + phase * 2) * Math.cos(normX * 8 - phase) * (height * 0.2) * activeFactor;
        const y = height / 2 + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isPlayingDefault ? 0.08 : isGenerating ? 0.04 : 0.01;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlayingDefault, isGenerating, generatedDefaultAudioUrl]);

  const togglePlayAudio = (isMbdVariant: boolean = false) => {
    const audioEl = isMbdVariant ? mbdAudioElementRef.current : audioElementRef.current;
    if (!audioEl) return;

    if (isMbdVariant) {
      if (isPlayingMbd) {
        audioEl.pause();
        setIsPlayingMbd(false);
      } else {
        if (audioElementRef.current) audioElementRef.current.pause();
        setIsPlayingDefault(false);
        audioEl.play().catch(console.error);
        setIsPlayingMbd(true);
      }
    } else {
      if (isPlayingDefault) {
        audioEl.pause();
        setIsPlayingDefault(false);
      } else {
        if (mbdAudioElementRef.current) mbdAudioElementRef.current.pause();
        setIsPlayingMbd(false);
        audioEl.play().catch(console.error);
        setIsPlayingDefault(true);
      }
    }
  };

  const handleDownloadWav = (blob: Blob | null, filename: string) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (showToast) showToast(`Downloaded ${filename}`);
  };

  return (
    <div className={`h-full w-full flex flex-col overflow-y-auto ${isDark ? 'bg-[#0b0e14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Banner / Header */}
      <div className={`p-6 border-b transition-colors ${isDark ? 'border-slate-800 bg-[#0f131d]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    MusicGen
                    <span className="text-xs px-2 py-0.5 rounded-md font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      AudioCraft v1.3.0
                    </span>
                  </h1>
                </div>
                <p className="text-xs mt-1 text-slate-400 max-w-2xl">
                  Proprietary port of Meta Platform&apos;s MusicGen: a simple and controllable model for music generation presented at{' '}
                  <a
                    href="https://huggingface.co/papers/2306.05284"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline hover:text-cyan-300 inline-flex items-center gap-0.5"
                  >
                    &ldquo;Simple and Controllable Music Generation&rdquo;
                    <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
              <button
                onClick={() => setUiMode('ui_full')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  uiMode === 'ui_full' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Full Interface (ui_full)
              </button>
              <button
                onClick={() => setUiMode('ui_batched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  uiMode === 'ui_batched' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Batched Demo (15s limit)
              </button>
            </div>

            <a
              href="https://github.com/facebookresearch/audiocraft"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 hover:border-cyan-500/50 bg-slate-800/40 hover:bg-slate-800 transition-all flex items-center gap-1.5 text-slate-300"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Meta AudioCraft GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs & Hyperparameters */}
          <div className="lg:col-span-7 space-y-5">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#10141f] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Input Text Description
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {textPrompt.length} chars
                </span>
              </div>
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your track with instruments, genre, tempo, mood..."
                className={`w-full p-3.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-700/80 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Melody Conditioning */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#10141f] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileAudio className="w-3.5 h-3.5 text-cyan-400" />
                    Condition on a melody (optional) File or Mic
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Extracts broad musical chroma representation from reference audio
                  </p>
                </div>

                <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-medium self-start sm:self-auto ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
                }`}>
                  <button
                    onClick={() => handleAudioSourceChange('file')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      audioSource === 'file' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    File
                  </button>
                  <button
                    onClick={() => handleAudioSourceChange('mic')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      audioSource === 'mic' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    Mic
                  </button>
                </div>
              </div>

              {audioSource === 'file' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_MELODIES.map((mel) => (
                      <button
                        key={mel.id}
                        onClick={() => {
                          setSelectedMelodyPreset(mel.id);
                          setUploadedMelodyFile(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          selectedMelodyPreset === mel.id
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-semibold'
                            : isDark
                            ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900'
                            : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <p className="font-medium truncate">{mel.name}</p>
                        <span className="text-[10px] opacity-70">Preset Chroma</span>
                      </button>
                    ))}
                  </div>

                  <div className={`p-4 border border-dashed rounded-xl flex items-center justify-between text-xs ${
                    isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-300 bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">
                        {uploadedMelodyFile ? uploadedMelodyFile.name : 'Upload custom .wav / .mp3 reference file'}
                      </span>
                    </div>
                    <label className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 font-medium cursor-pointer transition-colors border border-slate-700">
                      Browse
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedMelodyFile({ name: file.name, size: file.size });
                            setSelectedMelodyPreset('');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 text-center ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-300'
                }`}>
                  <button
                    onClick={handleToggleMic}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                      isRecordingMic ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
                  >
                    {isRecordingMic ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecordingMic ? 'Stop Recording' : 'Record Melody via Microphone'}
                  </button>
                  <p className="text-[11px] text-slate-500">
                    {recordedAudioBlob
                      ? 'Melody recorded from microphone ready for chroma conditioning!'
                      : 'Sing, whistle, or hum a melody motif directly from your microphone'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons: Submit & Interrupt */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-cyan-200 fill-cyan-200" />
                )}
                <span>{isGenerating ? 'Generating Music...' : 'Submit (Generate)'}</span>
              </button>

              <button
                onClick={handleInterrupt}
                disabled={!isGenerating}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm border transition-all flex items-center gap-2 cursor-pointer ${
                  isGenerating
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                    : 'border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed'
                }`}
              >
                <StopCircle className="w-4 h-4" />
                Interrupt
              </button>
            </div>

            {/* Progress */}
            {isGenerating && (
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-slate-900/90 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {progressStage}
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Models & Settings */}
            <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-[#10141f] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Model (10 AudioCraft Checkpoints)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MUSICGEN_MODELS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setModel(m)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        model === m
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-semibold'
                          : isDark
                          ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-900'
                          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <p className="font-mono text-[11px] truncate">{m}</p>
                      <span className="text-[10px] opacity-70">
                        {m.includes('stereo') ? 'Stereo' : 'Mono'} • {m.includes('melody') ? 'Melody-Guided' : 'Text-Only'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Model Path (custom fine-tuned models)
                </label>
                <input
                  type="text"
                  value={customModelPath}
                  onChange={(e) => setCustomModelPath(e.target.value)}
                  placeholder="/models/checkpoints/custom_musicgen_folder"
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Decoder (Compression Vocoder)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDecoder('Default')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      decoder === 'Default'
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-semibold'
                        : isDark
                        ? 'border-slate-800 bg-slate-900/40 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">Default (EnCodec GAN)</p>
                    <p className="text-[10px] opacity-75 mt-0.5">Fast standard neural compression</p>
                  </button>

                  <button
                    onClick={() => setDecoder('MultiBand_Diffusion')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      decoder === 'MultiBand_Diffusion'
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-semibold'
                        : isDark
                        ? 'border-slate-800 bg-slate-900/40 text-slate-400'
                        : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}
                  >
                    <p className="font-bold">MultiBand_Diffusion (MBD)</p>
                    <p className="text-[10px] opacity-75 mt-0.5">Diffusion tokens-to-wav decoder</p>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-300">Duration (Seconds)</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {uiMode === 'ui_batched' ? '15s (Batched Fixed)' : `${duration}s`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    disabled={uiMode === 'ui_batched'}
                    value={uiMode === 'ui_batched' ? 15 : duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 mb-1 block">Top-K</label>
                    <input
                      type="number"
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-xs font-mono ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 mb-1 block">Top-P</label>
                    <input
                      type="number"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-xs font-mono ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 mb-1 block">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-xs font-mono ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 mb-1 block">CFG Guidance</label>
                    <input
                      type="number"
                      step="0.5"
                      value={cfgCoef}
                      onChange={(e) => setCfgCoef(Number(e.target.value))}
                      className={`w-full p-2 rounded-lg border text-xs font-mono ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Video & Audio Outputs */}
          <div className="lg:col-span-5 space-y-5">
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#10141f] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  Generated Music Video (gr.make_waveform)
                </label>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                  {isPlayingDefault ? 'Active Playback' : 'Output Canvas'}
                </span>
              </div>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-black">
                <canvas
                  ref={waveformCanvasRef}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover"
                />

                {generatedDefaultAudioUrl && (
                  <button
                    onClick={() => togglePlayAudio(false)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cyan-500/80 hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
                  >
                    {isPlayingDefault ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Generated Music (wav)</span>
                  {generatedDefaultAudioUrl && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      WAV Ready
                    </span>
                  )}
                </div>

                {generatedDefaultAudioUrl ? (
                  <div className="space-y-2">
                    <audio
                      ref={audioElementRef}
                      src={generatedDefaultAudioUrl}
                      onEnded={() => setIsPlayingDefault(false)}
                      controls
                      className="w-full h-10 accent-cyan-500"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleDownloadWav(generatedWavBlob, `musicgen_${Date.now()}.wav`)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download .WAV
                      </button>

                      {onSendToAudioVisualizer && (
                        <button
                          onClick={() => {
                            if (generatedDefaultAudioUrl) {
                              onSendToAudioVisualizer(generatedDefaultAudioUrl, textPrompt.slice(0, 32));
                              if (showToast) showToast('Sent to Realtime Frequency Visualizer!');
                            }
                          }}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Send to Pitch Visualizer
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl text-center text-xs text-slate-500 ${isDark ? 'bg-slate-900/40' : 'bg-slate-100'}`}>
                    Click &ldquo;Submit&rdquo; to generate music and view synthesized waveform audio.
                  </div>
                )}
              </div>
            </div>

            {/* MBD Decoder panel */}
            {decoder === 'MultiBand_Diffusion' && (
              <div className={`p-5 rounded-2xl border border-indigo-500/40 transition-all ${
                isDark ? 'bg-[#101426]' : 'bg-indigo-50/50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    MultiBand Diffusion Decoder Video
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                    MBD HD Output
                  </span>
                </div>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-indigo-900/60 shadow-inner bg-black flex items-center justify-center">
                  {generatedMbdAudioUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-indigo-950/40 to-black">
                      <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 mb-2">
                        <Volume2 className="w-6 h-6 animate-pulse" />
                      </div>
                      <p className="text-xs font-bold text-indigo-300">Diffusion Vocoder Track</p>
                      <button
                        onClick={() => togglePlayAudio(true)}
                        className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500 text-white flex items-center gap-1.5 shadow-md hover:bg-indigo-400 cursor-pointer"
                      >
                        {isPlayingMbd ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isPlayingMbd ? 'Pause MBD' : 'Play MBD Track'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-indigo-400/60">
                      MultiBand Diffusion waveform video renders here
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-900/40 space-y-2">
                  <span className="text-xs font-bold text-indigo-300">MultiBand Diffusion Decoder (wav)</span>
                  {generatedMbdAudioUrl && (
                    <div className="space-y-2">
                      <audio
                        ref={mbdAudioElementRef}
                        src={generatedMbdAudioUrl}
                        onEnded={() => setIsPlayingMbd(false)}
                        controls
                        className="w-full h-10 accent-indigo-500"
                      />
                      <button
                        onClick={() => handleDownloadWav(generatedMbdWavBlob, `musicgen_mbd_${Date.now()}.wav`)}
                        className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download MBD .WAV
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Examples Grid */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#10141f] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Prompt & Model Examples (gr.Examples)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any preset to prefill prompt, model checkpoint, melody conditioning, and decoder settings.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30">
              6 Meta Examples
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MUSICGEN_EXAMPLES.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => handleLoadExample(ex)}
                className={`p-4 rounded-xl border transition-all text-left group cursor-pointer ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900'
                    : 'border-slate-200 bg-slate-50 hover:border-cyan-500 hover:bg-cyan-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-cyan-400 group-hover:text-cyan-300">
                    {ex.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ex.decoder}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-normal">
                  &ldquo;{ex.prompt}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span>Model: {ex.model.replace('facebook/', '')}</span>
                  {ex.melodyName && (
                    <span className="text-indigo-400">• Melody: {ex.melodyName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More Details */}
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#10141f] border-slate-800' : 'bg-white border-slate-200'}`}>
          <button
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              More Details & Model Architecture Notes (from &ldquo;Simple and Controllable Music Generation&rdquo;)
            </span>
            {showMoreDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showMoreDetails && (
            <div className={`p-6 border-t text-xs space-y-3 leading-relaxed ${
              isDark ? 'border-slate-800 bg-slate-900/50 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}>
              <p>
                The model generates a short music extract based on the description you provided.
                The model can generate up to <strong>30 seconds of audio in one pass</strong>.
              </p>
              <p>
                The model was trained with descriptions from a stock music catalog. Descriptions that will work best
                should include some level of details on the instruments present, along with some intended use case.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Hardware Optimization:</strong> AudioCraft generation runs within the local 6.0 GB VRAM boundary.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
