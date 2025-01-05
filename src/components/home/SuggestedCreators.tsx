import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const SuggestedCreators = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-luxury-neutral">Suggestions</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-luxury-neutral/60 hover:text-luxury-primary"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-center gap-3 rounded-lg p-2 hover:bg-luxury-neutral/5 transition-all cursor-pointer"
          >
            <Avatar className="h-12 w-12 ring-2 ring-luxury-primary/20">
              <AvatarImage src={`https://source.unsplash.com/random/100x100?portrait=${i}`} />
              <AvatarFallback className="bg-luxury-primary/20">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-luxury-neutral truncate">Creator Name</p>
                <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                  New
                </Badge>
              </div>
              <p className="text-sm text-luxury-neutral/60 truncate">Professional Model</p>
            </div>
            <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
              onClick={() => {
                toast({
                  title: "Following",
                  description: "You are now following this creator",
                });
              }}
            >
              Follow
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};