
import { useCallback, useRef, useState, useEffect } from 'react';

type SoundType = 'click' | 'hover' | 'like' | 'notification' | 'success';

export function useSoundEffects(
  defaultEnabled: boolean = true,
  defaultVolume: number = 0.5
) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [volume, setVolume] = useState(defaultVolume);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});
  const audioContext = useRef<AudioContext | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  // Initialize audio context on user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContext.current = new AudioContext();
        gainNode.current = audioContext.current.createGain();
        gainNode.current.connect(audioContext.current.destination);
        gainNode.current.gain.value = volume;
      } catch (e) {
        console.warn('Web Audio API not supported in this browser');
      }
    }
    
    // Resume audio context if it was suspended
    if (audioContext.current?.state === 'suspended') {
      audioContext.current.resume();
    }
  }, [volume]);

  // Set up volume when it changes
  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume;
    }
  }, [volume]);

  // Create optimized play function
  const playSound = useCallback((
    soundType: SoundType,
    options: { volume?: number } = {}
  ) => {
    if (!enabled) return;
    
    // Initialize audio context if needed
    initAudioContext();
    
    // Map of sound types to their URL or base64 data
    const sounds: Record<SoundType, string> = {
      click: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAGUACFhYWFhYWFhYWFhYWFhYWFhYWFvb29vb29vb29vb29vb29vb29vb3n5+fn5+fn5+fn5+fn5+fn5+fn5/////////////////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABSAJAJAQgAAgAAAA+hhcDQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=',
      hover: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAEAAAHWgB1dXV1dXV1dXV1dXV1dXV1dXV1dXWkpKSkpKSkpKSkpKSkpKSkpKSkpKTT09PT09PT09PT09PT09PT09PT09P///////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABSAJAKgQgAAgAAAB1rS4Nj5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tAxAADwAABpAAAACAAADSAAAAEVGF4RWB3f//4GY//aMs15a31lZtw5wMT5dlpEPqQUH2xfX//p9AQEAAAMDLH22Aer0SAerkn//QTLlUz//8VbkAll3T//9N6IIl0IQCCjP//6R/dY87SBTL/C//gNBAPxucAD7nEcnpDHygLhaIQU4pPzUp/P5lyFTD//0KFBI8vOgKO1ER///u4JO2DMaS9M////////dMQ57lUNf7hh///1KPi71ERWt////rJkn3////DmWe//iHDG6w//qJGmAOWUAQw+DlKiglCOJZS///6boaEN//+IcMbrD//+okAoUByk0JSBIEgwEhUExZ8d///woOjzH//9timIJ//2Yi//rZSLIQoEOvhHbkCd///NlZWf//8iYAByw4gyUI2pelC4ZqlPX///ZblJv//7AjRuGABKCwwKZSIouISaWez////1yu0wLZzlv//9LgWUaIThBo8BPgMYkyBJBTaqq1AP//WVQGhX//wE2JamJRrf6FGv/7QsQAAO0EARAQAAAgAAA0gAAABP/+B6kqXVVAuXWY//6Fq4KTRdvX/+BSE6X2XEI1v9ajX//CoFCoRgJAEmOBFpa11FQLl1mP//oWrgpNF29f/4FIfvV/gXOyyy9aFz//agvggGYVYiTRJZ2uBcusxr//0aigpPB54v/nITm7I3pgNwYDRVJraLZbRIrHax///u2FFoxAJQUSDAKEekR4/LBYl//9ddIp9VgJki4vr/+JEXeioK6Z0/423rMOiYtqrX//8SYsQ0MgpEXfAQAx8BgCD9YQCgH///F52JhyyyCdOuXOgSA4Dztv//9v/',
      like: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAFhpbmcAAAAPAAAAAgAACFEAhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoa8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8//////////////////////////////////////////////////////////////////8AAAAATGF2ZgA0LjE3AAAAAAAAAAAAAAAAJAAAAAAAAAAAUQiRffbZAAAAAAAAAAAAAAAAAAAAAP/jWAAAAAAAAAAAABUYXJ0dXJvIFPDoW5jaGV6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+NowAAPil4GWmGSYpsxRdN5GlgBIEmSJCZTVdkGQDYADIBiDekdIbPXGJq4xjey98fDuvlH+nvDxiDYETE2M/+MnSG23nK+TZQr/5TKO6/YLlf0TpqqpnH5iJx8AxCYZxAY5wMdOlL5/qO5EH1AyBwP4YCEjwgxMIeB6REExw/IX6hzUE2qT0xwO7mwRoGxN8kn5HwypQ3r1DBwRHOYRDKoZ0youXJ4UKyIx1i0gjCF1EAGWA6EBbS4TyXlAJC2uT8IZcCIo8y0JwAA7qveefLlm9vO4k44wdJezO4q15+2e132qrbPN39id9mq//SEb/6pwxXl//7R9u8Tllf9IVkmPZ9///qSQfBbq+TWSv/+NqwAAOxcyZJlGGKmJuV9bBpL1W0z5xggIl27/////pSMWh+r42GzkciRAoA1RJg602dgYXb//////9LoMQoEQFFG8LSkIhEFFFeFFEFyOutwEDBApDUIRGKJiFhAuCbNufpTf8v//////96kxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=',
      notification: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAAGhQB2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnaNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY24uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLj///////////////////////////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABSAJAUwQgAAgAAABkWyZtEhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7kMQAAAe0fWfWhgAgwY+r+tDABWRlUXJJLLur2VJJFOT1JmTpYUBYC4EhQHAJAcCs3sbGuAUBvC+zFP1A47o8XmKvlOiQbQQMs0jQw2FLDTV+yT2f1O01o/hwhb2UVaXkG5CZR+xn/LI8h0eV///zllkkiVV2iR8ouSsSh0ESc5BF///+Ss45yHyXLJJEifJE3/////bSKKKre0TOSmfMZnGJMFnIkoGSB4ozGb///////pZVkkUx5JseGpZV4TYVhaUJZJk2VMpZVfsLP///////5VJWldqs5VfNklUk7muklVqRUUVJLOVKFmSvP///8qaFWDIRJQYVAoDShPdCkzL//2UZJHk3ZJYESeUsyo////////////////ZBRr////+GUyVv/+AhIxU+GIdmTIoikTJvuZCYWBgIyeSlJAZK5ugs2m13////9oJ4rJnaJK6lSmTYqEzOkqykcmmRQKHjImCCDHE////////u////5ICQkBUL0Tj5WlSXiWEgggQgMCAmikxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uAxOGADnTLY/z2gCI2GWmDjGtwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      success: 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAHAAAJhgAvLy8vLy8vLy8vLy8vLy8vLy8vL01NTU1NTU1NTU1NTU1NTU1NTU1NbW1tbW1tbW1tbW1tbW1tbW1tbW2KioqKioqKioqKioqKioqKioqKisLCwsLCwsLCwsLCwsLCwsLCwsL///////////////////////////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABQgJAUkQgAAgAAACYbsxJarAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
    };
    
    try {
      if (!audioCache.current[soundType]) {
        // Cache the audio element for future use
        audioCache.current[soundType] = new Audio(sounds[soundType]);
        audioCache.current[soundType].volume = options.volume || volume;
        audioCache.current[soundType].preload = 'auto';
      }
      
      // Reset and play sound
      const audio = audioCache.current[soundType];
      audio.currentTime = 0;
      audio.volume = options.volume || volume;
      
      // Use Web Audio API if available for better performance
      if (audioContext.current && gainNode.current) {
        const source = audioContext.current.createMediaElementSource(audio);
        source.connect(gainNode.current);
        audio.play().catch(e => console.warn('Error playing sound:', e));
      } else {
        // Fallback to standard audio playback
        audio.play().catch(e => console.warn('Error playing sound:', e));
      }
    } catch (error) {
      console.warn('Error playing sound effect:', error);
    }
  }, [enabled, volume, initAudioContext]);

  const playClickSound = useCallback(() => playSound('click'), [playSound]);
  const playHoverSound = useCallback(() => playSound('hover', { volume: 0.2 }), [playSound]);
  const playLikeSound = useCallback(() => playSound('like'), [playSound]);
  const playNotificationSound = useCallback(() => playSound('notification'), [playSound]);
  const playSuccessSound = useCallback(() => playSound('success'), [playSound]);

  const toggleEnabled = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const setAudioVolume = useCallback((newVolume: number) => {
    setVolume(Math.min(1, Math.max(0, newVolume)));
  }, []);

  return {
    enabled,
    volume,
    toggleEnabled,
    setVolume: setAudioVolume,
    playSound,
    playClickSound,
    playHoverSound,
    playLikeSound,
    playNotificationSound,
    playSuccessSound
  };
}
