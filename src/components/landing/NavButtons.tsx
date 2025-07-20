
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavButtonsProps {
  orientation?: "horizontal" | "vertical";
}

export const NavButtons = ({ orientation = "horizontal" }: NavButtonsProps) => {
  return (
    <div className={`flex ${orientation === "vertical" ? "flex-col space-y-4" : "flex-row space-x-4"} items-center`}>
      <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors">
        <Link to="/about">
          About
        </Link>
      </Button>
      <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors">
        <Link to="/creators">
          Creators
        </Link>
      </Button>
      <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground transition-colors">
        <Link to="/auth">
          Log In
        </Link>
      </Button>
      <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-500 text-primary-foreground">
        <Link to="/register">
          Get Started
        </Link>
      </Button>
    </div>
  );
};
