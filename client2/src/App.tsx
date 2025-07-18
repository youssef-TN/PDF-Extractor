import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import DocumentProcessor from "./components/DocumentProcessor";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/process" element={<DocumentProcessor />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;


