import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {(user) => <Dashboard user={user} />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
