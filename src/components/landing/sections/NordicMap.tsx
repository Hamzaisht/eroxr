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
        {/* Nordic countries outline */}
        <path
          d="M500,200 L700,300 L800,500 L700,700 L500,800 L300,700 L200,500 L300,300 Z"
          className="fill-none stroke-luxury-primary/30 stroke-2"
        />
        
        {/* Animated connection lines */}
        {cities.map((city, index) => (
          <motion.line
            key={city.id}
            x1="500"
            y1="500"
            x2={300 + Math.random() * 400}
            y2={300 + Math.random() * 400}
            className="stroke-luxury-accent/20"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 0.5,
              transition: { 
                duration: 2,
                delay: index * 0.1,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
        
        {/* City points */}
        {cities.map((city, index) => (
          <motion.circle
            key={city.id}
            cx={300 + Math.random() * 400}
            cy={300 + Math.random() * 400}
            r="4"
            className="fill-luxury-primary cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.5, 1],
              transition: { 
                duration: 2,
                delay: index * 0.1,
                repeat: Infinity
              }
            }}
            onMouseEnter={() => setActiveCity(city)}
            onMouseLeave={() => setActiveCity(null)}
          />
        ))}
      </svg>
      
      {/* City tooltip */}
      {activeCity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-auto bg-luxury-darker/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-luxury-primary/20"
          style={{ 
            left: `${300 + Math.random() * 400}px`,
            top: `${300 + Math.random() * 400}px`
          }}
        >
          <h3 className="text-luxury-primary font-semibold">{activeCity.city_name}</h3>
          <p className="text-sm text-luxury-neutral/80">{activeCity.country}</p>
          {activeCity.population && (
            <p className="text-xs text-luxury-neutral/60">
              Population: {activeCity.population.toLocaleString()}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};