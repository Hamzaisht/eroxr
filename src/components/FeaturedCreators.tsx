import { CreatorCard } from "./CreatorCard";

const FEATURED_CREATORS = [
  {
    name: "Sophie Dreams",
    image: "/placeholder.svg",
    description: "Lifestyle and wellness content creator sharing daily inspiration.",
    subscribers: 1234,
  },
  {
    name: "Alex Arts",
    image: "/placeholder.svg",
    description: "Digital artist creating unique and mesmerizing artwork.",
    subscribers: 2345,
  },
  {
    name: "Luna Star",
    image: "/placeholder.svg",
    description: "Fashion and beauty tips for the modern woman.",
    subscribers: 3456,
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
            <CreatorCard key={creator.name} {...creator} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
    </section>
  );
};