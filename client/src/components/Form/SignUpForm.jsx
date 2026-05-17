import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import SocialButton from "../Button/SocialButton";
import { registerUser } from "../../api/auth.api.js";

function SignUpForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { values, handleSubmit, handleChange, isSubmitting } = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
    },
    onSubmit: async (formValues, { setSubmitting }) => {
      setError("");

      try {
        await registerUser(formValues);
        navigate("/dashboard");
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "We could not create your account. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="flex min-h-[720px] flex-col justify-between bg-[#f7f8fb] px-6 py-8 sm:px-10 lg:px-12">
      <div>
        <div className="mb-10 lg:hidden">
          <p className="text-lg font-bold text-[#111827]">Optivio AI</p>
        </div>

        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#6d5dfc]">
            Create workspace
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#111827] sm:text-4xl">
            Start optimizing smarter.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#667085]">
            Build your SEO command center with audits, keywords, reports, and AI
            insights in one place.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <SocialButton text="Google" icon="G" />
          <SocialButton text="SSO" icon="S" />
        </div>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#d9dde7]" />
          <span className="text-xs font-semibold tracking-wide text-[#98a2b3]">
            OR EMAIL
          </span>
          <div className="h-px flex-1 bg-[#d9dde7]" />
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#344054]">
              Username
            </label>
            <input
              type="text"
              placeholder="shivam"
              name="userName"
              value={values.userName}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
              required
            />
          </div>

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
              className="h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#344054]">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#6d5dfc] focus:ring-4 focus:ring-[#6d5dfc]/15"
              minLength={6}
              required
            />
          </div>

          <label className="flex items-start gap-3 text-sm leading-5 text-[#667085]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-[#d0d5dd] accent-[#6d5dfc]"
              required
            />
            I agree to the terms, privacy policy, and product updates.
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-[#6d5dfc] px-4 text-sm font-bold text-white shadow-lg shadow-[#6d5dfc]/20 transition hover:bg-[#5a4ee8] disabled:cursor-not-allowed disabled:bg-[#a9a3f8]"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#667085]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-[#5a4ee8] hover:text-[#4338ca]"
          >
            Sign in
          </button>
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-[#e4e7ec] bg-white p-4">
        <p className="text-sm font-semibold text-[#101828]">AI insight</p>
        <p className="mt-1 text-sm leading-6 text-[#667085]">
          Precision targeting can lift campaign ROI by up to 42%.
        </p>
      </div>
    </section>
  );
}

export default SignUpForm;
