
import { Link } from "react-router-dom";

export const AdminHeader = () => {
  return (
    <Link to="/admin" className="flex items-center mb-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
        Admin Panel
      </h2>
    </Link>
  );
};
