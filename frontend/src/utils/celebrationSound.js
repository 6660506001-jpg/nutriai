export function playCelebrationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const playTone = (frequency, startOffset, duration) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      gain.connect(ctx.destination);

      const start = ctx.currentTime + startOffset;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    };

    playTone(523.25, 0, 0.14);
    playTone(659.25, 0.1, 0.16);
    playTone(783.99, 0.2, 0.28);

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 900);
  } catch {
    // Browser may block audio without user gesture — ignore silently.
  }
}
