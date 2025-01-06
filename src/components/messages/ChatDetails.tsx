import { X, Bell, Calendar, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatDetailsProps {
  userId: string;
  onClose: () => void;
}

export const ChatDetails = ({ userId, onClose }: ChatDetailsProps) => {
  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="border-l border-luxury-neutral/10 bg-luxury-dark/50">
      <div className="p-4 border-b border-luxury-neutral/10 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-luxury-neutral">Chat Details</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-luxury-neutral/5 rounded-full"
        >
          <X className="w-5 h-5 text-luxury-neutral/70" />
        </button>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Bell, label: "Mute" },
              { icon: Calendar, label: "Schedule" },
              { icon: Trash2, label: "Delete" },
            ].map((action, i) => (
              <button
                key={i}
                className="flex flex-col items-center p-3 space-y-1 rounded-lg hover:bg-luxury-neutral/5"
              >
                <action.icon className="w-5 h-5 text-luxury-neutral/70" />
                <span className="text-xs text-luxury-neutral/70">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Shared Media */}
          <div>
            <h4 className="text-sm font-medium text-luxury-neutral mb-3">
              Shared Media
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-luxury-neutral/5"
                />
              ))}
            </div>
          </div>

          {/* Shared Files */}
          <div>
            <h4 className="text-sm font-medium text-luxury-neutral mb-3">
              Shared Files
            </h4>
            <div className="space-y-2">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-luxury-neutral/5 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded bg-luxury-neutral/10" />
                  <div>
                    <p className="text-sm text-luxury-neutral">Document.pdf</p>
                    <p className="text-xs text-luxury-neutral/50">1.2 MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};