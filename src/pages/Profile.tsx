
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  if (!id) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <ProfileContainer
        id={id}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
