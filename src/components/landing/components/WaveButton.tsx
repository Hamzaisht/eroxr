
interface WaveButtonProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const WaveButton = ({ children, className, ...props }: WaveButtonProps) => {
  return (
    <button 
      className={`relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out rounded-full group ${className}`} 
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-luxury-primary group-hover:translate-x-0 ease">
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </span>
      <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
        {children}
      </span>
      <span className="relative invisible">{children}</span>
    </button>
  );
};
