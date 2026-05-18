import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeDetails, changePassword } from "../api/auth.api.js";
import { createCheckout, getBillingHistory } from "../api/billing.api.js";
import { createTeam, getTeams, inviteMember, removeMember } from "../api/team.api.js";
import { LoadingPanel } from "../components/common/LoadingState.jsx";

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
    avatar: user?.avatar || "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [teams, setTeams] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [invitingMember, setInvitingMember] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [invite, setInvite] = useState({ teamId: "", email: "", role: "member" });

  useEffect(() => {
    Promise.resolve().then(async () => {
      const [teamRes, billingRes] = await Promise.allSettled([
        getTeams(),
        getBillingHistory(),
      ]);
      if (teamRes.status === "fulfilled") setTeams(teamRes.value.data);
      if (billingRes.status === "fulfilled") setBillingHistory(billingRes.value.data);
      setLoadingWorkspace(false);
    });
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSavingProfile(true);

    try {
      await changeDetails(profile);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not update profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCheckout = async (plan) => {
    try {
      const res = await createCheckout(plan);
      window.location.href = res.data.checkoutUrl;
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not start checkout."));
    }
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    if (!teamName.trim()) return;
    setCreatingTeam(true);

    try {
      const res = await createTeam(teamName);
      setTeams((current) => [res.data, ...current]);
      setInvite((current) => ({ ...current, teamId: res.data._id }));
      setTeamName("");
      setMessage("Team created.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not create team."));
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!invite.teamId || !invite.email.trim()) return;
    setInvitingMember(true);

    try {
      const res = await inviteMember(invite.teamId, {
        email: invite.email,
        role: invite.role,
      });
      setTeams((current) =>
        current.map((team) => (team._id === res.data._id ? res.data : team)),
      );
      setInvite((current) => ({ ...current, email: "" }));
      setMessage("Invitation saved.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not invite member."));
    } finally {
      setInvitingMember(false);
    }
  };

  const handleRemoveMember = async (teamId, email) => {
    try {
      const res = await removeMember(teamId, email);
      setTeams((current) =>
        current.map((team) => (team._id === res.data._id ? res.data : team)),
      );
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not remove member."));
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSavingPassword(true);

    try {
      await changePassword(passwords);
      setPasswords({ oldPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Could not change password."));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#eef2f7] px-4 py-4 text-[#101828]">
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

          {loadingWorkspace && (
            <div className="mt-5">
              <LoadingPanel label="Loading profile workspace" detail="Fetching billing history and team information..." />
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
              Current plan
              <input
                value={user?.subscriptionPlan || "free"}
                readOnly
                className="mt-2 h-11 w-full rounded-lg border border-[#d0d5dd] bg-[#f8fafc] px-3 text-sm capitalize text-[#667085] outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={savingProfile}
              className="h-11 rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white sm:col-span-2"
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Billing</h2>
          <p className="mt-1 text-sm text-[#667085]">
            Start a provider checkout when Stripe is configured, or use mock checkout in development.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {loadingWorkspace ? (
              <div className="rounded-lg border border-dashed border-[#d0d5dd] p-4 text-sm font-semibold text-[#667085] sm:col-span-3">
                Loading billing options...
              </div>
            ) : ["free", "pro", "enterprise"].map((plan) => (
              <div key={plan} className="rounded-lg border border-[#e4e7ec] p-4">
                <p className="font-bold capitalize">{plan}</p>
                <button
                  type="button"
                  disabled={plan === "free"}
                  onClick={() => handleCheckout(plan)}
                  className="mt-4 h-10 w-full rounded-lg bg-[#101828] text-sm font-bold text-white disabled:bg-[#98a2b3]"
                >
                  {plan === "free" ? "Current base" : "Checkout"}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {billingHistory.slice(0, 4).map((event) => (
              <p key={event._id} className="text-sm text-[#667085]">
                {event.plan} - {event.provider} - {event.status}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[#dde3ee] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Team workspace</h2>
          <form className="mt-4 flex gap-3" onSubmit={handleCreateTeam}>
            <input
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Growth team"
              className="h-11 min-w-0 flex-1 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
            />
            <button className="h-11 rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white" disabled={creatingTeam}>
              {creatingTeam ? "Creating..." : "Create team"}
            </button>
          </form>

          <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_0.7fr_auto]" onSubmit={handleInvite}>
            <select
              value={invite.teamId}
              onChange={(event) => setInvite((current) => ({ ...current, teamId: event.target.value }))}
              className="h-11 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
            >
              <option value="">Choose team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
            <input
              value={invite.email}
              onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))}
              placeholder="teammate@company.com"
              className="h-11 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
            />
            <select
              value={invite.role}
              onChange={(event) => setInvite((current) => ({ ...current, role: event.target.value }))}
              className="h-11 rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button className="h-11 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white" disabled={invitingMember}>
              {invitingMember ? "Inviting..." : "Invite"}
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {teams.map((team) => (
              <div key={team._id} className="rounded-lg border border-[#e4e7ec] p-4">
                <p className="font-bold">{team.name}</p>
                <div className="mt-3 space-y-2">
                  {team.members.map((member) => (
                    <div key={member.email} className="flex items-center justify-between gap-3 text-sm text-[#667085]">
                      <span>{member.email} - {member.role} - {member.status}</span>
                      {member.role !== "owner" && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(team._id, member.email)}
                          className="font-bold text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
              disabled={savingPassword}
              className="h-11 rounded-lg bg-[#101828] px-4 text-sm font-bold text-white sm:col-span-2"
            >
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
