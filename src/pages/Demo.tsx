import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

const Demo = () => {
  const navigate = useNavigate();

  return (
    <Home />
  );
};

export default Demo;