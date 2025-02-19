
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavButtonsProps {
  orientation?: "horizontal" | "vertical";
}

export const NavButtons = ({ orientation = "horizontal" }: NavButtonsProps) => {
  return (
    <div className={`flex ${orientation === "vertical" ? "flex-col space-y-4" : "flex-row space-x-4"} items-center`}>
      <Button variant="ghost" asChild>
        <Link to="/about" className="text-luxury-neutral hover:text-white">
          About
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/creators" className="text-luxury-neutral hover:text-white">
          Creators
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/login" className="text-luxury-neutral hover:text-white">
          Log In
        </Link>
      </Button>
      <Button asChild>
        <Link to="/register" className="bg-luxury-primary hover:bg-luxury-primary/90">
          Get Started
        </Link>
      </Button>
    </div>
  );
};
