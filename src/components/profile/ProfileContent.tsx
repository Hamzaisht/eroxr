import { Card } from "@/components/ui/card";

interface ProfileContentProps {
  profile: any;
}

export const ProfileContent = ({ profile }: ProfileContentProps) => {
  return (
    <div className="space-y-6">
      {profile.bio && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-muted-foreground">{profile.bio}</p>
        </Card>
      )}

      {profile.interests && profile.interests.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};