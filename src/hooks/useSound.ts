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
  | 'fanfare'
  | 'wheel-winner';

/**
 * Simple sound hook using Web Audio API
 * Generates basic tones for feedback until real sound files are added
 */
export const useSound = () => {
  const playSound = useCallback((type: SoundType, loop: boolean = false) => {
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
          // Play actual spinning wheel sound file
          const audio = new Audio('/sounds/wheel-spin-click-slow-down-fast-101154.mp3');
          audio.volume = 0.5;
          audio.loop = loop;
          audio.play().catch((err) => console.warn('Audio playback failed:', err));
          return audio; // Return audio element so it can be stopped later

        case 'confetti':
          oscillator.frequency.value = 1500;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'case-open':
          // Play sci-fi suitcase opening sound
          const caseAudio = new Audio('/sounds/sci-fi-intro-logo-reveal-2-227275.mp3');
          caseAudio.volume = 0.6;
          caseAudio.play().catch((err) => console.warn('Case open audio playback failed:', err));
          return caseAudio;
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

        case 'wheel-winner':
          // Play tada fanfare when wheel selects a player
          const fanfareAudio = new Audio('/sounds/tada-fanfare-a-6313.mp3');
          fanfareAudio.volume = 0.6;
          fanfareAudio.play().catch((err) => console.warn('Fanfare playback failed:', err));
          return fanfareAudio;

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
