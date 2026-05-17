import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, refreshToken } from "../../api/auth.api.js";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    status: "loading",
    user: null,
  });

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        let res;

        try {
          res = await getCurrentUser();
        } catch {
          await refreshToken();
          res = await getCurrentUser();
        }

        if (isMounted) {
          setAuthState({ status: "authenticated", user: res.data });
        }
      } catch {
        if (isMounted) {
          setAuthState({ status: "unauthenticated", user: null });
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef2f7] px-6">
        <div className="rounded-xl border border-[#dde3ee] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#e4e7ec] border-t-[#6d5dfc]" />
          <p className="text-sm font-semibold text-[#344054]">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (authState.status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children(authState.user);
}

export default ProtectedRoute;
