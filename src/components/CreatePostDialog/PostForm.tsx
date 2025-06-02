
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Globe, Lock, Users, Sparkles, EyeOff } from "lucide-react";

interface PostFormProps {
  content: string;
  setContent: (content: string) => void;
  visibility: "public" | "subscribers_only" | "private" | "hidden";
  setVisibility: (visibility: "public" | "subscribers_only" | "private" | "hidden") => void;
  characterLimit: number;
}

export const PostForm = ({
  content,
  setContent,
  visibility,
  setVisibility,
  characterLimit
}: PostFormProps) => {
  const charactersUsed = content.length;
  const warningThreshold = characterLimit * 0.9;

  const getVisibilityIcon = () => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4 text-green-400" />;
      case "subscribers_only":
        return <Users className="h-4 w-4 text-purple-400" />;
      case "private":
        return <Lock className="h-4 w-4 text-orange-400" />;
      case "hidden":
        return <EyeOff className="h-4 w-4 text-red-400" />;
      default:
        return <Globe className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <Label htmlFor="content" className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          What's on your mind?
        </Label>
        
        <div className="relative">
          <Textarea
            id="content"
            placeholder="Share your thoughts, experiences, or exclusive content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[140px] resize-none bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl backdrop-blur-sm transition-all duration-200"
            maxLength={characterLimit}
          />
          
          {/* Character Count with Progress */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
              charactersUsed > warningThreshold 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-gray-700/50 text-gray-400'
            }`}>
              {charactersUsed}/{characterLimit}
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke={charactersUsed > warningThreshold ? "#ef4444" : "#06b6d4"}
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 10}`}
                  strokeDashoffset={`${2 * Math.PI * 10 * (1 - charactersUsed / characterLimit)}`}
                  transition={{ duration: 0.3 }}
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Visibility Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <Label htmlFor="visibility" className="text-sm font-medium text-gray-300 flex items-center gap-2">
          {getVisibilityIcon()}
          Post Visibility
        </Label>
        
        <Select value={visibility} onValueChange={setVisibility}>
          <SelectTrigger className="w-full bg-white/5 border-white/10 text-white hover:border-cyan-500/50 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl backdrop-blur-sm transition-all duration-200">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent 
            className="bg-gray-900/95 border-white/10 backdrop-blur-xl shadow-2xl z-[99999]"
            position="popper"
            sideOffset={5}
          >
            <SelectItem 
              value="public" 
              className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-green-400" />
                <div>
                  <div className="font-medium">Public</div>
                  <div className="text-xs text-gray-400">Everyone can see this post</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem 
              value="subscribers_only" 
              className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-purple-400" />
                <div>
                  <div className="font-medium">Subscribers Only</div>
                  <div className="text-xs text-gray-400">Only your subscribers can see this</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem 
              value="private" 
              className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-orange-400" />
                <div>
                  <div className="font-medium">Private</div>
                  <div className="text-xs text-gray-400">Only subscribers can see this post</div>
                </div>
              </div>
            </SelectItem>
            <SelectItem 
              value="hidden" 
              className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer py-3 px-4"
            >
              <div className="flex items-center gap-3">
                <EyeOff className="h-4 w-4 text-red-400" />
                <div>
                  <div className="font-medium">Hidden</div>
                  <div className="text-xs text-gray-400">Only chosen followers can see this</div>
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
};
