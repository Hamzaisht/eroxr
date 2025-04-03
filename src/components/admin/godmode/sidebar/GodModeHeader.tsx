
import { Link } from "react-router-dom";

export const GodModeHeader = () => {
  return (
    <Link to="/admin/godmode" className="flex items-center mb-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
        God Mode
      </h2>
    </Link>
  );
};
