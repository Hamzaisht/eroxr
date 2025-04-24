
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const BackgroundEffects = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const requestRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Set up WebGL gradient animation
    if (canvasRef.current) {
      const gl = canvasRef.current.getContext('webgl');
        
      if (!gl) return;
      
      // Set canvas dimensions
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
      // Create shaders
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
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Based on Morgan McGuire's noise functions
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          // Four corners in 2D of a tile
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          // Smooth interpolation
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          // Mix 4 corners
          return mix(a, b, u.x) +
                  (c - a) * u.y * (1.0 - u.x) +
                  (d - b) * u.x * u.y;
        }
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float aspect = u_resolution.x / u_resolution.y;
          st.x *= aspect;
          
          // Mouse influence
          vec2 mouse = u_mouse;
          mouse.x *= aspect;
          
          float d = length(st - mouse) * 2.0;
          
          // Create noise layers
          vec2 pos = st * 3.0;
          
          float n1 = noise(pos - u_time * 0.1 + mouse * 0.5);
          float n2 = noise(pos * 2.0 - u_time * 0.15 - mouse.yx * 0.3);
          float n3 = noise(pos * 4.0 - u_time * 0.2 + mouse.xy * 0.2);
          
          float n = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
          
          // Create gradient colors
          vec3 color1 = vec3(0.38, 0.33, 0.96); // luxury-primary
          vec3 color2 = vec3(0.85, 0.27, 0.93); // luxury-accent
          
          // Mix colors based on noise and mouse
          vec3 color = mix(color1, color2, n + d * 0.2);
          
          // Output final color with opacity
          gl_FragColor = vec4(color, 0.15);
        }
      `;
      
      // Compile shaders
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);
      
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);
      
      // Create program
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);
      
      // Create a buffer for the position of the vertices
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1.0, -1.0,
           1.0, -1.0,
          -1.0,  1.0,
          -1.0,  1.0,
           1.0, -1.0,
           1.0,  1.0,
        ]),
        gl.STATIC_DRAW
      );
      
      // Get the attribute location and set it up
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Get the uniform locations
      const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
      const timeUniformLocation = gl.getUniformLocation(program, "u_time");
      const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
      
      // Set the resolution uniform
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      
      // Animation loop
      let startTime = Date.now();
      
      const animate = () => {
        const time = (Date.now() - startTime) / 1000;
        
        // Set the time uniform
        gl.uniform1f(timeUniformLocation, time);
        
        // Set the mouse position uniform
        gl.uniform2f(mouseUniformLocation, mousePosition.x, 1 - mousePosition.y);
        
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        // Request the next frame
        requestRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      
      // Handle window resize
      const handleResize = () => {
        if (!canvasRef.current) return;
        
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(requestRef.current);
      };
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      {/* WebGL Gradient Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      {/* Grid Background - No blur */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Animated Gradient Orbs - No blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-[5%] -right-[5%] h-[800px] w-[800px] rounded-full bg-luxury-primary/10"
          animate={{ 
            x: mousePosition.x * -30,
            y: mousePosition.y * -30,
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute -bottom-[5%] -left-[5%] h-[800px] w-[800px] rounded-full bg-luxury-accent/10"
          animate={{ 
            x: mousePosition.x * 30,
            y: mousePosition.y * 30,
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 7,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />
        
        {/* Additional orb */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-luxury-secondary/5"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut" 
          }}
        />
      </div>
      
      {/* Main background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-luxury-dark/50 via-luxury-dark/40 to-luxury-dark/50" 
        style={{
          opacity: Math.min(1, scrollPosition / 500)
        }}
      />
      
      {/* Subtle particle overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
      
      {/* Subtle glow at the center - No blur */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-96 bg-luxury-primary/5"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(155, 135, 245, 0.05), transparent 70%)`
        }}
      />
    </>
  );
};
