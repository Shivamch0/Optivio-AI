export default function FeatureCard({
  title,
  description,
  icon,
  className = "",
  dark = false,
  image,
}) {
  return (
    <div
      className={`
        rounded-lg
        p-5
        border
        transition-all
        hover:shadow-xl
        ${
          dark
            ? "bg-[#101828] text-white border-[#101828]"
            : "bg-white border-gray-200"
        }
        ${className}
      `}
    >
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${dark ? "bg-white/10 text-white" : "bg-[#eff6ff] text-[#175cd3]"}`}>
        {icon}
      </div>

      <h3 className="mb-2 text-xl font-bold">{title}</h3>

      <p
        className={`text-sm leading-6 ${
          dark ? "text-[#d0d5dd]" : "text-gray-600"
        }`}
      >
        {description}
      </p>

      {image && (
        <img
          src={image}
          alt={title}
          className="mt-5 h-44 w-full rounded-lg object-cover"
        />
      )}
    </div>
  );
}
