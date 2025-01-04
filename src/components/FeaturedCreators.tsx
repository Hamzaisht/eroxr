import { CreatorCard } from "./CreatorCard";

const FEATURED_CREATORS = [
  {
    name: "Sophie Dreams",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    description: "Lifestyle and wellness content creator sharing daily inspiration.",
    subscribers: 1234,
    creatorId: "d290f1ee-6c54-4b01-90e6-d701748f0851", // Example UUID
  },
  {
    name: "Alex Arts",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Digital artist creating unique and mesmerizing artwork.",
    subscribers: 2345,
    creatorId: "d290f1ee-6c54-4b01-90e6-d701748f0852", // Example UUID
  },
  {
    name: "Luna Star",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    description: "Fashion and beauty tips for the modern woman.",
    subscribers: 3456,
    creatorId: "d290f1ee-6c54-4b01-90e6-d701748f0853", // Example UUID
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
            <CreatorCard key={creator.creatorId} {...creator} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
    </section>
  );
};