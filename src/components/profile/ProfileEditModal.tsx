import { ProfileForm } from "./ProfileForm";

interface ProfileEditModalProps {
  onSave: () => void;
}

export const ProfileEditModal = ({ onSave }: ProfileEditModalProps) => {
  return (
    <div className="fixed inset-0 bg-luxury-darker/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-luxury-dark rounded-xl p-6 shadow-2xl border border-luxury-primary/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gradient">Edit Profile</h1>
          </div>
          <ProfileForm onSave={onSave} />
        </div>
      </div>
    </div>
  );
};