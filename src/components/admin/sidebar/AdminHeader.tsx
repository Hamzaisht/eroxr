
import { Link } from "react-router-dom";

interface AdminHeaderProps {
  title?: string;
  section?: string;
}

export const AdminHeader = ({ title = "Admin Panel", section }: AdminHeaderProps) => {
  return (
    <Link to="/admin" className="flex items-center mb-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent">
        {section ? `${section} - ${title}` : title}
      </h2>
    </Link>
  );
};
