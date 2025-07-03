import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  newMessage: string;
  sending: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onMediaClick: () => void;
  onVoiceClick: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  newMessage,
  sending,
  onMessageChange,
  onSendMessage,
  onMediaClick,
  onVoiceClick,
  onKeyPress
}: ChatInputProps) => {
  return (
    <motion.div 
      className="relative z-10 p-6 border-t border-white/10 bg-white/[0.02] backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Transmission indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="flex items-end gap-4">
        {/* Attachment button */}
        <button 
          onClick={onMediaClick}
          className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Paperclip className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
        </button>

        {/* Voice button */}
        <button 
          onClick={onVoiceClick}
          className="group relative overflow-hidden p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-all duration-300 hover:scale-105 mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Mic className="h-4 w-4 text-white/70 group-hover:text-white relative z-10" />
        </button>
        
        {/* Message input container */}
        <div className="flex-1 relative">
          <div className="relative group">
            {/* Input field */}
            <textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={onKeyPress}
              disabled={sending}
              rows={1}
              className="w-full resize-none px-6 py-4 pr-16 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/[0.12] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/20"
              style={{ 
                minHeight: '56px',
                maxHeight: '120px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            
            {/* Emoji button */}
            <button className="absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 group">
              <Smile className="h-4 w-4 text-white/60 group-hover:text-white" />
            </button>
            
            {/* Neural transmission lines */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '200ms' }} />
            </div>
          </div>
        </div>
        
        {/* Send button */}
        <button 
          onClick={onSendMessage} 
          disabled={!newMessage.trim() || sending}
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 disabled:from-white/10 disabled:to-white/10 p-4 rounded-xl border-0 shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:shadow-none mb-2"
        >
          {/* Quantum transmission effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          
          {/* Button content */}
          <div className="relative z-10 flex items-center justify-center">
            {sending ? (
              <div className="relative">
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                <div className="absolute inset-0 animate-ping h-5 w-5 border border-white/20 rounded-full" />
              </div>
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
          </div>
          
          {/* Transmission ready indicator */}
          {!sending && newMessage.trim() && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          )}
        </button>
      </div>
      
      {/* Neural activity indicator */}
      <div className="flex items-center justify-center mt-4 gap-2">
        <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-purple-500/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </motion.div>
  );
};