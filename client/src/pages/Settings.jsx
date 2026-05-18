import { useState } from "react";
import { changeDetails, changePassword } from "../api/auth.api.js";
import AppLayout from "../layouts/AppLayout.jsx";
import { buttonDark, getErrorMessage, input, pageShell, panel } from "../utils/dashboard.js";

export default function Settings({ user }) {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    companyName: user?.companyName || "",
    teamName: user?.teamName || "",
    avatar: user?.avatar || "",
  });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const handleProfile = async (event) => {
    event.preventDefault();
    try {
      await changeDetails(profile);
      setMessage("Settings updated.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not update settings."));
    }
  };

  const handlePassword = async (event) => {
    event.preventDefault();
    try {
      await changePassword(passwords);
      setPasswords({ oldPassword: "", newPassword: "" });
      setMessage("Password changed.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not change password."));
    }
  };

  return (
    <AppLayout user={user}>
      <div className={pageShell}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-[#667085]">Workspace identity and account security.</p>
        {message && <div className="mt-4 rounded-lg border border-[#d9dde7] bg-white px-4 py-3 text-sm font-semibold text-[#344054]">{message}</div>}

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <form className={panel} onSubmit={handleProfile}>
            <h2 className="text-lg font-bold">Profile details</h2>
            <div className="mt-5 grid gap-4">
              {[
                ["userName", "Username"],
                ["email", "Email"],
                ["companyName", "Company"],
                ["teamName", "Team"],
                ["avatar", "Avatar URL"],
              ].map(([name, label]) => (
                <label key={name} className="text-sm font-medium text-[#344054]">
                  {label}
                  <input name={name} value={profile[name]} onChange={(event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))} className={`mt-2 ${input}`} />
                </label>
              ))}
            </div>
            <button className={`mt-5 ${buttonDark}`}>Save settings</button>
          </form>

          <form className={panel} onSubmit={handlePassword}>
            <h2 className="text-lg font-bold">Change password</h2>
            <div className="mt-5 grid gap-4">
              <input type="password" value={passwords.oldPassword} onChange={(event) => setPasswords((current) => ({ ...current, oldPassword: event.target.value }))} className={input} placeholder="Current password" />
              <input type="password" value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} className={input} placeholder="New password" />
            </div>
            <button className={`mt-5 ${buttonDark}`}>Update password</button>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
