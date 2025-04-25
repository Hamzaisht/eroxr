
import { useState, useEffect } from 'react';

interface TypeOptions {
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
  onComplete?: () => void;
}

export const useTypingEffect = (
  text: string,
  options: TypeOptions = {}
) => {
  const {
    speed = 50,
    delay = 0,
    cursor = true,
    loop = false,
    onComplete
  } = options;
  
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsDone(false);
  }, [text]);
  
  useEffect(() => {
    let timeout: number;
    let charIndex = 0;
    
    const startTyping = () => {
      setIsTyping(true);
      
      timeout = window.setTimeout(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.substring(0, charIndex + 1));
          charIndex++;
          timeout = window.setTimeout(startTyping, speed);
        } else {
          setIsTyping(false);
          setIsDone(true);
          
          if (onComplete) {
            onComplete();
          }
          
          if (loop) {
            timeout = window.setTimeout(() => {
              setDisplayedText('');
              charIndex = 0;
              startTyping();
            }, 2000);
          }
        }
      }, charIndex === 0 ? delay : speed);
    };
    
    startTyping();
    
    return () => clearTimeout(timeout);
  }, [text, speed, delay, loop, onComplete]);
  
  const cursorElement = (isTyping || (!isDone && displayedText === '')) && (
    <span className="animate-cursor">|</span>
  );

  return {
    text: displayedText,
    isTyping,
    isDone,
    cursor: cursor && isTyping,
    element: cursor ? (
      <span>
        {displayedText}
        {cursorElement}
      </span>
    ) : displayedText
  };
};
