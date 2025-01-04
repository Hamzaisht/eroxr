import { useNavigate } from "react-router-dom";

export const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <h1 
      onClick={() => navigate("/")}
      className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent cursor-pointer"
    >
      Eroxr
    </h1>
  );
};