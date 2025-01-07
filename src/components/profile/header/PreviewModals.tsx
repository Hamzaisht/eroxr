import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Profile } from "@/integrations/supabase/types/profile";

interface PreviewModalsProps {
  profile: Profile;
  getMediaType: (url: string) => 'video' | 'gif' | 'image';
  showAvatarPreview: boolean;
  showBannerPreview: boolean;
  setShowAvatarPreview: (show: boolean) => void;
  setShowBannerPreview: (show: boolean) => void;
}

export const PreviewModals = ({
  profile,
  getMediaType,
  showAvatarPreview,
  showBannerPreview,
  setShowAvatarPreview,
  setShowBannerPreview,
}: PreviewModalsProps) => {
  return (
    <>
      {/* Avatar Preview Modal */}
      <Dialog open={showAvatarPreview} onOpenChange={setShowAvatarPreview}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-transparent border-none">
          <VisuallyHidden>
            <div>Profile Picture Preview</div>
          </VisuallyHidden>
          {profile?.avatar_url && (
            getMediaType(profile.avatar_url) === 'video' ? (
              <video
                src={profile.avatar_url}
                className="w-full rounded-lg"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={profile.avatar_url}
                alt="Profile Picture"
                className="w-full rounded-lg"
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Banner Preview Modal */}
      <Dialog open={showBannerPreview} onOpenChange={setShowBannerPreview}>
        <DialogContent className="sm:max-w-7xl p-0 overflow-hidden bg-transparent border-none">
          <VisuallyHidden>
            <div>Profile Banner Preview</div>
          </VisuallyHidden>
          {profile?.banner_url && (
            getMediaType(profile.banner_url) === 'video' ? (
              <video
                src={profile.banner_url}
                className="w-full rounded-lg"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={profile.banner_url}
                alt="Profile Banner"
                className="w-full rounded-lg"
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};