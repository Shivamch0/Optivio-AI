import LoginForm from "../../components/Form/LoginForm";
import AuthPagePannel from "../../components/Pannel/AuthPagePannel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#10141f] px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
          <AuthPagePannel />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
