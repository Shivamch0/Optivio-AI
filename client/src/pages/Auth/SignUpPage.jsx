import SignUpForm from "../../components/Form/SignUpForm";
import AuthPagePannel from "../../components/Pannel/AuthPagePannel";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-7xl bg-[#121826] rounded-2xl overflow-hidden shadow-2xl border border-[#2a2f45]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <SignUpForm />
        <AuthPagePannel />
      </div>
    </div>
  );
}
