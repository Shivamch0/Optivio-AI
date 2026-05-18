import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import Admin from "./pages/Admin";
import AIInsights from "./pages/AIInsights";
import Audits from "./pages/Audits";
import Competitors from "./pages/Competitors";
import Dashboard from "./pages/Dashboard";
import Keywords from "./pages/Keywords";
import Landing from "./pages/Landing";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Websites from "./pages/Websites";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {(user) => <Dashboard user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {(user) => <Profile user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/websites"
        element={
          <ProtectedRoute>
            {(user) => <Websites user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/audits"
        element={
          <ProtectedRoute>
            {(user) => <Audits user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/keywords"
        element={
          <ProtectedRoute>
            {(user) => <Keywords user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/competitors"
        element={
          <ProtectedRoute>
            {(user) => <Competitors user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            {(user) => <AIInsights user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            {(user) => <Notifications user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            {(user) => <Settings user={user} />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {() => <Admin />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
