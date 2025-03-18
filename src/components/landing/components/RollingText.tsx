
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
      <div className="relative overflow-hidden h-[1.5em]">
        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute left-0 top-full block transition-transform duration-300 group-hover:-translate-y-full">
          {children}
        </span>
      </div>
    </Link>
  );
};
