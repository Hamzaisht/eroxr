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
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-luxury-gradient opacity-90" />
      
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full opacity-20"
        style={{ filter: 'blur(1px)' }}
      >
        {/* Nordic countries outline - More detailed path */}
        <path
          d="M400,100 Q500,50 600,100 T800,200 Q850,300 850,400 T800,600 Q700,700 600,750 T400,750 Q300,700 200,600 T150,400 Q150,300 200,200 T400,100"
          className="fill-none stroke-luxury-primary/30 stroke-2"
          filter="url(#glow)"
        />
        
        {/* Add a subtle glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid pattern for background */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path 
            d="M 40 0 L 0 0 0 40" 
            fill="none" 
            stroke="rgba(155, 135, 245, 0.1)" 
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Animated connection lines with gradient */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(155, 135, 245, 0.4)"/>
            <stop offset="100%" stopColor="rgba(217, 70, 239, 0.4)"/>
          </linearGradient>
        </defs>
        
        {cities.map((city, index) => (
          <g key={city.id}>
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
                opacity: [0.2, 0.5, 0.2],
                transition: { 
                  duration: 3,
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
            
            {/* Pulse effect for city points */}
            <motion.circle
              cx={300 + Math.random() * 400}
              cy={300 + Math.random() * 400}
              r="20"
              className="fill-luxury-primary/10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 2],
                opacity: [0.5, 0],
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
              className="fill-luxury-accent cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                transition: { 
                  duration: 2,
                  delay: index * 0.1,
                  repeat: Infinity
                }
              }}
              whileHover={{ scale: 1.5 }}
              onMouseEnter={() => setActiveCity(city)}
              onMouseLeave={() => setActiveCity(null)}
            />
          </g>
        ))}
      </svg>
      
      {/* Enhanced city tooltip */}
      {activeCity && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute pointer-events-auto bg-luxury-darker/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-luxury-primary/20"
          style={{ 
            left: `${300 + Math.random() * 400}px`,
            top: `${300 + Math.random() * 400}px`
          }}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-luxury-primary font-semibold">{activeCity.city_name}</h3>
            <p className="text-sm text-luxury-neutral/80">{activeCity.country}</p>
            {activeCity.population && (
              <p className="text-xs text-luxury-neutral/60">
                Population: {activeCity.population.toLocaleString()}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};