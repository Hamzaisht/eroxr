import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Categories from "@/pages/Categories";
import Eroboard from "@/pages/Eroboard";
import Settings from "@/pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/eroboard" element={<Eroboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;