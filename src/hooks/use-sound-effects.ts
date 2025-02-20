
import { useCallback } from 'react';

export const useSoundEffects = () => {
  const playSound = useCallback((frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Error playing sound effect:', error);
    }
  }, []);

  const playLikeSound = useCallback(() => {
    playSound(880, 0.1); // A5 note
  }, [playSound]);

  const playCommentSound = useCallback(() => {
    playSound(660, 0.1); // E5 note
  }, [playSound]);

  return {
    playLikeSound,
    playCommentSound
  };
};
