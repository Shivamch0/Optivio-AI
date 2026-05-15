// components/testimonials/TestimonialCard.jsx

export default function TestimonialCard({ quote, image, name, role }) {
  return (
    <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
      {/* Stars */}
      <div className="flex gap-1 text-purple-600 mb-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>★</span>
          ))}
      </div>

      {/* Quote */}
      <p className="text-gray-600 italic text-lg leading-relaxed mb-10">
        "{quote}"
      </p>

      {/* User */}
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h4 className="font-bold text-lg">{name}</h4>

          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}
