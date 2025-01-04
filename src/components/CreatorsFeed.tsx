import { Rss, Image, Video, BookOpen, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const FEED_SECTIONS = [
  {
    title: "Latest Updates",
    icon: Rss,
    content: "Stay up to date with your favorite creators' latest posts",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
  },
  {
    title: "Photos & Art",
    icon: Image,
    content: "Discover stunning visual content from talented artists",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  },
  {
    title: "Videos",
    icon: Video,
    content: "Watch engaging videos from creators worldwide",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
  },
  {
    title: "Articles",
    icon: BookOpen,
    content: "Read insightful articles and stories",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    title: "Tutorials",
    icon: FileText,
    content: "Learn new skills with educational content",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
];

export const CreatorsFeed = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Explore Creator Content
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing content across different formats and categories
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEED_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute inset-0">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  />
                </div>
                <div className="relative p-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-primary/10 rounded-full backdrop-blur-sm">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                  <p className="text-muted-foreground">{section.content}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
};