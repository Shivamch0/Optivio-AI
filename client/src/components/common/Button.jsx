export default function Button({ children, className = "", full = false , fn }) {
  return (
    <button
    onClick={fn}
      className={`
        ${full ? "w-full" : ""}
        bg-[#101828]
        hover:bg-[#1d2939]
        text-white
        px-5
        py-3
        rounded-lg
        font-semibold
        transition-all
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
}
