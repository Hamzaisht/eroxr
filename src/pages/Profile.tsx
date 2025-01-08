import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-dark">
      <ProfileContainer
        id={id}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}