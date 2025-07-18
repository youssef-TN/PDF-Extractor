import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import DocumentProcessor from "./components/DocumentProcessor";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/process" element={<DocumentProcessor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


