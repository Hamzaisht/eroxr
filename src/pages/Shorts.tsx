
import { useEffect } from "react";
import Eros from "./Eros";

const Shorts = () => {
  // Set page title
  useEffect(() => {
    document.title = "Shorts - Short Videos";
  }, []);

  return <Eros />;
};

export default Shorts;
