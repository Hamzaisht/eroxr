
// Fix the ad object to include all required properties
const enrichedAd: DatingAd = {
  ...ad,
  tags: ad.tags || [],
  location: ad.location || "Unknown location",
  age: ad.age || 25, // Default age
  views: ad.views || 0 // Required property
};

return <VideoProfileCard ad={enrichedAd} />;
