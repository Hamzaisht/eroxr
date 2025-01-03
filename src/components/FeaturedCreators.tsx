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
    <section className="py-12">
      <h2 className="mb-8 text-center text-3xl font-bold">Featured Creators</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURED_CREATORS.map((creator) => (
          <CreatorCard key={creator.name} {...creator} />
        ))}
      </div>
    </section>
  );
};