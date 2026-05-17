import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import SocialButton from "../Button/SocialButton";
import Toast from "../common/Toast";
import { getSsoLogin, loginUser, loginWithGoogle } from "../../api/auth.api.js";

const validateLogin = (values) => {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Work email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    values,
    errors,
    touched,
    dirty,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
    isValid,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    validateOnMount: true,
    onSubmit: async (formValues, { setSubmitting }) => {
      setError("");

      try {
        await loginUser(formValues);
        navigate("/dashboard");
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "We could not sign you in. Check your details and try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    const idToken = window.prompt("Paste a Google ID token from Google Identity Services");
    if (!idToken) return;

    try {
      await loginWithGoogle(idToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Google login is not configured yet.");
    }
  };

  const handleSsoLogin = async () => {
    try {
      const res = await getSsoLogin();
      window.location.href = res.data.url;
    } catch (err) {
      setError(err?.response?.data?.message || "SSO login is not configured yet.");
    }
  };

  return (
    <section className="flex min-h-[720px] flex-col justify-between bg-[#f7f8fb] px-6 py-8 sm:px-10 lg:px-12">
      <div>
        <div className="mb-10 lg:hidden">
          <p className="text-lg font-bold text-[#111827]">Optivio AI</p>
        </div>

        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#6d5dfc]">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">
            Continue your search growth.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Access your dashboards, keyword movement, audits, and AI-backed SEO
            priorities.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <SocialButton text="Google" icon="G" onClick={handleGoogleLogin} />
          <SocialButton text="SSO" icon="S" onClick={handleSsoLogin} />
        </div>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#d9dde7]" />
          <span className="text-xs font-semibold tracking-wide text-[#98a2b3]">
            OR EMAIL
          </span>
          <div className="h-px flex-1 bg-[#d9dde7]" />
        </div>

        <Toast message={error} onClose={() => setError("")} />

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#344054]">
              Work email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
              required
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344054]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
              required
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-xs font-semibold text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 text-[#667085]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#d0d5dd] accent-[#6d5dfc]"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="font-semibold text-[#5a4ee8] hover:text-[#4338ca]"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
            className="h-12 w-full rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white shadow-lg shadow-[#6d5dfc]/20 transition hover:bg-[#5a4ee8] disabled:cursor-not-allowed disabled:bg-[#a9a3f8]"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#667085]">
          Do not have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-semibold text-[#5a4ee8] hover:text-[#4338ca]"
          >
            Get started
          </button>
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-[#e4e7ec] bg-white p-4">
        <p className="text-sm font-semibold text-[#101828]">AI insight</p>
        <p className="mt-1 text-sm leading-6 text-[#667085]">
          High-intent keywords are easiest to act on when audits and analytics
          stay connected.
        </p>
      </div>
    </section>
  );
}

export default LoginForm;
