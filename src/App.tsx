
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Home from "./pages/Home";
import { ensureStorageBuckets } from "./utils/upload/ensureBuckets";

function App() {
  useEffect(() => {
    // Ensure all required storage buckets exist
    ensureStorageBuckets().catch(err => 
      console.error("Error initializing storage buckets:", err)
    );
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
