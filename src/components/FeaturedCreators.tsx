// Import components and utilities
import { useEffect, useState } from "react";
import { CreatorCard } from "@/components/CreatorCard";

export const FeaturedCreators = () => {
  const [creators, setCreators] = useState([
    {
      key: "1",
      name: "Alice Wonderland",
      image: "https://i.pravatar.cc/150?img=1",
      banner: "https://source.unsplash.com/800x200/?nature",
      description: "Exploring the depths of creativity and sharing my journey with you.",
      subscribers: 2345,
      creatorId: "uniqueId1",
    },
    {
      key: "2",
      name: "Bob The Builder",
      image: "https://i.pravatar.cc/150?img=2",
      banner: "https://source.unsplash.com/800x200/?city",
      description: "Building dreams one block at a time. Join me in constructing a better world.",
      subscribers: 1876,
      creatorId: "uniqueId2",
    },
    {
      key: "3",
      name: "Charlie Chaplin",
      image: "https://i.pravatar.cc/150?img=3",
      banner: "https://source.unsplash.com/800x200/?abstract",
      description: "Bringing laughter and joy through timeless stories and silent expressions.",
      subscribers: 3012,
      creatorId: "uniqueId3",
    },
  ]);

  useEffect(() => {
    // Simulate fetching featured creators from an API
    // In a real application, you would replace this with an actual API call
    setTimeout(() => {
      setCreators([
        {
          key: "4",
          name: "Diana Prince",
          image: "https://i.pravatar.cc/150?img=4",
          banner: "https://source.unsplash.com/800x200/?fantasy",
          description: "Empowering women and fighting for justice in a world of chaos.",
          subscribers: 4123,
          creatorId: "uniqueId4",
        },
        {
          key: "5",
          name: "Ethan Hunt",
          image: "https://i.pravatar.cc/150?img=5",
          banner: "https://source.unsplash.com/800x200/?adventure",
          description: "On a mission to save the world, one impossible task at a time.",
          subscribers: 2879,
          creatorId: "uniqueId5",
        },
      ]);
    }, 1500);
  }, []);

  // Update the CreatorCard usage for compatibility
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.creatorId}
          id={creator.creatorId}
          username={creator.name}
          avatarUrl={creator.image}
          banner={creator.banner}
          bio={creator.description}
          followerCount={creator.subscribers}
          isVerified={true}
          isPremium={Math.random() > 0.5}
        />
      ))}
    </div>
  );
};
