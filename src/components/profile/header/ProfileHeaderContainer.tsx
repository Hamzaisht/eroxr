
// Assume this is the correct content for ProfileHeaderContainer.tsx
import { useState } from "react";
import { ProfileHeaderActions } from "./ProfileHeaderActions";
import { ProfileHeaderBio } from "./ProfileHeaderBio";
import { ProfileHeaderInfo } from "./ProfileHeaderInfo";
import { ProfileHeaderStatus } from "./ProfileHeaderStatus";
import { ProfileHeaderSubscribe } from "./ProfileHeaderSubscribe";
import type { ProfileHeaderProps } from "../types";
import { AvailabilityStatus } from "@/utils/media/types";

export const ProfileHeaderContainer = ({ profile, isOwnProfile, isEditing, setIsEditing, availability }: ProfileHeaderProps) => {
  const [showFullBio, setShowFullBio] = useState(false);
  
  return (
    <div className="space-y-4 px-4 lg:px-6 w-full max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent text-3xl font-semibold tracking-tight">
              {profile?.username || "User"}
            </h1>
            
            {profile?.is_verified && (
              <div className="flex items-center justify-center bg-luxury-primary/10 p-1 rounded-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <ProfileHeaderStatus 
              isOwnProfile={isOwnProfile} 
              availability={availability || AvailabilityStatus.ONLINE} 
            />
            
            <div className="flex items-center gap-1 text-luxury-neutral/60 text-sm">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0ZM6.92857 3.21429H8.07143V7.7489L11.3943 9.7943L10.8225 10.7143L7.5 8.66786V3.21429Z" fill="currentColor"/>
              </svg>
              <span>Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "recently"}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isOwnProfile && (
            <ProfileHeaderActions profile={profile} isOwnProfile={isOwnProfile} />
          )}
          
          {isOwnProfile && (
            <ProfileHeaderActions profile={profile} isOwnProfile={isOwnProfile} isEditing={isEditing} setIsEditing={setIsEditing} />
          )}
          
          <ProfileHeaderSubscribe profile={profile} isOwnProfile={isOwnProfile} />
        </div>
      </div>
      
      <ProfileHeaderBio 
        profile={profile} 
        isOwnProfile={isOwnProfile} 
        isEditing={isEditing} 
        showFullBio={showFullBio} 
        setShowFullBio={setShowFullBio} 
      />
      
      <ProfileHeaderInfo profile={profile} isOwnProfile={isOwnProfile} isEditing={isEditing} />
    </div>
  );
};
