
import { ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
