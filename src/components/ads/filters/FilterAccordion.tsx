
import { useState, useEffect, ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { type FilterOptions } from "../types/dating";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Map, Calendar, Users, Award, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterAccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const FilterAccordion = ({
  title,
  defaultOpen = false,
  children
}: FilterAccordionProps) => {
  return (
    <Accordion 
      type="single" 
      collapsible 
      defaultValue={defaultOpen ? title : undefined} 
      className="w-full border-b border-luxury-primary/10 pb-2 mb-2"
    >
      <AccordionItem value={title} className="border-none">
        <AccordionTrigger className="text-sm font-medium text-luxury-neutral hover:text-luxury-primary py-2">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
