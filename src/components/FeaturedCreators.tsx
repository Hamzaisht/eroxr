
import { CreatorCard } from "./CreatorCard";

const FEATURED_CREATORS = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    username: "Sophie Dreams",
    avatarUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    banner: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    bio: "Lifestyle and wellness content creator sharing daily inspiration.",
    followerCount: 1234,
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0852",
    username: "Alex Arts",
    avatarUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    banner: "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
    bio: "Digital artist creating unique and mesmerizing artwork.",
    followerCount: 2345,
  },
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0853",
    username: "Luna Star",
    avatarUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
    banner: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
    bio: "Fashion and beauty tips for the modern woman.",
    followerCount: 3456,
  },
];

export const FeaturedCreators = () => {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-soft-purple/50 to-soft-pink/30" />
      <div className="container relative z-10">
        <div className="animate-fade-in space-y-6 text-center">
          <h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Featured Creators
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">
            Discover and support amazing creators who inspire and entertain
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CREATORS.map((creator) => (
            <CreatorCard key={creator.id} {...creator} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
    </section>
  );
};
