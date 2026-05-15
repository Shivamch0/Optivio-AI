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
        rounded-3xl
        p-8
        border
        transition-all
        hover:shadow-xl
        ${
          dark
            ? "bg-purple-700 text-white border-purple-700"
            : "bg-white border-gray-200"
        }
        ${className}
      `}
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 text-2xl">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">{title}</h3>

      <p
        className={`leading-relaxed ${
          dark ? "text-purple-100" : "text-gray-600"
        }`}
      >
        {description}
      </p>

      {image && (
        <img
          src={image}
          alt={title}
          className="mt-8 rounded-2xl w-full h-56 object-cover"
        />
      )}
    </div>
  );
}
