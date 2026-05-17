function SocialButton({ text, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#d9dde7] bg-white px-4 text-sm font-semibold text-[#263142] transition hover:border-[#bfc7d7] hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#6d5dfc]/25"
    >
      {icon && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-bold text-[#4f46e5]">
          {icon}
        </span>
      )}
      {text}
    </button>
  );
}

export default SocialButton
