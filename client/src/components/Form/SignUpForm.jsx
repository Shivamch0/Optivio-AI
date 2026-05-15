import SocialButton from "../Button/SocialButton";
import { useFormik } from "formik";

function SignUpForm() {
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div className="bg-[#f8f8fb] px-10 py-12 flex flex-col justify-between">
      <div>
        <h2 className="text-4xl font-bold text-[#111827]">Let's Start</h2>

        <p className="text-gray-500 mt-2">Access your precision SEO engine.</p>

        <div className="mt-8 space-y-4">
          <SocialButton text="Continue with Google" />
          <SocialButton text="Continue with SSO" />
        </div>

        <div className="flex items-center gap-3 my-8">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-gray-400 text-sm">OR EMAIL</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Username</label>

            <input
              type="text"
              placeholder="john"
              name="name"
              value={values.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Work Email
            </label>

            <input
              type="email"
              placeholder="name@company.com"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Password</label>

            <input
              type="password"
              placeholder="••••••••"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-500">
              <input type="checkbox" />
              Terms & Conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-purple-600 font-semibold cursor-pointer">
            Sign In
          </span>
        </p>
      </div>

      <div className="mt-10">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              ✦
            </div>

            <div>
              <p className="font-semibold text-gray-800">AI Insight</p>

              <p className="text-gray-500 text-sm mt-1">
                Precision targeting can increase ROI by up to 42%.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 text-xs text-gray-400 mt-8">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
