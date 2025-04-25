
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollAnimationConfig {
  startOffset?: number;
  endOffset?: number;
  inputRange?: number[];
  outputRange?: number[];
}

export function useScrollAnimation(config: ScrollAnimationConfig = {}) {
  const { 
    startOffset = 0,
    endOffset = 300,
    inputRange = [0, 300],
    outputRange = [1, 0]
  } = config;

  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, 
    [startOffset, endOffset], 
    [outputRange[0], outputRange[1]]
  );

  const scale = useTransform(scrollY,
    [startOffset, endOffset],
    [1, 0.95]
  );

  const y = useTransform(scrollY,
    [startOffset, endOffset],
    [0, 50]
  );

  return { opacity, scale, y, scrollY };
}
