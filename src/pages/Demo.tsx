import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
            Experience the Platform
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            This is a demo page that will be enhanced with more features in the future. For now, you can explore our platform and see how it works.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2"
              size="lg"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              Start Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;