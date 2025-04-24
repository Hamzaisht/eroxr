
import { useRef, useEffect, memo } from "react";
import { motion, useMotionValue } from "framer-motion";

export const BackgroundEffects = memo(() => {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const requestRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInitializedRef = useRef<boolean>(false);
  
  // Set up minimal mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);
  
  // Initialize WebGL only once when element is visible
  useEffect(() => {
    // Early return if already initialized or canvas not ready
    if (hasInitializedRef.current || !canvasRef.current) return;
    
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvasRef.current.getContext('webgl', { 
        alpha: true,
        antialias: false, // Performance optimization
        powerPreference: 'low-power' // Battery optimization
      });
    } catch (e) {
      console.error("WebGL initialization failed:", e);
      return;
    }
    
    if (!gl) return;
    
    hasInitializedRef.current = true;
    
    // Set canvas dimensions
    const updateSize = () => {
      if (!canvasRef.current || !gl) return;
      
      const pixelRatio = Math.min(1.5, window.devicePixelRatio || 1);
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvasRef.current.width = width * pixelRatio;
      canvasRef.current.height = height * pixelRatio;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
      
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Create shaders - minimal for performance
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        uv.x *= aspect;
        
        // Simplified noise with reduced calculations
        vec3 color = mix(
          vec3(0.38, 0.33, 0.52), // Base color (muted primary)
          vec3(0.4, 0.35, 0.6),   // Accent color
          hash(uv * 1.5 + u_time * 0.01 + u_mouse.xy * 0.1)
        );
        
        // Gradient based on distance to mouse
        float distToMouse = length(uv - vec2(u_mouse.x * aspect, u_mouse.y)) * 2.0;
        float glow = smoothstep(1.0, 0.0, distToMouse) * 0.2;
        
        // Output simplified color with transparency
        gl_FragColor = vec4(color + glow, 0.08);
      }
    `;
    
    // Compile shaders
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      console.error("Shader compilation failed");
      return;
    }
    
    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // Create a buffer for positions
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    // Set up attributes
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Set up uniforms
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
    
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    // Animation variables
    const startTime = Date.now();
    let lastFrame = 0;
    
    // Animation loop
    const animate = (timestamp: number) => {
      // Limit to 30fps for better performance
      if (timestamp - lastFrame < 33.33) { // ~30fps
        requestRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrame = timestamp;
      
      if (!gl) return;
      
      const time = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeUniformLocation, time);
      gl.uniform2f(mouseUniformLocation, mouseX.get(), 1 - mouseY.get());
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(requestRef.current);
      
      // Cleanup resources
      if (gl) {
        gl.deleteProgram(program);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Optimized WebGL Gradient Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-70"
      />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Optimized Gradient Orbs with reduced size */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-luxury-primary/10"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -30, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 8,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-luxury-accent/10"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 30, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Main background gradient - static to avoid repaints */}
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-dark/50 via-luxury-dark/40 to-luxury-dark/50" />
    </>
  );
});

BackgroundEffects.displayName = "BackgroundEffects";
