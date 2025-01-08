import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type NordicCity = {
  id: string;
  country: string;
  city_name: string;
  population: number | null;
};

const fetchNordicCities = async () => {
  const { data, error } = await supabase
    .from('nordic_cities')
    .select('*')
    .order('population', { ascending: false });
  
  if (error) throw error;
  return data as NordicCity[];
};

export const NordicMap = () => {
  const [activeCity, setActiveCity] = useState<NordicCity | null>(null);
  
  const { data: cities = [] } = useQuery({
    queryKey: ['nordic-cities'],
    queryFn: fetchNordicCities,
  });

  return (
    <div className="fixed inset-0 w-full h-full opacity-70 pointer-events-none">
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full"
        style={{ filter: 'blur(1px)' }}
      >
        {/* Nordic countries outline with enhanced glow */}
        <path
          d="M400,100 Q500,50 600,100 T800,200 Q850,300 850,400 T800,600 Q700,700 600,750 T400,750 Q300,700 200,600 T150,400 Q150,300 200,200 T400,100"
          className="fill-none stroke-luxury-primary stroke-[2]"
          filter="url(#glow)"
        />
        
        {/* Enhanced glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path 
            d="M 40 0 L 0 0 0 40" 
            fill="none" 
            stroke="rgba(155, 135, 245, 0.15)" 
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connection lines gradient */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(155, 135, 245, 0.3)"/>
            <stop offset="100%" stopColor="rgba(217, 70, 239, 0.3)"/>
          </linearGradient>
        </defs>
        
        {cities.map((city, index) => (
          <g key={city.id}>
            {/* Connection lines */}
            <motion.line
              x1="500"
              y1="500"
              x2={300 + Math.random() * 400}
              y2={300 + Math.random() * 400}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0.2, 0.4, 0.2],
                transition: { 
                  duration: 3,
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
            
            {/* City point pulse effect */}
            <motion.circle
              cx={300 + Math.random() * 400}
              cy={300 + Math.random() * 400}
              r="15"
              className="fill-luxury-primary/10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.5],
                opacity: [0.3, 0],
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }
              }}
            />
            
            {/* City point */}
            <motion.circle
              cx={300 + Math.random() * 400}
              cy={300 + Math.random() * 400}
              r="4"
              className="fill-luxury-accent"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                transition: { 
                  duration: 2,
                  delay: index * 0.1,
                  repeat: Infinity
                }
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};