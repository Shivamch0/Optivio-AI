import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestPasswordReset, resetPassword } from "../../api/auth.api.js";
import { getErrorMessage } from "../../utils/dashboard.js";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await requestPasswordReset({ email });
      setToken(res.data?.resetToken || "");
      setMessage(res.message || "Reset instructions generated.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not request password reset."));
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await resetPassword({ token, newPassword });
      setMessage("Password reset successfully. You can sign in now.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not reset password."));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#10141f] px-4 py-8">
      <main className="w-full max-w-xl rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-[#111827]">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Generate a reset token, then set a new password. In production this token should be sent by email.
        </p>

        {message && (
          <div className="mt-5 rounded-lg border border-[#d9dde7] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#344054]">
            {message}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleRequest}>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#d0d5dd] px-4 text-sm outline-none"
          />
          <button
            type="submit"
            className="h-12 w-full rounded-lg bg-[#6d5dfc] text-sm font-bold text-white"
          >
            Generate reset token
          </button>
        </form>

        <form className="mt-8 space-y-4" onSubmit={handleReset}>
          <input
            placeholder="Reset token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#d0d5dd] px-4 text-sm outline-none"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#d0d5dd] px-4 text-sm outline-none"
          />
          <button
            type="submit"
            className="h-12 w-full rounded-lg bg-[#101828] text-sm font-bold text-white"
          >
            Reset password
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 text-sm font-bold text-[#5a4ee8]"
        >
          Back to sign in
        </button>
      </main>
    </div>
  );
}
