import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Shorts from "@/pages/Shorts";
import Dating from "@/pages/Dating";
import Messages from "@/pages/Messages";
import Eroboard from "@/pages/Eroboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/dating" element={<Dating />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/eroboard" element={<Eroboard />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
