import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeDetails, changePassword } from "../api/auth.api.js";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export default function Profile({ user }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    companyName: user?.companyName || "",
    teamName: user?.teamName || "",
    subscriptionPlan: user?.subscriptionPlan || "free",
    avatar: user?.avatar || "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await changeDetails(profile);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not update profile."));
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await changePassword(passwords);
      setPasswords({ oldPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not change password."));
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] px-6 py-8 text-[#101828]">
      <main className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-lg border border-[#d0d5dd] bg-white px-4 py-2 text-sm font-bold text-[#344054]"
        >
          Back to dashboard
        </button>

        <section className="rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Account profile</h1>
          <p className="mt-2 text-sm text-[#667085]">
            Manage workspace identity, plan metadata, and password security.
          </p>

          {message && (
            <div className="mt-4 rounded-lg border border-[#d9dde7] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#344054]">
              {message}
            </div>
          )}

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleProfileSubmit}>
            {[
              ["userName", "Username"],
              ["email", "Email"],
              ["companyName", "Company"],
              ["teamName", "Team"],
              ["avatar", "Avatar URL"],
            ].map(([name, label]) => (
              <label key={name} className="text-sm font-medium text-[#344054]">
                {label}
                <input
                  name={name}
                  value={profile[name]}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      [event.target.name]: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
                />
              </label>
            ))}

            <label className="text-sm font-medium text-[#344054]">
              Subscription
              <select
                name="subscriptionPlan"
                value={profile.subscriptionPlan}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    subscriptionPlan: event.target.value,
                  }))
                }
                className="mt-2 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>

            <button
              type="submit"
              className="h-11 rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white sm:col-span-2"
            >
              Save profile
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Change password</h2>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Current password"
              value={passwords.oldPassword}
              onChange={(event) =>
                setPasswords((current) => ({ ...current, oldPassword: event.target.value }))
              }
              className="h-11 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords((current) => ({ ...current, newPassword: event.target.value }))
              }
              className="h-11 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="h-11 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white sm:col-span-2"
            >
              Update password
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
