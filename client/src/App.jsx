import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import Landing from "./pages/Landing";

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
        <Routes>

          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
