import { useCallback } from 'react';

type SoundType =
  | 'click'
  | 'spin'
  | 'confetti'
  | 'case-open'
  | 'reward'
  | 'activity'
  | 'banker'
  | 'deal'
  | 'no-deal'
  | 'swap'
  | 'drumroll'
  | 'fanfare';

/**
 * Simple sound hook using Web Audio API
 * Generates basic tones for feedback until real sound files are added
 */
export const useSound = () => {
  const playSound = useCallback((type: SoundType) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different tones for different actions
      switch (type) {
        case 'click':
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        case 'spin':
          // Ticking sound simulation
          oscillator.frequency.value = 1200;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.05);
          break;

        case 'confetti':
          oscillator.frequency.value = 1500;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'case-open':
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'reward':
          // Happy high tone
          oscillator.frequency.value = 1000;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'activity':
          // Lower tone
          oscillator.frequency.value = 400;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'banker':
          // Phone ring simulation
          oscillator.frequency.value = 900;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.5);
          break;

        case 'deal':
          // Success sound
          oscillator.frequency.value = 1200;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'no-deal':
          // Confident sound
          oscillator.frequency.value = 700;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'swap':
          // Whoosh sound
          oscillator.frequency.value = 500;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.25);
          break;

        case 'drumroll':
          // Rapid low tones
          const interval = setInterval(() => {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 200;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          }, 50);
          setTimeout(() => clearInterval(interval), 1000);
          break;

        case 'fanfare':
          // Victory sound
          [800, 1000, 1200, 1500].forEach((freq, index) => {
            setTimeout(() => {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = freq;
              gain.gain.value = 0.15;
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            }, index * 100);
          });
          break;

        default:
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      // Silently fail if audio context not supported
      console.warn('Sound not supported:', error);
    }
  }, []);

  return { playSound };
};
