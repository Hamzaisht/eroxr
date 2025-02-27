
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  iconColor?: string;
  delay?: number;
  showTooltip?: boolean;
  tooltipContent?: string;
}

export const StatCard = ({
  icon: Icon,
  value,
  label,
  iconColor = "text-white",
  delay = 0,
  showTooltip = false,
  tooltipContent
}: StatCardProps) => {
  const Card = (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg hover:bg-luxury-darker/80 transition-colors duration-300"
      role="figure"
      aria-label={`${label}: ${value}`}
    >
      <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-white">
          {value.toLocaleString()}
        </span>
        <span className="text-sm text-luxury-neutral">
          {label}
        </span>
      </div>
    </motion.div>
  );

  if (showTooltip && tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {Card}
          </TooltipTrigger>
          <TooltipContent className="bg-luxury-darker border-luxury-primary/20 text-white" role="tooltip">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return Card;
};
