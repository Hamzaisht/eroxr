
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavButtonsProps {
  orientation?: "horizontal" | "vertical";
}

export const NavButtons = ({ orientation = "horizontal" }: NavButtonsProps) => {
  return (
    <div className={`flex ${orientation === "vertical" ? "flex-col space-y-4" : "flex-row space-x-4"} items-center`}>
      <Button variant="ghost" asChild className="nav-item-liquid">
        <Link to="/about" className="text-luxury-neutral hover:text-white">
          About
        </Link>
      </Button>
      <Button variant="ghost" asChild className="nav-item-liquid">
        <Link to="/creators" className="text-luxury-neutral hover:text-white">
          Creators
        </Link>
      </Button>
      <Button variant="ghost" asChild className="nav-item-liquid">
        <Link to="/auth" className="text-luxury-neutral hover:text-white">
          Log In
        </Link>
      </Button>
      <Button asChild className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary transition-all duration-500">
        <Link to="/register" className="text-white">
          Get Started
        </Link>
      </Button>
    </div>
  );
};
