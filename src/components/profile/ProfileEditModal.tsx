import { X } from "lucide-react";
import { ProfileForm } from "./ProfileForm";

interface ProfileEditModalProps {
  onSave: () => void;
  onClose: () => void;  // Add onClose prop
}

export const ProfileEditModal = ({ onSave, onClose }: ProfileEditModalProps) => {
  return (
    <div className="fixed inset-0 bg-luxury-darker/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-luxury-dark rounded-xl p-6 shadow-2xl border border-luxury-primary/10 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-luxury-primary/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-luxury-neutral" />
          </button>
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gradient">Edit Profile</h1>
          </div>
          <ProfileForm onSave={onSave} />
        </div>
      </div>
    </div>
  );
};