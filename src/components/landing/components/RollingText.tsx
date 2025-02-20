
import { Link } from "react-router-dom";

interface RollingTextProps {
  children: string;
  href: string;
}

export const RollingText = ({ children, href }: RollingTextProps) => {
  return (
    <Link 
      to={href} 
      className="group relative inline-block overflow-hidden px-4 py-2 text-white"
    >
      <span className="relative inline-block transition-transform duration-300 group-hover:translate-y-full opacity-0">
        {children}
      </span>
      <span className="absolute left-0 top-0 inline-block transition-transform duration-300">
        {children}
      </span>
    </Link>
  );
};
