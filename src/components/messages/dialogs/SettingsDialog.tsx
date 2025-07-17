import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings, Bell, Shield, Palette, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({
  isOpen,
  onClose
}: SettingsDialogProps) => {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    autoDownload: false,
    readReceipts: true,
    typingIndicators: true,
    messagePreview: true,
    darkMode: true,
    fontSize: [16],
    messageLimit: [100]
  });
  
  const { toast } = useToast();

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage with real-time feedback
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    
    // Apply settings immediately to DOM for instant visual feedback
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update font size immediately
    document.documentElement.style.setProperty('--chat-font-size', `${settings.fontSize[0]}px`);
    
    toast({
      title: "Settings saved",
      description: "Your chat preferences have been updated instantly",
    });
    onClose();
  };

  const settingSections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Enable notifications",
          key: "notifications",
          type: "switch",
          description: "Receive notifications for new messages"
        },
        {
          label: "Sound alerts",
          key: "soundEnabled", 
          type: "switch",
          description: "Play sound when receiving messages"
        },
        {
          label: "Message preview",
          key: "messagePreview",
          type: "switch",
          description: "Show message content in notifications"
        }
      ]
    },
    {
      title: "Privacy",
      icon: Shield,
      items: [
        {
          label: "Read receipts",
          key: "readReceipts",
          type: "switch",
          description: "Let others know when you've read their messages"
        },
        {
          label: "Typing indicators",
          key: "typingIndicators",
          type: "switch",
          description: "Show when you're typing"
        },
        {
          label: "Auto-download media",
          key: "autoDownload",
          type: "switch",
          description: "Automatically download images and videos"
        }
      ]
    },
    {
      title: "Display",
      icon: Palette,
      items: [
        {
          label: "Font size",
          key: "fontSize",
          type: "slider",
          min: 12,
          max: 24,
          description: "Adjust message text size"
        },
        {
          label: "Messages per page",
          key: "messageLimit",
          type: "slider",
          min: 50,
          max: 200,
          step: 25,
          description: "Number of messages to load at once"
        }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/20 backdrop-blur-xl text-white max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chat Settings
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Customize your chat experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-3"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <section.icon className="h-5 w-5" />
                {section.title}
              </h3>
              
              <div className="space-y-4 pl-7">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-white font-medium">{item.label}</label>
                      <p className="text-sm text-white/60">{item.description}</p>
                    </div>
                    
                    <div className="ml-4">
                      {item.type === 'switch' ? (
                        <Switch
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        />
                      ) : item.type === 'slider' ? (
                        <div className="w-24">
                          <Slider
                            value={settings[item.key as keyof typeof settings] as number[]}
                            onValueChange={(value) => updateSetting(item.key, value)}
                            min={item.min || 0}
                            max={item.max || 100}
                            step={item.step || 1}
                            className="w-full"
                          />
                          <div className="text-xs text-white/60 text-center mt-1">
                            {(settings[item.key as keyof typeof settings] as number[])[0]}
                            {item.key === 'fontSize' && 'px'}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};