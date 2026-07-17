// Web Audio API Synthesizer for NECTORA Interface Interactions
let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a short subtle digital UI click
export const playClick = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
};

// Play a short synth hover tick
export const playHoverTick = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.012, now + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {
    // Fail silently on automatic background triggers
  }
};

// Play a gorgeous sci-fi sweep when modal opens
export const playModalOpen = () => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    // Oscillator 1 (Main tone sweep)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(1000, now + 0.3);

    // Oscillator 2 (Harmonic detune)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(223, now);
    osc2.frequency.exponentialRampToValueAtTime(1003, now + 0.3);

    // Bandpass filter sweep
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2, now);
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.35);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
};

// Play a theme switch sound effect
export const playThemeSwitch = (isDarkNow) => {
  try {
    const ctx = initAudio();
    const now = ctx.currentTime;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.06);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    const osc = ctx.createOscillator();
    // Falling pitch for going to dark mode, rising pitch for going to light mode
    const startFreq = isDarkNow ? 220 : 660;
    const endFreq = isDarkNow ? 110 : 880;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.3);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.3);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
};
