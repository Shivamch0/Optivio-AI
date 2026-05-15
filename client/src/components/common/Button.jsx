export default function Button({ children, className = "", full = false , fn }) {
  return (
    <button
    onClick={fn}
      className={`
        ${full ? "w-full" : ""}
        bg-purple-700
        hover:bg-purple-800
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        transition-all
        active:scale-95
        shadow-md
        hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </button>
  );
}
