import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./components/routes/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const SignUpPage = lazy(() => import("./pages/Auth/SignUpPage"));
const Admin = lazy(() => import("./pages/Admin"));
const AIInsights = lazy(() => import("./pages/AIInsights"));
const Audits = lazy(() => import("./pages/Audits"));
const Competitors = lazy(() => import("./pages/Competitors"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Keywords = lazy(() => import("./pages/Keywords"));
const Landing = lazy(() => import("./pages/Landing"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Websites = lazy(() => import("./pages/Websites"));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-sm font-semibold text-[#667085]">
    Loading...
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
}

export default App;
