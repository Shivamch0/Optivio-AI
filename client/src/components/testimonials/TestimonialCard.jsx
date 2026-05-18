export default function TestimonialCard({ quote, image, name, role }) {
  return (
    <div className="rounded-lg border border-[#dde3ee] bg-white p-5 shadow-sm transition hover:shadow-lg">
      <div className="mb-4 flex gap-1 text-[#f59e0b]">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>*</span>
          ))}
      </div>

      <p className="mb-6 text-sm italic leading-6 text-gray-600">"{quote}"</p>

      <div className="flex items-center gap-4">
        <img src={image} alt={name} className="h-12 w-12 rounded-full object-cover" />

        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
