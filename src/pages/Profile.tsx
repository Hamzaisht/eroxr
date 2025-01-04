import { MainNav } from "@/components/MainNav";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
};

export default Profile;